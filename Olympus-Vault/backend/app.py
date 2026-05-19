from flask import Flask, render_template, request, redirect, url_for, session, send_file, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.utils import secure_filename
from functools import wraps
import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from cryptography.fernet import Fernet
import base64
import requests
from PIL import Image
import io

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024 * 1024  # 1TB limit

# Use /tmp for Vercel serverless or local folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', os.path.join(BASE_DIR, 'static/uploads'))
DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'backend/vault.db'))
THUMBNAIL_FOLDER = os.path.join(BASE_DIR, 'static/thumbnails')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folders exist
for subfolder in ['documents', 'images', 'videos', 'apk', 'projects', 'others']:
    os.makedirs(os.path.join(UPLOAD_FOLDER, subfolder), exist_ok=True)
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

# Rate limiting with memory storage (for production use Redis)
try:
    limiter = Limiter(app=app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])
except:
    limiter = None

ALLOWED_EXTENSIONS = {
    'documents': ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'odt', 'rtf'],
    'images': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico', 'tiff', 'heic'],
    'videos': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp', 'mpeg'],
    'apk': ['apk', 'xapk', 'apks'],
    'projects': ['html', 'css', 'js', 'json', 'xml', 'php', 'py', 'java', 'cpp', 'c', 'go', 'rs'],
    'others': ['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'dmg', 'exe', 'msi']
}

STORAGE_LIMIT = 1 * 1024 * 1024 * 1024 * 1024  # 1TB in bytes

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
    c.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_login TIMESTAMP, storage_used INTEGER DEFAULT 0)')
    c.execute('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, filename TEXT NOT NULL, original_name TEXT NOT NULL, file_path TEXT NOT NULL, file_size INTEGER NOT NULL, file_type TEXT NOT NULL, category TEXT NOT NULL, encrypted_key TEXT NOT NULL, upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, thumbnail TEXT, url_link TEXT, is_shared INTEGER DEFAULT 0, share_token TEXT, FOREIGN KEY (user_id) REFERENCES users (id))')
    c.execute('CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, message TEXT NOT NULL, type TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id))')
    c.execute('CREATE TABLE IF NOT EXISTS shares (id INTEGER PRIMARY KEY AUTOINCREMENT, file_id INTEGER NOT NULL, owner_id INTEGER NOT NULL, shared_with_id INTEGER, share_token TEXT UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, expires_at TIMESTAMP, FOREIGN KEY (file_id) REFERENCES files (id), FOREIGN KEY (owner_id) REFERENCES users (id))')
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

def create_thumbnail(file_path, file_type):
    """Buat thumbnail untuk gambar"""
    try:
        if file_type in ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']:
            img = Image.open(file_path)
            img.thumbnail((300, 300))
            thumb_filename = f"thumb_{secrets.token_hex(8)}.jpg"
            thumb_path = os.path.join(THUMBNAIL_FOLDER, thumb_filename)
            img.save(thumb_path, 'JPEG', quality=85)
            return thumb_filename
    except:
        pass
    return None

def create_notification(user_id, message, notif_type):
    """Buat notifikasi untuk user"""
    conn = get_db()
    c = conn.cursor()
    c.execute('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)', (user_id, message, notif_type))
    conn.commit()
    conn.close()

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
            return render_template('register.html', error='Username minimal 4 karakter, password minimal 8 karakter')
        password_hash, salt = hash_password(password)
        try:
            conn = get_db()
            c = conn.cursor()
            c.execute('INSERT INTO users (username, password_hash, salt, storage_used) VALUES (?, ?, ?, 0)', (username, password_hash, salt))
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
    c.execute('SELECT id, original_name, file_size, file_type, category, upload_date, thumbnail, url_link FROM files WHERE user_id = ? ORDER BY upload_date DESC', (session['user_id'],))
    files = c.fetchall()

    # Get storage info
    c.execute('SELECT storage_used FROM users WHERE id = ?', (session['user_id'],))
    user = c.fetchone()
    storage_used = user['storage_used'] if user else 0

    # Get unread notifications count
    c.execute('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0', (session['user_id'],))
    notif_count = c.fetchone()['count']

    conn.close()
    return render_template('dashboard.html', files=files, username=session.get('username'),
                         storage_used=storage_used, storage_limit=STORAGE_LIMIT, notif_count=notif_count)

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    # Check if it's URL upload
    url_link = request.form.get('url_link', '').strip()

    if url_link:
        # Upload via URL (for APK or projects)
        return upload_from_url(url_link)

    # Regular file upload
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipe file tidak diizinkan'}), 400

    # Check storage limit
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT storage_used FROM users WHERE id = ?', (session['user_id'],))
    user = c.fetchone()
    storage_used = user['storage_used'] if user else 0

    file_data = file.read()
    file_size = len(file_data)

    if storage_used + file_size > STORAGE_LIMIT:
        conn.close()
        return jsonify({'error': 'Penyimpanan penuh! Limit 1TB tercapai'}), 400

    original_name = secure_filename(file.filename)
    category = get_category(original_name)
    file_ext = original_name.rsplit('.', 1)[1].lower() if '.' in original_name else ''
    unique_filename = f"{secrets.token_hex(16)}.{file_ext}"

    key = generate_key()
    encrypted_data = encrypt_file(file_data, key)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], category, unique_filename)

    with open(file_path, 'wb') as f:
        f.write(encrypted_data)

    # Create thumbnail for images
    thumbnail = None
    if category == 'images':
        # Decrypt temporarily for thumbnail
        temp_path = file_path + '.temp'
        with open(temp_path, 'wb') as f:
            f.write(file_data)
        thumbnail = create_thumbnail(temp_path, file_ext)
        try:
            os.remove(temp_path)
        except:
            pass

    c.execute('INSERT INTO files (user_id, filename, original_name, file_path, file_size, file_type, category, encrypted_key, thumbnail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              (session['user_id'], unique_filename, original_name, file_path, file_size, file_ext, category, base64.b64encode(key).decode(), thumbnail))

    # Update storage used
    c.execute('UPDATE users SET storage_used = storage_used + ? WHERE id = ?', (file_size, session['user_id']))

    conn.commit()
    conn.close()

    # Create notification
    create_notification(session['user_id'], f'File "{original_name}" berhasil diupload', 'upload')

    return jsonify({'success': True, 'message': 'File berhasil diupload', 'filename': original_name})

def upload_from_url(url_link):
    """Upload file dari URL (untuk APK dan projects)"""
    try:
        # Validate URL
        if not url_link.startswith(('http://', 'https://')):
            return jsonify({'error': 'URL tidak valid'}), 400

        # For projects, just save the URL
        category = request.form.get('category', 'projects')

        if category == 'projects':
            # Save project URL
            conn = get_db()
            c = conn.cursor()

            project_name = request.form.get('project_name', 'Project Website')

            c.execute('INSERT INTO files (user_id, filename, original_name, file_path, file_size, file_type, category, encrypted_key, url_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      (session['user_id'], 'url_project', project_name, '', 0, 'url', 'projects', '', url_link))

            conn.commit()
            conn.close()

            create_notification(session['user_id'], f'Project "{project_name}" berhasil ditambahkan', 'upload')

            return jsonify({'success': True, 'message': 'Project berhasil ditambahkan'})

        elif category == 'apk':
            # Download APK from URL
            response = requests.get(url_link, stream=True, timeout=30)
            if response.status_code != 200:
                return jsonify({'error': 'Gagal mengunduh file dari URL'}), 400

            file_data = response.content
            file_size = len(file_data)

            # Check storage
            conn = get_db()
            c = conn.cursor()
            c.execute('SELECT storage_used FROM users WHERE id = ?', (session['user_id'],))
            user = c.fetchone()
            storage_used = user['storage_used'] if user else 0

            if storage_used + file_size > STORAGE_LIMIT:
                conn.close()
                return jsonify({'error': 'Penyimpanan penuh!'}), 400

            apk_name = request.form.get('apk_name', 'Downloaded APK')
            unique_filename = f"{secrets.token_hex(16)}.apk"

            key = generate_key()
            encrypted_data = encrypt_file(file_data, key)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'apk', unique_filename)

            with open(file_path, 'wb') as f:
                f.write(encrypted_data)

            c.execute('INSERT INTO files (user_id, filename, original_name, file_path, file_size, file_type, category, encrypted_key, url_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                      (session['user_id'], unique_filename, apk_name, file_path, file_size, 'apk', 'apk', base64.b64encode(key).decode(), url_link))

            c.execute('UPDATE users SET storage_used = storage_used + ? WHERE id = ?', (file_size, session['user_id']))

            conn.commit()
            conn.close()

            create_notification(session['user_id'], f'APK "{apk_name}" berhasil didownload dan disimpan', 'upload')

            return jsonify({'success': True, 'message': 'APK berhasil didownload dan disimpan'})

    except Exception as e:
        return jsonify({'error': f'Gagal memproses URL: {str(e)}'}), 400

@app.route('/download/<int:file_id>')
@login_required
def download_file(file_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT filename, original_name, file_path, encrypted_key, url_link FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()
    conn.close()

    if not file_record:
        return jsonify({'error': 'File tidak ditemukan'}), 404

    # If it's a URL link, redirect
    if file_record['url_link']:
        return redirect(file_record['url_link'])

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

@app.route('/view/<int:file_id>')
@login_required
def view_file(file_id):
    """View file langsung (untuk gambar dan video)"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT filename, original_name, file_path, encrypted_key, file_type, category FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()
    conn.close()

    if not file_record:
        return jsonify({'error': 'File tidak ditemukan'}), 404

    try:
        key = base64.b64decode(file_record['encrypted_key'])
        with open(file_record['file_path'], 'rb') as f:
            encrypted_data = f.read()
        decrypted_data = decrypt_file(encrypted_data, key)

        # Return file untuk ditampilkan
        mimetype = 'image/jpeg'
        if file_record['category'] == 'videos':
            mimetype = 'video/mp4'
        elif file_record['file_type'] == 'png':
            mimetype = 'image/png'
        elif file_record['file_type'] == 'gif':
            mimetype = 'image/gif'

        return send_file(io.BytesIO(decrypted_data), mimetype=mimetype)
    except Exception as e:
        return jsonify({'error': 'Gagal membuka file'}), 500

@app.route('/delete/<int:file_id>', methods=['POST'])
@login_required
def delete_file(file_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT file_path, file_size FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()

    if file_record:
        try:
            if file_record['file_path']:
                os.remove(file_record['file_path'])
        except:
            pass

        # Update storage
        c.execute('UPDATE users SET storage_used = storage_used - ? WHERE id = ?', (file_record['file_size'], session['user_id']))
        c.execute('DELETE FROM files WHERE id = ?', (file_id,))
        conn.commit()

    conn.close()
    return jsonify({'success': True, 'message': 'File berhasil dihapus'})

@app.route('/share/<int:file_id>', methods=['POST'])
@login_required
def share_file(file_id):
    """Berbagi file dengan user lain"""
    conn = get_db()
    c = conn.cursor()

    # Check if file exists
    c.execute('SELECT id, original_name FROM files WHERE id = ? AND user_id = ?', (file_id, session['user_id']))
    file_record = c.fetchone()

    if not file_record:
        conn.close()
        return jsonify({'error': 'File tidak ditemukan'}), 404

    # Generate share token
    share_token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(days=7)  # Expire in 7 days

    c.execute('INSERT INTO shares (file_id, owner_id, share_token, expires_at) VALUES (?, ?, ?, ?)',
              (file_id, session['user_id'], share_token, expires_at))
    c.execute('UPDATE files SET is_shared = 1, share_token = ? WHERE id = ?', (share_token, file_id))

    conn.commit()
    conn.close()

    share_url = url_for('shared_file', token=share_token, _external=True)

    create_notification(session['user_id'], f'File "{file_record["original_name"]}" berhasil dibagikan', 'share')

    return jsonify({'success': True, 'share_url': share_url, 'message': 'Link berbagi berhasil dibuat'})

@app.route('/shared/<token>')
def shared_file(token):
    """Akses file yang dibagikan"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT f.*, u.username FROM files f JOIN shares s ON f.id = s.file_id JOIN users u ON s.owner_id = u.id WHERE s.share_token = ? AND s.expires_at > ?',
              (token, datetime.now()))
    file_record = c.fetchone()
    conn.close()

    if not file_record:
        return render_template('error.html', message='Link berbagi tidak valid atau sudah kadaluarsa')

    return render_template('shared.html', file=file_record, token=token)

@app.route('/notifications')
@login_required
def notifications():
    """Halaman notifikasi"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', (session['user_id'],))
    notifs = c.fetchall()
    conn.close()

    return render_template('notifications.html', notifications=notifs, username=session.get('username'))

@app.route('/notifications/read/<int:notif_id>', methods=['POST'])
@login_required
def mark_notification_read(notif_id):
    """Tandai notifikasi sudah dibaca"""
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', (notif_id, session['user_id']))
    conn.commit()
    conn.close()

    return jsonify({'success': True})

@app.route('/gallery')
@login_required
def gallery():
    """Halaman galeri foto dan video"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, original_name, file_size, file_type, category, upload_date, thumbnail FROM files WHERE user_id = ? AND category IN ("images", "videos") ORDER BY upload_date DESC',
              (session['user_id'],))
    media_files = c.fetchall()
    conn.close()

    return render_template('gallery.html', files=media_files, username=session.get('username'))

@app.route('/api/files')
@login_required
def get_files():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT id, original_name, file_size, file_type, category, upload_date, thumbnail, url_link FROM files WHERE user_id = ? ORDER BY upload_date DESC', (session['user_id'],))
    files = c.fetchall()
    conn.close()

    files_list = [{'id': f['id'], 'name': f['original_name'], 'size': f['file_size'], 'type': f['file_type'],
                   'category': f['category'], 'date': f['upload_date'], 'thumbnail': f['thumbnail'], 'url_link': f['url_link']} for f in files]
    return jsonify(files_list)

@app.route('/api/stats')
@login_required
def get_stats():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT COUNT(*), SUM(file_size) FROM files WHERE user_id = ?', (session['user_id'],))
    stats = c.fetchone()

    c.execute('SELECT storage_used FROM users WHERE id = ?', (session['user_id'],))
    user = c.fetchone()
    storage_used = user['storage_used'] if user else 0

    conn.close()
    return jsonify({
        'total_files': stats[0] or 0,
        'total_size': stats[1] or 0,
        'storage_used': storage_used,
        'storage_limit': STORAGE_LIMIT,
        'storage_percent': (storage_used / STORAGE_LIMIT * 100) if STORAGE_LIMIT > 0 else 0
    })

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'message': 'Olympus Vault berjalan dengan baik'})

# Vercel serverless handler
app = app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
