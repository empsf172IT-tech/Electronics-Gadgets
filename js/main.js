document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const darkIcons = document.querySelectorAll('#theme-toggle-dark-icon, #theme-toggle-dark-icon-mobile');
    const lightIcons = document.querySelectorAll('#theme-toggle-light-icon, #theme-toggle-light-icon-mobile');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            lightIcons.forEach(icon => { if(icon) icon.classList.remove('hidden'); });
            darkIcons.forEach(icon => { if(icon) icon.classList.add('hidden'); });
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcons.forEach(icon => { if(icon) icon.classList.remove('hidden'); });
            lightIcons.forEach(icon => { if(icon) icon.classList.add('hidden'); });
            localStorage.setItem('color-theme', 'light');
        }
    }

    // Initial check
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // Active Link Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.remove('text-gray-600', 'dark:text-gray-300', 'font-medium');
            link.classList.add('text-gray-900', 'dark:text-white', 'font-bold');
        }
    });

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Sticky Header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md', 'bg-opacity-90', 'backdrop-blur-md');
            } else {
                header.classList.remove('shadow-md', 'bg-opacity-90', 'backdrop-blur-md');
            }
        });
    }

    // Back to Top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 360 Interactive Viewer Logic
    const viewers = document.querySelectorAll('.viewer-360-container');
    
    viewers.forEach(viewer => {
        const img = viewer.querySelector('img');
        if (!img) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;

        viewer.style.perspective = '1000px';
        img.style.transition = 'transform 0.1s ease-out';
        img.style.transformStyle = 'preserve-3d';
        viewer.style.cursor = 'grab';

        function onStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            startY = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
            viewer.style.cursor = 'grabbing';
            if (e.type.includes('mouse')) e.preventDefault();
        }

        function onEnd() {
            isDragging = false;
            viewer.style.cursor = 'grab';
            currentRotateX = targetRotateX;
            currentRotateY = targetRotateY;
        }

        function onMove(e) {
            if (!isDragging) return;
            // Prevent default only if we are moving horizontally mostly, to allow vertical scrolling on mobile?
            // Actually, for a 360 viewer, usually we prevent default when interacting.
            if(e.cancelable) e.preventDefault();

            const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const y = e.type.includes('mouse') ? e.pageY : e.touches[0].pageY;
            
            const deltaX = (x - startX);
            const deltaY = (y - startY);
            
            targetRotateY = currentRotateY + (deltaX * 0.5);
            // Limit the vertical tilt to subtle angles (-15 to 15 degrees)
            targetRotateX = Math.max(-15, Math.min(15, currentRotateX - (deltaY * 0.2)));
            
            // translateZ pops the image out slightly for depth!
            img.style.transform = `translateZ(40px) rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`;
        }

        viewer.addEventListener('mousedown', onStart);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('mousemove', onMove);

        viewer.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchend', onEnd);
        window.addEventListener('touchmove', onMove, { passive: false });
    });

    // Global Search and Cart Modals Injection
    const searchModalHTML = `
        <div id="search-modal" class="fixed inset-0 z-[100] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
            <button id="close-search" class="absolute top-8 right-8 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <div class="w-full max-w-3xl px-4">
                <input type="text" id="search-input" placeholder="Search Auralis..." class="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 text-4xl md:text-6xl text-center focus:outline-none focus:border-accent dark:focus:border-accent text-black dark:text-white pb-4 placeholder-gray-400 dark:placeholder-gray-600 transition-colors">
            </div>
        </div>
    `;

    const cartDrawerHTML = `
        <div id="cart-overlay" class="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 pointer-events-none"></div>
        <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-[#111111] z-[100] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
            <div class="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 class="text-xl font-display font-bold">Your Cart</h3>
                <button id="close-cart" class="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400">Your cart is currently empty.</p>
                <a href="collection.html" class="mt-6 px-8 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors inline-block" id="continue-shopping">Continue Shopping</a>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', searchModalHTML + cartDrawerHTML);
    
    if(typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Modal Interactions
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart');
    const continueShoppingBtn = document.getElementById('continue-shopping');

    // Open Search
    document.querySelectorAll('.nav-search-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            searchModal.classList.remove('pointer-events-none');
            searchModal.classList.remove('opacity-0');
            setTimeout(() => searchInput.focus(), 300);
        });
    });

    // Close Search
    closeSearchBtn.addEventListener('click', () => {
        searchModal.classList.add('opacity-0');
        searchModal.classList.add('pointer-events-none');
    });

    // Open Cart
    document.querySelectorAll('.nav-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            cartOverlay.classList.remove('pointer-events-none');
            cartOverlay.classList.remove('opacity-0');
            cartDrawer.classList.remove('translate-x-full');
        });
    });

    // Close Cart
    function closeCart() {
        cartOverlay.classList.add('opacity-0');
        cartOverlay.classList.add('pointer-events-none');
        cartDrawer.classList.add('translate-x-full');
    }

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', () => {
        closeCart();
    });
});
