// Store and Toggle Theme
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.innerHTML = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    if (window.innerWidth <= 850) {
        navLinks.classList.toggle("active");
    }
}

// Initialize features on load
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '🌙';
    }

    // Scroll Reveal Animation Initialization
    const revealElements = document.querySelectorAll('.section-title, .about, .skill, .card, .timeline, .contact');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
        el.classList.add('hidden-reveal');
        revealObserver.observe(el);
    });

    // Active Nav Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add buffer so the link highlights a bit before the section hits the very top
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active-link');
            }
        });
    });

    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only enable custom cursor if device supports hover
    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        const tails = [];
        const numTails = 12; // Number of tail elements
        for (let i = 0; i < numTails; i++) {
            const tail = document.createElement('div');
            tail.classList.add('cursor-tail');
            document.body.appendChild(tail);
            tails.push({ element: tail, x: mouseX, y: mouseY });
        }

        window.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            cursorOutline.animate({
                left: `${mouseX}px`,
                top: `${mouseY}px`
            }, { duration: 150, fill: "forwards" });
        });

        function animateTails() {
            let cx = mouseX;
            let cy = mouseY;

            tails.forEach((tail, index) => {
                // Spring effect for smooth trailing
                tail.x += (cx - tail.x) * 0.4;
                tail.y += (cy - tail.y) * 0.4;

                tail.element.style.left = `${tail.x}px`;
                tail.element.style.top = `${tail.y}px`;

                // Shrink the tail elements as they go further back
                const scale = (numTails - index) / numTails;
                tail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;

                cx = tail.x;
                cy = tail.y;
            });

            requestAnimationFrame(animateTails);
        }
        animateTails();
    }

    // --- 3D Carousel Logic ---
    let currentAngle = 0;
    const carousel3D = document.getElementById('carousel3D');
    const nextBtn = document.getElementById('nextCarousel');
    const prevBtn = document.getElementById('prevCarousel');

    function rotateCarousel(direction) {
        if (direction === 'next') {
            currentAngle -= 90;
        } else {
            currentAngle += 90;
        }
        carousel3D.style.transform = `rotateY(${currentAngle}deg)`;
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => rotateCarousel('next'));
        prevBtn.addEventListener('click', () => rotateCarousel('prev'));

        // Auto Rotate
        let autoRotate = setInterval(() => rotateCarousel('next'), 3500);

        document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => rotateCarousel('next'), 3500);
        });
    }
});
