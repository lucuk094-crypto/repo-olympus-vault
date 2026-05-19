// ===== OLYMPUS VAULT - Dashboard JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    initUpload();
    initFilters();
    loadStats();
});

// Upload functionality
function initUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if (!dropZone || !fileInput) return;
    
    // Click to upload
    dropZone.addEventListener('click', () => fileInput.click());
    
    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
        uploadFile(file);
    });
}

function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const progressDiv = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressDiv.style.display = 'block';
    progressText.textContent = 'Mengupload ' + file.name + '...';
    
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = percent + '% - ' + file.name;
        }
    });
    
    xhr.addEventListener('load', () => {
        progressDiv.style.display = 'none';
        progressFill.style.width = '0%';
        
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            showToast('File berhasil diupload: ' + response.filename);
            setTimeout(() => location.reload(), 1500);
        } else {
            const error = JSON.parse(xhr.responseText);
            showToast('Error: ' + error.error, true);
        }
    });
    
    xhr.addEventListener('error', () => {
        progressDiv.style.display = 'none';
        showToast('Gagal mengupload file', true);
    });
    
    xhr.open('POST', '/upload');
    xhr.send(formData);
}

// Delete file
function deleteFile(fileId) {
    if (!confirm('Yakin ingin menghapus file ini?')) return;
    
    fetch('/delete/' + fileId, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('File berhasil dihapus');
                setTimeout(() => location.reload(), 1000);
            } else {
                showToast('Gagal menghapus file', true);
            }
        })
        .catch(() => showToast('Terjadi kesalahan', true));
}

// Filter functionality
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const fileCards = document.querySelectorAll('.file-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            
            fileCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Load stats
function loadStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalFiles').textContent = data.total_files;
            document.getElementById('totalSize').textContent = formatSize(data.total_size);
        })
        .catch(() => console.log('Gagal memuat statistik'));
}

// Format file size
function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderColor = isError ? '#e74c3c' : '#DAA520';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
