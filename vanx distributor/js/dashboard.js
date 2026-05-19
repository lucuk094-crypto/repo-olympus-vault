let currentUser = null;
let userUploads = [];
let referrals = [];
let leaderboardData = [];
const DB_KEY = 'vanx_contributor_db';
function getDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : { users: [], uploads: [], referrals: [] };
}
function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    setupUploadForm();
    setupProfileForm();
    setupLeaderboard();
    setupReferralSystem();
    renderUploads();
    renderReferrals();
    animateStats();
});
function loadDashboardData() {
    const userData = localStorage.getItem('vanx_current_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserUI();
    }
    const db = getDB();
    if (currentUser) {
        userUploads = db.uploads.filter(u => u.userId === currentUser.id) || [];
    }
    referrals = db.referrals || [];
    leaderboardData = db.users || [];
    updateStats();
}
function updateUserUI() {
    const nameEl = document.getElementById('userName');
    const emailEl = document.getElementById('userEmail');
    const displayNameEl = document.getElementById('profileDisplayName');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const avatarEl = document.getElementById('avatarInitials');
    if (currentUser) {
        const name = currentUser.name || currentUser.username || 'User';
        const initial = name.charAt(0).toUpperCase();
        if (nameEl) nameEl.textContent = name;
        if (emailEl) emailEl.textContent = currentUser.email || '';
        if (displayNameEl) displayNameEl.textContent = name;
        if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email || '';
        if (avatarEl) avatarEl.textContent = initial;
    }
}
function updateStats() {
    const totalUploads = document.getElementById('totalUploads');
    const approvedCount = document.getElementById('approvedCount');
    const pendingCount = document.getElementById('pendingCount');
    const totalPoints = document.getElementById('totalPoints');
    const referralCount = document.getElementById('referralCount');
    const bonusPoints = document.getElementById('bonusPoints');
    const approved = userUploads.filter(u => u.status === 'approved').length;
    const pending = userUploads.filter(u => u.status === 'pending').length;
    const points = userUploads.filter(u => u.status === 'approved').length * 100;
    const refCount = referrals.filter(r => r.userId === currentUser?.id).length;
    // +500 points for each referral with verified uploads
    const db = getDB();
    let refPoints = 0;
    referrals.filter(r => r.userId === currentUser?.id).forEach(ref => {
        const referredUser = db.users.find(u => u.id === ref.referredUserId);
        if (referredUser) {
            const referredUploads = db.uploads.filter(up => up.userId === referredUser.id && up.status === 'approved');
            if (referredUploads.length > 0) {
                refPoints += 500; // +500 for verified uploads
            }
        }
    });
    if (totalUploads) totalUploads.textContent = userUploads.length;
    if (approvedCount) approvedCount.textContent = approved;
    if (pendingCount) pendingCount.textContent = pending;
    if (totalPoints) totalPoints.textContent = (points + refPoints).toLocaleString();
    if (referralCount) referralCount.textContent = refCount;
    if (bonusPoints) bonusPoints.textContent = `+${refPoints}`;
}
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.textContent.replace(/,/g, ''));
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current).toLocaleString();
            }
        }, 30);
    });
}
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;

    // Multi-step form navigation
    window.nextStep = function(step) {
        const steps = document.querySelectorAll('.upload-step-content');
        const stepIndicators = document.querySelectorAll('.upload-step');

        steps.forEach(s => s.style.display = 'none');
        stepIndicators.forEach(s => s.classList.remove('active'));

        const currentStep = document.getElementById('step' + step);
        if (currentStep) currentStep.style.display = 'block';

        const indicator = document.querySelector(`.upload-step[data-step="${step}"]`);
        if (indicator) indicator.classList.add('active');

        // Mark previous steps as completed
        stepIndicators.forEach(s => {
            const stepNum = parseInt(s.getAttribute('data-step'));
            if (stepNum < step) {
                s.classList.add('completed');
            } else if (stepNum > step) {
                s.classList.remove('completed');
            }
        });

        // Show review content on step 3
        if (step === 3) {
            const name = form.querySelector('[name="appName"]').value;
            const version = form.querySelector('[name="appVersion"]').value;
            const category = form.querySelector('[name="appCategory"]').value;
            const url = form.querySelector('[name="appUrl"]').value;
            const description = form.querySelector('[name="appDescription"]').value;
            const fileInput = form.querySelector('[name="appFile"]');
            const file = fileInput.files[0];

            const reviewDetails = document.getElementById('reviewDetails');
            reviewDetails.innerHTML = `
                <div style="display: grid; gap: 12px;">
                    <div><strong>App Name:</strong> ${name} ${version}</div>
                    <div><strong>Category:</strong> ${category}</div>
                    <div><strong>Download URL:</strong> ${url}</div>
                    <div><strong>File:</strong> ${file ? file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)' : 'No file selected'}</div>
                    <div><strong>Description:</strong> ${description}</div>
                </div>
            `;
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) {
            showToast('Silakan login terlebih dahulu!', 'error');
            return;
        }
        const name = form.querySelector('[name="appName"]').value;
        const version = form.querySelector('[name="appVersion"]').value;
        const category = form.querySelector('[name="appCategory"]').value;
        const url = form.querySelector('[name="appUrl"]').value;
        const description = form.querySelector('[name="appDescription"]').value;
        const fileInput = form.querySelector('[name="appFile"]');
        const file = fileInput.files[0];
        const screenshot = form.querySelector('[name="appScreenshot"]').value;
        if (!name || !version || !category || !url || !description || !file) {
            showToast('Harap isi semua field!', 'error');
            return;
        }
        if (file.size > 100 * 1024 * 1024) {
            showToast('File terlalu besar! Maksimal 100MB.', 'error');
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="margin-right:8px;"></span> Uploading...';
        setTimeout(() => {
            const upload = {
                id: Date.now().toString(),
                userId: currentUser.id,
                name,
                version,
                category,
                url,
                description,
                screenshot,
                fileName: file.name,
                fileSize: (file.size / 1024 / 1024).toFixed(2),
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            const db = getDB();
            db.uploads.push(upload);
            saveDB(db);
            userUploads = db.uploads.filter(u => u.userId === currentUser.id);
            renderUploads();
            updateStats();
            animateStats();

            // Show notification
            showNotification('Upload Submitted!', 'Your app is now pending review. You will be notified once it is approved.', 'info');

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up" style="margin-right: 8px;"></i> Submit Upload';
            form.reset();
            nextStep(1); // Reset to step 1
            switchPage('my-uploads');
            showToast('Aplikasi berhasil diupload! Menunggu review.', 'success');
        }, 2000);
    });
    const fileInput = form.querySelector('[name="appFile"]');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                if (file.size > 100 * 1024 * 1024) {
                    showToast('File terlalu besar! Maksimal 100MB.', 'error');
                    this.value = '';
                }
            }
        });
    }
}
function renderUploads() {
    const container = document.getElementById('uploadsList');
    if (!container) return;
    if (userUploads.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <h3>Belum ada upload</h3>
                <p style="color: var(--gray-400);">Upload aplikasi/mod pertama Anda!</p>
            </div>
        `;
        return;
    }
    const sorted = [...userUploads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    container.innerHTML = sorted.map(u => {
        const statusClass = u.status === 'approved' ? 'status-approved' : u.status === 'rejected' ? 'status-rejected' : 'status-pending';
        const statusText = u.status === 'approved' ? 'Approved' : u.status === 'rejected' ? 'Rejected' : 'Pending';
        return `
            <div class="upload-item">
                <div class="upload-info">
                    <div class="upload-icon">
                        <i class="fa-solid ${u.category === 'game' ? 'fa-gamepad' : u.category === 'tool' ? 'fa-wrench' : u.category === 'mod' ? 'fa-puzzle-piece' : 'fa-mobile-screen'}"></i>
                    </div>
                    <div>
                        <h3>${u.name} ${u.version}</h3>
                        <p>${u.category} • ${formatDate(u.createdAt)} • ${u.fileName || ''}</p>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
        `;
    }).join('');
}
function renderReferrals() {
    const container = document.getElementById('referralsList');
    if (!container) return;
    const userRefs = referrals.filter(r => r.userId === currentUser?.id);
    if (userRefs.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 24px;">
                <i class="fa-solid fa-users" style="font-size: 32px;"></i>
                <h3 style="font-size: 1rem;">Belum ada referral</h3>
                <p style="color: var(--gray-400); font-size: 0.875rem;">Bagikan link referral Anda!</p>
            </div>
        `;
        return;
    }
    const db = getDB();
    container.innerHTML = userRefs.map(r => {
        const referredUser = db.users.find(u => u.id === r.referredUserId);
        const hasVerifiedUploads = referredUser ? db.uploads.filter(up => up.userId === referredUser.id && up.status === 'approved').length > 0 : false;
        const points = hasVerifiedUploads ? 500 : 0;
        const statusClass = hasVerifiedUploads ? 'status-approved' : 'status-pending';
        const statusText = hasVerifiedUploads ? `+${points} Pts` : 'Pending';
        return `
        <div class="referral-item">
            <div class="referral-avatar">${r.name?.charAt(0)?.toUpperCase() || '?'}</div>
            <div class="referral-info">
                <h4>${r.name || 'Unknown'}</h4>
                <p>Joined ${formatDate(r.joinedAt)}${hasVerifiedUploads ? ' • Has verified uploads' : ''}</p>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;
    }).join('');
}
function setupReferralSystem() {
    const referralLink = document.getElementById('referralLink');
    if (referralLink && currentUser) {
        const refCode = currentUser.refCode || (currentUser.id ? currentUser.id.substring(0, 6).toUpperCase() : 'VANX001');
        referralLink.value = `${window.location.origin}${window.location.pathname.includes('dashboard') ? '/' : window.location.pathname.replace(/\/[^/]*$/, '/')}register.html?ref=${refCode}`;
    }
    const copyBtn = document.getElementById('copyReferralBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const input = document.getElementById('referralLink');
            if (input) copyToClipboard(input.value);
        });
    }
}
function setupProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    if (currentUser) {
        form.querySelector('[name="displayName"]').value = currentUser.name || '';
        form.querySelector('[name="bio"]').value = currentUser.bio || '';
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const displayName = form.querySelector('[name="displayName"]').value;
        const bio = form.querySelector('[name="bio"]').value;
        if (currentUser) {
            currentUser.name = displayName;
            currentUser.bio = bio;
            localStorage.setItem('vanx_current_user', JSON.stringify(currentUser));
            const db = getDB();
            const userIndex = db.users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                db.users[userIndex].name = displayName;
                db.users[userIndex].bio = bio;
                saveDB(db);
            }
            updateUserUI();
            showToast('Profile updated!', 'success');
        }
    });
}
function setupLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    const db = getDB();
    const leaderboard = db.users
        .map(u => {
            const userUploads = db.uploads.filter(up => up.userId === u.id);
            const approvedUploads = userUploads.filter(up => up.status === 'approved').length;
            const totalPoints = approvedUploads * 100 + (u.referralCount || 0) * 50;
            return { ...u, approvedUploads, totalPoints };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 20);
    if (leaderboard.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-trophy"></i>
                <h3>Belum ada data</h3>
                <p style="color: var(--gray-400);">Jadilah kontributor pertama!</p>
            </div>
        `;
        return;
    }
    container.innerHTML = leaderboard.map((u, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        const isCurrentUser = currentUser && u.id === currentUser.id;
        return `
            <div class="leaderboard-item ${isCurrentUser ? 'leaderboard-current' : ''}">
                <div class="leaderboard-rank">${medal}</div>
                <div class="leaderboard-avatar">${(u.name || u.username || 'U').charAt(0).toUpperCase()}</div>
                <div class="leaderboard-info">
                    <h4>${u.name || u.username || 'Anonymous'} ${isCurrentUser ? '(You)' : ''}</h4>
                    <p>${u.approvedUploads || 0} uploads approved</p>
                </div>
                <div class="leaderboard-points">${(u.totalPoints || 0).toLocaleString()} pts</div>
            </div>
        `;
    }).join('');
}
function logout() {
    localStorage.removeItem('vanx_current_user');
    showToast('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}
function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    if (currentUser) {
        const db = getDB();
        db.users = db.users.filter(u => u.id !== currentUser.id);
        db.uploads = db.uploads.filter(u => u.userId !== currentUser.id);
        saveDB(db);
        logout();
    }
}

// Notification System
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: start;">
            <i class="fa-solid ${icons[type] || icons.info}" style="font-size: 1.25rem; margin-top: 2px;"></i>
            <div style="flex: 1;">
                <h4 style="font-weight: 700; margin-bottom: 4px;">${title}</h4>
                <p style="font-size: 0.875rem; color: var(--gray-600);">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--gray-400); font-size: 1.25rem;">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        border: 2px solid var(--dark);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 8px 8px 0px 0px var(--dark);
        max-width: 400px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    }
    .notification-success { border-color: #10b981; box-shadow: 8px 8px 0px 0px #10b981; }
    .notification-error { border-color: #ef4444; box-shadow: 8px 8px 0px 0px #ef4444; }
    .notification-warning { border-color: #f59e0b; box-shadow: 8px 8px 0px 0px #f59e0b; }
    .notification-info { border-color: var(--primary); box-shadow: 8px 8px 0px 0px var(--primary); }
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);