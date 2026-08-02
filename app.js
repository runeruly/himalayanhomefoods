/* ==========================================================================
   HIMALAYAN HOMEFOODS - CLIENT LOGIC
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

    // --- 1. Sticky Header + Scroll Spy (rAF-throttled, layout reads cached) ---
    const heroSection = document.getElementById('home');
    const heroBg = document.querySelector('.hero-bg');
    const sections = document.querySelectorAll('section[id]');

    let sectionOffsets = [];
    const measureSections = () => {
        sectionOffsets = [...sections].map(sec => ({
            id: sec.getAttribute('id'),
            top: sec.offsetTop,
            height: sec.offsetHeight
        }));
    };

    let ticking = false;
    const updateScrollState = () => {
        ticking = false;
        const y = window.scrollY;

        if (y > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Pause the hero zoom animation once the hero is out of view (perf)
        if (heroBg && heroSection) {
            heroBg.style.animationPlayState = (y > heroSection.offsetHeight) ? 'paused' : 'running';
        }

        sectionOffsets.forEach(sec => {
            if (y > sec.top - 120 && y <= sec.top - 120 + sec.height) {
                document.querySelector(`.nav-menu a[href*=${sec.id}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href*=${sec.id}]`)?.classList.remove('active');
            }
        });
    };

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureSections);
    measureSections();
    updateScrollState(); // Run once on load to set correct state

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

    // --- 3. Menu Filtering ---
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
});
