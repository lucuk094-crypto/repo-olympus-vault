class BMALoader {
    constructor() {
        this.preloaderId = 'global-preloader';
        this.init();
    }
    init() {
        if (!document.getElementById(this.preloaderId)) {
            this.injectPreloader();
        }
        if (document.readyState === 'complete') {
            this.hidePreloader();
        } else {
            window.addEventListener('load', () => this.hidePreloader());
        }
        setTimeout(() => this.hidePreloader(), 5000);
    }
    injectPreloader() {
        const preloader = document.createElement('div');
        preloader.id = this.preloaderId;
        preloader.innerHTML = `
            <div class="loader-logo">
                <i class="fa-solid fa-gamepad"></i>
            </div>
            <div class="loader-bar">
                <div class="loader-bar-fill" id="preloader-fill"></div>
            </div>
            <p class="mt-4 font-retro text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 text-center px-6 leading-relaxed">Initializing Database...</p>
        `;
        document.body.prepend(preloader);
        let progress = 0;
        const fill = document.getElementById('preloader-fill');
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 10;
                if (fill) fill.style.width = `${Math.min(progress, 90)}%`;
            } else {
                clearInterval(interval);
            }
        }, 200);
    }
    hidePreloader() {
        const preloader = document.getElementById(this.preloaderId);
        if (preloader && !preloader.classList.contains('fade-out')) {
            const fill = document.getElementById('preloader-fill');
            if (fill) fill.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 300);
        }
    }
    static loadImage(imgElement, src) {
        if (!imgElement) return;
        if (!src || src.trim() === '') {
            imgElement.src = '';
            return;
        }
        imgElement.src = src;
    }
}
window.BMA_LOADER = new BMALoader();
window.loadImage = BMALoader.loadImage;