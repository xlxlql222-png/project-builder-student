document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const viewModeToggle = document.getElementById('view-mode-toggle');
    const contactModal = document.getElementById('contact-modal');
    const openContact = document.getElementById('open-contact');
    const closeBtn = document.querySelector('.close-modal');

    // --- View Mode Logic (Auto & Manual) ---
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
    }

    const savedViewMode = localStorage.getItem('viewMode');
    // 처음 접속 시 모바일 기기라면 자동으로 모바일 모드 적용
    if (savedViewMode === 'mobile' || (!savedViewMode && isMobileDevice())) {
        document.body.classList.add('mobile-mode');
    }

    if (viewModeToggle) {
        viewModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-mode');
            const currentMode = document.body.classList.contains('mobile-mode') ? 'mobile' : 'pc';
            localStorage.setItem('viewMode', currentMode);
        });
    }

    // --- Theme Logic ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('light-mode'); // light-mode class handles dark styles in this project
        updateIcon('dark');
    } else {
        updateIcon('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const theme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            updateIcon(theme);
        });
    }

    function updateIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        } else {
            themeIcon.innerHTML = '<path d="M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>';
        }
    }

    // Modal
    if(openContact) openContact.onclick = (e) => { e.preventDefault(); contactModal.style.display = 'flex'; };
    if(closeBtn) closeBtn.onclick = () => contactModal.style.display = 'none';
    window.onclick = (e) => { if(e.target === contactModal) contactModal.style.display = 'none'; };
});
