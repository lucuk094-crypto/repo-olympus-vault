from flask import Flask, render_template, request, redirect, url_for, session, send_file, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from functools import wraps
import sqlite3
import os
import hashlib
import secrets
from datetime import datetime
from cryptography.fernet import Fernet
import base64

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024

# Use /tmp for Railway (ephemeral storage) or local folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'static/uploads'))
DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'backend/vault.db'))

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folders exist
for subfolder in ['documents', 'images', 'videos', 'apk', 'others']:
    os.makedirs(os.path.join(UPLOAD_FOLDER, subfolder), exist_ok=True)

# Rate limiting with memory storage (for production use Redis)
try:
    limiter = Limiter(app=app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])
except:
    limiter = None

ALLOWED_EXTENSIONS = {
    'documents': ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    'images': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
    'videos': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
    'apk': ['apk'],
    'others': ['zip', 'rar', '7z', 'tar', 'gz']
}

def get_category(filename):
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    for category, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return category
    return 'others'

def allowed_file(filename):
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    all_ext = []
    for e in ALLOWED_EXTENSIONS.values():
        all_ext.extend(e)
    return ext in all_ext

def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_login TIMESTAMP)')
    c.execute('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, filename TEXT NOT NULL, original_name TEXT NOT NULL, file_path TEXT NOT NULL, file_size INTEGER NOT NULL, file_type TEXT NOT NULL, category TEXT NOT NULL, encrypted_key TEXT NOT NULL, upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))')
    conn.commit()
    conn.close()

init_db()

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return base64.b64encode(hashed).decode(), salt

def verify_password(password, stored_hash, salt):
    hashed, _ = hash_password(password, salt)
    return secrets.compare_digest(hashed, stored_hash)

def generate_key():
    return Fernet.generate_key()

def encrypt_file(file_data, key):
    return Fernet(key).encrypt(file_data)

def decrypt_file(encrypted_data, key):
    return Fernet(key).decrypt(encrypted_data)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if limiter:
        limiter.limit("5 per hour")(lambda: None)()
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        if len(username) < 4 or len(password) < 8:
            return render_template('register.html', error='Username min 4 karakter, password min 8 karakter')
        password_hash, salt = hash_password(password)
        try:
            conn = get_db()
            c = conn.cursor()
            c.execute('INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)', (username, password_hash, salt))
            conn.commit()
            conn.close()
            return redirect(url_for('login', success='true'))
        except sqlite3.IntegrityError:
            return render_template('register.html', error='Username sudah digunakan')
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if limiter:
        limiter.limit("10 per hour")(lambda: None)()
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        conn = get_db()
        c = conn.cursor()
        c.execute('SELECT id, password_hash, salt FROM users WHERE username = ?', (username,))
        user = c.fetchone()
        if user and verify_password(password, user['password_hash'], user['salt']):
            session['user_id'] = user['id']
            session['username'] = username
            c.execute('UPDATE users SET last_login = ? WHERE id = ?', (datetime.now(), user['id']))
            conn.commit()
            conn.close()
            return redirect(url_for('dashboard'))
        conn.close()
        return render_template('login.html', error='Username atau password salah')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, original_name, file_size, file_type, category, upload_date FROM files WHERE user_id = ? ORDER BY upload_date DESC', (session['user_id'],))
    files = c.fetchall()
    conn.close()
    return render_template('dashboard.html', files=files, username=session.get('username'))

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipe file tidak diizinkan'}), 400
    original_name = secure_filename(file.filename)
    category = get_category(original_name)
    file_ext = original_name.rsplit('.', 1)[1].lower() if '.' in original_name else ''
    unique_filename = f"{secrets.token_hex(16)}.{file_ext}"
    file_data = file.read()
    file_size = len(file_data)
    key = generate_key()
    encrypted_data = encrypt_file(file_data, key)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], category, unique_filename)
    with open(file_path, 'wb') as f:
        f.write(encrypted_data)
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT INTO files (user_id, filename, original_name, file_path, file_size, file_type, category, encrypted_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', (session['user_id'], unique_filename, original_name, file_path, file_size, file_ext, category, base64.b64encode(key).decode()))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'File berhasil diupload', 'filename': original_name})

@app.route('/download/<int:file_id>')
@login_required
def download_file(file_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT filename, original_name, file_path, encrypted_key FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()
    conn.close()
    if not file_record:
        return jsonify({'error': 'File tidak ditemukan'}), 404
    try:
        key = base64.b64decode(file_record['encrypted_key'])
        with open(file_record['file_path'], 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = decrypt_file(encrypted_data, key)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"temp_{file_record['filename']}")
        with open(temp_path, 'wb') as f:
            f.write(decrypted_data)
        return send_file(temp_path, as_attachment=True, download_name=file_record['original_name'])
    except Exception as e:
        return jsonify({'error': 'Gagal mendownload file'}), 500

@app.route('/delete/<int:file_id>', methods=['POST'])
@login_required
def delete_file(file_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT file_path FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()
    if file_record:
        try:
            os.remove(file_record['file_path'])
        except:
            pass
        c.execute('DELETE FROM files WHERE id = ?', (file_id,))
        conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'File berhasil dihapus'})

@app.route('/api/files')
@login_required
def get_files():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, original_name, file_size, file_type, category, upload_date FROM files WHERE user_id = ? ORDER BY upload_date DESC', (session['user_id'],))
    files = c.fetchall()
    conn.close()
    files_list = [{'id': f['id'], 'name': f['original_name'], 'size': f['file_size'], 'type': f['file_type'], 'category': f['category'], 'date': f['upload_date']} for f in files]
    return jsonify(files_list)

@app.route('/api/stats')
@login_required
def get_stats():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT COUNT(*), SUM(file_size) FROM files WHERE user_id = ?', (session['user_id'],))
    stats = c.fetchone()
    conn.close()
    return jsonify({'total_files': stats[0] or 0, 'total_size': stats[1] or 0})

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Olympus Vault is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
