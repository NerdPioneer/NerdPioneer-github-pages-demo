// Early mobile loading screen initialization
(function() {
    // Run immediately for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected, ensuring loading screen');
        
        // Ensure loading overlay is visible immediately on mobile
        const ensureLoadingScreen = function() {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.style.visibility = 'visible';
                loadingOverlay.style.opacity = '1';
                loadingOverlay.style.zIndex = '10000';
                console.log('Mobile loading screen enforced');
            }
        };
        
        // Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureLoadingScreen);
        } else {
            ensureLoadingScreen();
        }
        
        // Also run after a short delay as failsafe
        setTimeout(ensureLoadingScreen, 100);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading manager first and ensure it works on mobile
    try {
        initLoadingManager();
    } catch (error) {
        console.error('Loading manager failed:', error);
        // Fallback: try to hide loading overlay manually
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.body.classList.remove('loading');
            }, 3000);
        }
    }
    
    try {
        initMobileNav();
        initSmoothScrolling();
        initProjectFiltering();
        initSkillsAnimation();
        initContactForm();
        initScrollAnimations();
        initTypingAnimation();
        initProfileCarousel();
        initMusicPlayer();
    } catch (error) {
        console.error('Error initializing application:', error);
        // Fallback: at least initialize critical functions
        try {
            initMobileNav();
        } catch (fallbackError) {
            console.error('Critical initialization failed:', fallbackError);
        }
    }
    
    // Add global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
    });
    
    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault(); // Prevents the default browser behavior
    });
});
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (!navToggle || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Re-enable scrolling
        } else {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        
        // Simple hamburger animation
        hamburgerLines.forEach((line, index) => {
            if (!isActive) {
                // Create X shape
                if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                // Reset to hamburger
                line.style.transform = 'none';
                line.style.opacity = '1';
            }
        });
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Re-enable scrolling
            
            // Reset hamburger animation
            hamburgerLines.forEach(line => {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Re-enable scrolling
            
            hamburgerLines.forEach(line => {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Re-enable scrolling
            
            hamburgerLines.forEach(line => {
                line.style.transform = 'none';
                line.style.opacity = '1';
            });
        }
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-50% 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.display = 'block';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;
    function animateSkills() {
        if (skillsAnimated) return;
        skillBars.forEach((bar, index) => {
            const level = bar.getAttribute('data-level');
            setTimeout(() => {
                bar.style.setProperty('--width', level + '%');
                bar.style.width = level + '%';
                bar.classList.add('animate');
            }, index * 100);
        });
        skillsAnimated = true;
    }
    const skillsSection = document.querySelector('#skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.5 });
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            if (!formObject.name || !formObject.email || !formObject.message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formObject.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: #10b981;
                color: white;
            }
            .notification-error {
                background: #ef4444;
                color: white;
            }
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about-text, .about-image, .project-card, .skill-item, .contact-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Math.random() * 200;
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}
/*
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}
*/
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.hero-subtitle');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid #fbbf24';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        setTimeout(typeWriter, 1000);
    });
}
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
const optimizedScrollHandler = throttle(() => {
}, 16); // ~60fps
window.addEventListener('scroll', optimizedScrollHandler);

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

function initAccessibility() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    const main = document.querySelector('main') || document.querySelector('#main');
    if (!main) {
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.setAttribute('id', 'main');
            heroSection.setAttribute('role', 'main');
        }
    }
}
initAccessibility();
console.log(`
🎓 Student Portfolio Website
Built with HTML, CSS, and JavaScript
GitHub Pages Ready
`);
window.portfolioUtils = {
    showNotification,
    hideNotification,
    debounce,
    throttle
};

// Enhanced Loading Manager with Cybersecurity Theme
function initLoadingManager() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.querySelector('main');
    
    if (!loadingOverlay) {
        console.warn('Loading overlay not found');
        return;
    }
    
    console.log('Initializing loading manager...');
    
    // Prevent scrolling during loading
    document.body.classList.add('loading');
    
    // Additional mobile scroll prevention
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';
    
    // Mobile-specific handling
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Mobile device detected:', isMobile);
    
    if (isMobile) {
        // Additional mobile fixes
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        
        // Add mobile-specific viewport fixes
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
        }
    }
    
    // Prevent touch scrolling on mobile (define in scope for proper cleanup)
    function preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // Add touch event listeners to prevent mobile scrolling
    if (loadingOverlay) {
        loadingOverlay.addEventListener('touchmove', preventScroll, { passive: false });
        loadingOverlay.addEventListener('touchstart', preventScroll, { passive: false });
    }
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Set main content as hidden initially
    if (mainContent) {
        mainContent.classList.add('content-hidden');
    }
    
    // Cybersecurity-themed loading sequence
    let loadingPhase = 0;
    const loadingTexts = [
        'SYSTEM INITIALIZING',
        'SCANNING SECURITY PROTOCOLS',
        'LOADING PORTFOLIO DATA',
        'ESTABLISHING SECURE CONNECTION',
        'AUTHENTICATION COMPLETE',
        'ACCESS GRANTED'
    ];
    
    const loadingSubtexts = [
        'Booting cybersecurity systems...',
        'Verifying threat detection modules...',
        'Loading professional credentials...',
        'Encrypting data transmission...',
        'Welcome to secure portfolio.',
        'Portfolio loaded successfully.'
    ];
    
    const loadingTextElement = document.querySelector('.loading-text');
    const loadingSubtextElement = document.querySelector('.loading-subtext');
    
    // Animate through loading phases
    function updateLoadingText() {
        if (loadingTextElement && loadingSubtextElement && loadingPhase < loadingTexts.length) {
            loadingTextElement.textContent = loadingTexts[loadingPhase];
            loadingSubtextElement.textContent = loadingSubtexts[loadingPhase];
            loadingPhase++;
        }
    }
    
    // Show loading phases with timing
    const loadingInterval = setInterval(updateLoadingText, 800);
    updateLoadingText(); // Show first phase immediately
    
    // Track loaded resources
    let loadedResources = 0;
    const totalResources = document.querySelectorAll('img').length + 2;
    let minLoadingTime = 4000; // Minimum 4 seconds to show the cool loading screen
    let startTime = Date.now();
    
    function incrementLoaded() {
        loadedResources++;
        checkIfReadyToHide();
    }
    
    function checkIfReadyToHide() {
        const elapsed = Date.now() - startTime;
        const resourcesLoaded = loadedResources >= totalResources || loadedResources >= 5;
        
        if (resourcesLoaded && elapsed >= minLoadingTime) {
            clearInterval(loadingInterval);
            hideLoadingOverlay();
        } else if (resourcesLoaded) {
            // Resources loaded but not enough time passed - wait for min time
            setTimeout(() => {
                clearInterval(loadingInterval);
                hideLoadingOverlay();
            }, minLoadingTime - elapsed);
        }
    }
    
    // Force hide after maximum time
    setTimeout(() => {
        clearInterval(loadingInterval);
        hideLoadingOverlay();
    }, 6000); // Maximum 6 seconds
    
    // Hide loading overlay with cybersecurity completion message
    function hideLoadingOverlay() {
        // Final phase
        if (loadingTextElement && loadingSubtextElement) {
            loadingTextElement.textContent = 'ACCESS GRANTED';
            loadingSubtextElement.textContent = 'Portfolio loaded successfully.';
        }
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            // Re-enable scrolling
            document.body.classList.remove('loading');
            
            // Remove mobile scroll prevention
            document.documentElement.style.overflow = '';
            document.documentElement.style.position = '';
            document.documentElement.style.width = '';
            document.documentElement.style.height = '';
            
            // Remove mobile-specific body styles
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.overflow = '';
            
            // Restore viewport
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
            }
            
            // Remove touch event listeners with proper cleanup
            if (loadingOverlay) {
                loadingOverlay.removeEventListener('touchmove', preventScroll);
                loadingOverlay.removeEventListener('touchstart', preventScroll);
            }
            document.removeEventListener('touchmove', preventScroll);
            
            console.log('Loading complete, scrolling restored');
            
            if (mainContent) {
                mainContent.classList.remove('content-hidden');
                mainContent.classList.add('content-visible');
            }
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 800);
        }, 1000); // Show "ACCESS GRANTED" for 1 second
    }
    
    // Load images with lazy loading enhancement
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        if (img.complete) {
            img.setAttribute('data-loaded', 'true');
            incrementLoaded();
        } else {
            img.addEventListener('load', function() {
                this.setAttribute('data-loaded', 'true');
                incrementLoaded();
            });
            
            img.addEventListener('error', function() {
                console.warn('Failed to load image:', this.src);
                incrementLoaded(); // Still count as "loaded" to prevent hanging
            });
        }
    });
    
    // Set maximum loading time
    setTimeout(() => {
        hideLoadingOverlay();
    }, 3000); // Maximum 3 seconds loading time
    
    // Increment for other resources (fonts, etc.)
    setTimeout(incrementLoaded, 500); // CSS
    setTimeout(incrementLoaded, 1000); // Fonts
}

function initProfileCarousel() {
    const images = document.querySelectorAll('.profile-image');
    console.log('Profile carousel: Found', images.length, 'images');
    
    if (images.length === 0) {
        console.warn('No profile images found for carousel');
        return;
    }
    
    let currentIndex = 0;
    const totalImages = images.length;
    let carouselInterval;
    
    // Enhanced image preloading with error handling
    images.forEach((img, index) => {
        const imageUrl = img.src;
        const preloadImg = new Image();
        
        preloadImg.onload = function() {
            img.setAttribute('data-loaded', 'true');
            console.log(`Image ${index + 1} loaded successfully:`, imageUrl);
        };
        
        preloadImg.onerror = function() {
            console.warn(`Failed to load image ${index + 1}:`, imageUrl);
            // Set a fallback or placeholder
            img.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            img.setAttribute('data-loaded', 'error');
        };
        
        preloadImg.src = imageUrl;
    });
    
    // Set first image as active
    images[0].classList.add('active');
    console.log('Profile carousel initialized with', totalImages, 'images');
    
    function showNextImage() {
        console.log(`Transitioning from image ${currentIndex + 1} to ${((currentIndex + 1) % totalImages) + 1}`);
        
        const currentImage = images[currentIndex];
        
        // Enhanced mobile-friendly animation
        if (window.innerWidth <= 768) {
            currentImage.style.transition = 'opacity 0.3s ease';
            currentImage.style.opacity = '0';
            
            setTimeout(() => {
                currentImage.classList.remove('active');
                currentIndex = (currentIndex + 1) % totalImages;
                const nextImage = images[currentIndex];
                
                nextImage.classList.add('active');
                nextImage.style.opacity = '1';
            }, 300);
        } else {
            // Desktop animation (existing)
            currentImage.style.animation = 'profileGlow 0.8s ease-in-out';
            setTimeout(() => {
                currentImage.classList.remove('active');
            }, 200);
            
            currentIndex = (currentIndex + 1) % totalImages;
            const nextImage = images[currentIndex];
            
            setTimeout(() => {
                nextImage.classList.add('active');
            }, 500);
            
            setTimeout(() => {
                images.forEach(img => img.style.animation = 'none');
            }, 1300);
        }
    }
    
    function startCarousel() {
        console.log('Starting profile carousel');
        // Adjust interval based on device
        const interval = window.innerWidth <= 768 ? 3000 : 4000;
        carouselInterval = setInterval(showNextImage, interval);
    }
    
    function stopCarousel() {
        console.log('Stopping profile carousel');
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    
    startCarousel();
    
    // Enhanced mobile interaction handling
    const carousel = document.querySelector('.profile-carousel');
    if (carousel) {
        // Touch handling for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopCarousel();
        });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            
            // Swipe detection
            if (touchStartX - touchEndX > 50) {
                // Swipe left - next image
                showNextImage();
            } else if (touchEndX - touchStartX > 50) {
                // Swipe right - previous image
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                images.forEach(img => img.classList.remove('active'));
                images[currentIndex].classList.add('active');
            }
            
            // Resume after interaction
            setTimeout(startCarousel, 2000);
        });
        
        // Desktop interactions
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }
    
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stopCarousel();
        images.forEach((img, index) => {
            if (index === 0) img.classList.add('active');
        });
    }
    
    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopCarousel();
        } else {
            setTimeout(startCarousel, 1000);
        }
    });
}

function initMusicPlayer() {
    let playlist = [];
    let currentTrackIndex = 0;
    let isPlaying = false;
    let ytPlayer = null;
    let sessionTimer = null;
    let timeElapsed = 0;
    const SESSION_DURATION = 30 * 60; // 30 minutes in seconds

    // Get DOM elements
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const progressFill = document.querySelector('.progress-fill');
    const currentTrackSpan = document.querySelector('.current-track');
    const totalTracksSpan = document.querySelector('.total-tracks');
    const youtubeBtn = document.querySelector('.youtube-btn');
    const currentTimeSpan = document.querySelector('.current-time');

    // Initialize player
    if (!playPauseBtn) {
        console.warn('Music player elements not found');
        return;
    }

    // Load playlist from JSON file
    loadPlaylist();

    // YouTube API ready callback
    window.onYouTubeIframeAPIReady = function() {
        console.log('YouTube API ready');
        if (playlist.length > 0) {
            initYouTubePlayer();
        }
    };

    async function loadPlaylist() {
        try {
            const response = await fetch('./playlist.json');
            const data = await response.json();
            playlist = data.playlist;
            
            // Set total tracks
            totalTracksSpan.textContent = playlist.length;
            
            // Load initial track
            loadTrack(currentTrackIndex);
            
            // Setup event listeners after playlist is loaded
            setupEventListeners();
            
            // Initialize YouTube player if API is ready
            if (window.YT && window.YT.Player) {
                initYouTubePlayer();
            }
            
        } catch (error) {
            console.error('Error loading playlist:', error);
            // Fallback playlist
            playlist = [
                {
                    title: "Lofi Hip Hop",
                    artist: "ChilledCow",
                    youtube: "https://www.youtube.com/watch?v=5qap5aO4i9A",
                    videoId: "5qap5aO4i9A"
                }
            ];
            
            totalTracksSpan.textContent = playlist.length;
            loadTrack(currentTrackIndex);
            setupEventListeners();
            
            if (window.YT && window.YT.Player) {
                initYouTubePlayer();
            }
        }
    }

    function initYouTubePlayer() {
        if (!playlist[currentTrackIndex] || !playlist[currentTrackIndex].videoId) {
            console.warn('No video ID available for current track');
            return;
        }

        ytPlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: playlist[currentTrackIndex].videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'fs': 0,
                'cc_load_policy': 0,
                'iv_load_policy': 3,
                'autohide': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        console.log('YouTube player ready');
        // Player is ready, we can now control it
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            isPlaying = true;
            updatePlayPauseButton();
            startSessionTimer();
        } else if (event.data == YT.PlayerState.PAUSED) {
            isPlaying = false;
            updatePlayPauseButton();
            stopSessionTimer();
        } else if (event.data == YT.PlayerState.ENDED) {
            nextTrack();
        } else if (event.data == YT.PlayerState.UNSTARTED) {
            // Video loaded but not started
            console.log('Video loaded, ready to play');
        } else if (event.data == YT.PlayerState.BUFFERING) {
            console.log('Video buffering...');
        } else if (event.data == YT.PlayerState.CUED) {
            console.log('Video cued and ready');
        }
    }

    function handlePlayerError(error) {
        console.error('YouTube Player Error:', error);
        // Try next track if current one fails
        setTimeout(() => {
            nextTrack();
        }, 2000);
    }

    function setupEventListeners() {
        // Event listeners
        playPauseBtn.addEventListener('click', togglePlayPause);
        prevBtn.addEventListener('click', previousTrack);
        nextBtn.addEventListener('click', nextTrack);

        // YouTube button click handler
        youtubeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTrack = playlist[currentTrackIndex];
            
            if (currentTrack && currentTrack.youtube) {
                window.open(currentTrack.youtube, '_blank');
                
                // Track analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'youtube_link_click', {
                        'track_title': currentTrack.title,
                        'track_artist': currentTrack.artist
                    });
                }
            }
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only activate if music section is visible or focused
            const musicSection = document.getElementById('music');
            const rect = musicSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !e.target.matches('input, textarea')) {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        previousTrack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextTrack();
                        break;
                }
            }
        });
    }

    function loadTrack(index) {
        const track = playlist[index];
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        currentTrackSpan.textContent = index + 1;
        
        // Update YouTube link
        youtubeBtn.href = track.youtube || '#';
        
        // Reset timer
        timeElapsed = 0;
        updateTimeDisplay();
        progressFill.style.width = '0%';
        
        // Load new video in YouTube player
        if (ytPlayer && ytPlayer.loadVideoById) {
            ytPlayer.loadVideoById(track.videoId);
        }
    }

    function togglePlayPause() {
        if (!ytPlayer) {
            console.warn('YouTube player not ready');
            return;
        }

        if (isPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    }

    function updatePlayPauseButton() {
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        // Control visual indicators
        updateVisualIndicators();
    }

    function updateVisualIndicators() {
        const nowPlayingIndicator = document.querySelector('.now-playing-indicator');
        const soundWaves = document.querySelectorAll('.sound-wave');
        
        if (isPlaying) {
            nowPlayingIndicator?.classList.add('playing');
            soundWaves.forEach(wave => wave.style.animationPlayState = 'running');
        } else {
            nowPlayingIndicator?.classList.remove('playing');
            soundWaves.forEach(wave => wave.style.animationPlayState = 'paused');
        }
    }

    function previousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        stopSessionTimer();
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        stopSessionTimer();
    }

    function startSessionTimer() {
        stopSessionTimer(); // Clear any existing timer
        
        sessionTimer = setInterval(() => {
            timeElapsed++;
            updateTimeDisplay();
            updateProgressBar();
            
            // Stop after 30 minutes
            if (timeElapsed >= SESSION_DURATION) {
                stopSession();
            }
        }, 1000);
    }

    function stopSessionTimer() {
        if (sessionTimer) {
            clearInterval(sessionTimer);
            sessionTimer = null;
        }
    }

    function stopSession() {
        if (ytPlayer) {
            ytPlayer.pauseVideo();
        }
        stopSessionTimer();
        
        // Show session complete message
        setTimeout(() => {
            alert('🎯 Study session complete! You\'ve focused for 30 minutes. Great job!');
        }, 500);
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        currentTimeSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateProgressBar() {
        const progressPercent = (timeElapsed / SESSION_DURATION) * 100;
        progressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    function handlePlayerError(message) {
        console.error('YouTube Player Error:', message);
        trackTitle.textContent = 'Error loading track';
        trackArtist.textContent = 'Trying next track...';
        
        // Auto-advance to next track after error
        setTimeout(() => {
            nextTrack();
        }, 2000);
    }

    // Fallback for when YouTube API fails to load
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!window.YT || !ytPlayer) {
                console.warn('YouTube API failed to load, showing fallback message');
                trackTitle.textContent = 'YouTube Player Unavailable';
                trackArtist.textContent = 'Please check your connection';
            }
        }, 5000);
    });
}
