/* ==========================================================================
   HIMALAYAN HOME FOODS - CLIENT LOGIC
   Author: Arun Paudel (Owner) / Antigravity (AI pair programmer)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    const revealElements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-up'
    );

    // --- 1. Sticky Header ---
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load to set correct state

    // --- 2. Mobile Menu Toggle ---
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            // Toggle hamburger icon animation/class if needed
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars-staggered';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== navToggle) {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });
    }

    // --- 3. Active Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const activeScrollSpy = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset for sticky header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', activeScrollSpy);

    // --- 4. Menu Filtering ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger fade-in in next frame
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }, 300); // matches transition time
            });
        });
    });

    // Initialize Card CSS Transitions for filtering
    menuCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.4s ease';
    });

    // --- 5. Scroll Reveal Animations (Intersection Observer) ---
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-active');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.15, // 15% visibility triggers it
            rootMargin: '0px 0px -50px 0px' // offset so it triggers slightly before coming into center view
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('scroll-active');
        });
    }

    // --- 6. Background Music Control ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicIcon = document.getElementById('musicIcon');
    const musicTooltip = document.querySelector('.music-tooltip');

    if (musicToggleBtn && bgMusic) {
        // Set low volume for subtle background music
        bgMusic.volume = 0.25;

        musicToggleBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicToggleBtn.classList.add('playing');
                    musicIcon.className = 'fa-solid fa-volume-high';
                    musicTooltip.textContent = 'Mute Music';
                }).catch(error => {
                    console.log("Audio playback failed due to user interaction policy:", error);
                });
            } else {
                bgMusic.pause();
                musicToggleBtn.classList.remove('playing');
                musicIcon.className = 'fa-solid fa-volume-xmark';
                musicTooltip.textContent = 'Play Traditional Flute Dhoon';
            }
        });
    }
});
