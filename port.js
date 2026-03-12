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
        
        // Add staggered delay for skills
        if (el.classList.contains('skill')) {
            const skills = Array.from(document.querySelectorAll('.skill'));
            const index = skills.indexOf(el);
            el.style.transitionDelay = `${index * 0.05}s`;
        }
        
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

    if (window.matchMedia("(pointer: fine)").matches) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        // Tail setup - Laser/Snake look
        const tails = [];
        const numTails = 20; // Longer tail for "Snake" effect
        for (let i = 0; i < numTails; i++) {
            const tail = document.createElement('div');
            tail.classList.add('cursor-tail');
            document.body.appendChild(tail);
            tails.push({ element: tail, x: mouseX, y: mouseY });
        }

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Create occasional sparkles
            if (Math.random() > 0.85) createSparkle(mouseX, mouseY);

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            cursorOutline.animate({
                left: `${mouseX}px`,
                top: `${mouseY}px`
            }, { duration: 250, fill: "forwards" });
        });

        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('cursor-sparkle');
            sparkle.style.left = `${x}px`;
            sparkle.style.top = `${y}px`;
            // Vary size slightly
            const size = Math.random() * 4 + 2;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        }

        function animateTails() {
            let cx = mouseX;
            let cy = mouseY;

            tails.forEach((tail, index) => {
                // Springiness increases as we go down the tail
                const ease = 0.35 - (index * 0.01);
                tail.x += (cx - tail.x) * ease;
                tail.y += (cy - tail.y) * ease;

                tail.element.style.left = `${tail.x}px`;
                tail.element.style.top = `${tail.y}px`;

                // Shrink and fade
                const scale = (numTails - index) / numTails;
                tail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                tail.element.style.opacity = scale * 0.7;

                cx = tail.x;
                cy = tail.y;
            });

            requestAnimationFrame(animateTails);
        }
        animateTails();

        // Hover Effects
        const interactives = document.querySelectorAll('a, button, .skill, .card, #theme-toggle');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-active');
                cursorDot.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-active');
                cursorDot.classList.remove('hover-active');
            });
        });
    }

    // --- 3D Carousel Logic ---
    let currentAngle = 0;
    const carousel3D = document.getElementById('carousel3D');
    const nextBtn = document.getElementById('nextCarousel');
    const prevBtn = document.getElementById('prevCarousel');
    const carouselContainer = document.querySelector('.carousel-container');

    function rotateCarousel(direction) {
        if (direction === 'next') {
            currentAngle -= 90;
        } else {
            currentAngle += 90;
        }
        carousel3D.style.transform = `rotateY(${currentAngle}deg)`;
    }

    if (nextBtn && prevBtn && carouselContainer) {
        nextBtn.addEventListener('click', () => rotateCarousel('next'));
        prevBtn.addEventListener('click', () => rotateCarousel('prev'));

        // Swipe Detection Logic
        let touchStartX = 0;
        let touchEndX = 0;
        let swipeTimeout;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoRotate);
            clearTimeout(swipeTimeout);
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe(e);
            
            // Restart auto-rotate after 5 seconds of inactivity
            clearTimeout(swipeTimeout);
            swipeTimeout = setTimeout(() => {
                clearInterval(autoRotate);
                autoRotate = setInterval(() => rotateCarousel('next'), 3500);
            }, 5000);
        }, { passive: true });

        function handleSwipe(e) {
            const swipeThreshold = 50; // Minimum distance to trigger swipe
            const tapThreshold = 10;   // Maximum distance for a tap
            const deltaX = touchEndX - touchStartX;

            if (Math.abs(deltaX) > swipeThreshold) {
                // It's a swipe
                if (deltaX < 0) {
                    rotateCarousel('next');
                } else {
                    rotateCarousel('prev');
                }
            } else if (Math.abs(deltaX) <= tapThreshold) {
                // It's a tap - detect side
                const rect = carouselContainer.getBoundingClientRect();
                const touchX = e.changedTouches[0].clientX - rect.left;
                
                if (touchX > rect.width / 2) {
                    // Tapped Right Side
                    rotateCarousel('next');
                } else {
                    // Tapped Left Side
                    rotateCarousel('prev');
                }
            }
        }

        // Auto Rotate
        let autoRotate = setInterval(() => rotateCarousel('next'), 3500);

        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
        carouselContainer.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => rotateCarousel('next'), 3500);
        });
    }
});