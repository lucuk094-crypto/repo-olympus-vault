document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    setupRippleEffect();
    setupSmoothScroll();
    updateFooterYear();
    setupToastSystem();
    setupModalSystem();
});
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.card-retro, .card-dark, .step-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}
function setupRippleEffect() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .btn-danger').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.background = 'rgba(255,255,255,0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleAnim 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
function updateFooterYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.info}" style="font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
function setupToastSystem() {
    window.showToast = showToast;
}
function setupModalSystem() {
    window.openModal = function(html) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                ${html}
            </div>
        `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        document.body.appendChild(overlay);
        return overlay;
    };
    window.closeModal = function(overlay) {
        if (overlay) overlay.remove();
    };
}
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
        if (overlay) overlay.classList.toggle('hidden');
    }
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied to clipboard!', 'success');
    });
}
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Baru saja';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' menit lalu';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' jam lalu';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' hari lalu';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}