// ===== OLYMPUS VAULT - Dashboard JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initUpload();
    initDragDrop();
    loadStats();
});

// Tab Upload
function showUploadTab(tab) {
    document.getElementById('upload-file').style.display = 'none';
    document.getElementById('upload-apk').style.display = 'none';
    document.getElementById('upload-project').style.display = 'none';

    document.getElementById('upload-' + tab).style.display = 'block';
}

// Upload File Biasa
function initUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadFile(e.target.files[0]);
            }
        });
    }

    // Upload APK via URL
    const apkForm = document.getElementById('apkForm');
    if (apkForm) {
        apkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            uploadAPKFromURL();
        });
    }

    // Upload Project Website
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            uploadProject();
        });
    }
}

// Drag & Drop
function initDragDrop() {
    const uploadArea = document.querySelector('.upload-area');

    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            if (e.dataTransfer.files.length > 0) {
                uploadFile(e.dataTransfer.files[0]);
            }
        });
    }
}

// Upload File
function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    showToast('Mengupload ' + file.name + '...', false);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('✅ ' + data.message, false);
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ ' + data.error, true);
        }
    })
    .catch(error => {
        showToast('❌ Gagal mengupload file', true);
    });
}

// Upload APK dari URL
function uploadAPKFromURL() {
    const url = document.getElementById('apkUrl').value;
    const name = document.getElementById('apkName').value;

    if (!url || !name) {
        showToast('❌ URL dan Nama APK harus diisi', true);
        return;
    }

    showToast('⏳ Mendownload APK...', false);

    const formData = new FormData();
    formData.append('url_link', url);
    formData.append('apk_name', name);
    formData.append('category', 'apk');

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('✅ ' + data.message, false);
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ ' + data.error, true);
        }
    })
    .catch(error => {
        showToast('❌ Gagal mendownload APK', true);
    });
}

// Upload Project Website
function uploadProject() {
    const url = document.getElementById('projectUrl').value;
    const name = document.getElementById('projectName').value;

    if (!url || !name) {
        showToast('❌ URL dan Nama Project harus diisi', true);
        return;
    }

    showToast('⏳ Menambahkan project...', false);

    const formData = new FormData();
    formData.append('url_link', url);
    formData.append('project_name', name);
    formData.append('category', 'projects');

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('✅ ' + data.message, false);
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('❌ ' + data.error, true);
        }
    })
    .catch(error => {
        showToast('❌ Gagal menambahkan project', true);
    });
}

// Filter Files
function filterFiles(category) {
    const fileCards = document.querySelectorAll('.file-card');

    fileCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// View File (untuk gambar/video)
function viewFile(fileId) {
    const modal = document.getElementById('viewModal');
    const modalContent = document.getElementById('modalContent');

    // Cek apakah file adalah gambar atau video
    fetch('/view/' + fileId)
        .then(response => {
            const contentType = response.headers.get('content-type');

            if (contentType.startsWith('image/')) {
                return response.blob().then(blob => {
                    const url = URL.createObjectURL(blob);
                    modalContent.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 90vh; border-radius: 10px;">`;
                });
            } else if (contentType.startsWith('video/')) {
                return response.blob().then(blob => {
                    const url = URL.createObjectURL(blob);
                    modalContent.innerHTML = `<video controls autoplay style="max-width: 100%; max-height: 90vh; border-radius: 10px;">
                        <source src="${url}" type="${contentType}">
                    </video>`;
                });
            }
        })
        .then(() => {
            modal.classList.add('active');
        })
        .catch(error => {
            showToast('❌ Gagal membuka file', true);
        });
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('viewModal');
    modal.classList.remove('active');
    document.getElementById('modalContent').innerHTML = '';
}

// Share File
function shareFile(fileId) {
    if (!confirm('Buat link berbagi untuk file ini?')) return;

    fetch('/share/' + fileId, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Copy to clipboard
                navigator.clipboard.writeText(data.share_url).then(() => {
                    showToast('✅ Link berbagi berhasil dibuat dan disalin!', false);
                    alert('Link berbagi:\n' + data.share_url + '\n\n(Link sudah disalin ke clipboard)');
                });
            } else {
                showToast('❌ Gagal membuat link berbagi', true);
            }
        })
        .catch(error => {
            showToast('❌ Terjadi kesalahan', true);
        });
}

// Delete File
function deleteFile(fileId) {
    if (!confirm('Yakin ingin menghapus file ini?')) return;

    fetch('/delete/' + fileId, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('✅ File berhasil dihapus', false);
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('❌ Gagal menghapus file', true);
            }
        })
        .catch(error => {
            showToast('❌ Terjadi kesalahan', true);
        });
}

// Load Stats
function loadStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            // Update stats jika ada elemen
            const totalFiles = document.getElementById('totalFiles');
            const totalSize = document.getElementById('totalSize');

            if (totalFiles) totalFiles.textContent = data.total_files;
            if (totalSize) totalSize.textContent = formatSize(data.total_size);
        })
        .catch(error => {
            console.log('Gagal memuat statistik');
        });
}

// Format File Size
function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Toast Notification
function showToast(message, isError = false) {
    // Hapus toast lama jika ada
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    // Buat toast baru
    const toast = document.createElement('div');
    toast.className = 'toast ' + (isError ? 'error' : 'success');
    toast.textContent = message;
    document.body.appendChild(toast);

    // Hapus setelah 3 detik
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modal dengan ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Tampilkan tombol install
    const installBtn = document.createElement('button');
    installBtn.className = 'btn btn-primary';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install Aplikasi';
    installBtn.style.position = 'fixed';
    installBtn.style.bottom = '20px';
    installBtn.style.right = '20px';
    installBtn.style.zIndex = '9999';

    installBtn.addEventListener('click', async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            showToast('✅ Aplikasi berhasil diinstall!', false);
        }

        deferredPrompt = null;
        installBtn.remove();
    });

    document.body.appendChild(installBtn);
});
