document.addEventListener('DOMContentLoaded', function() {
    try {
        initMobileNav();
        initSmoothScrolling();
        initProjectFiltering();
        initSkillsAnimation();
        initContactForm();
        initBackToTop();
        initScrollAnimations();
        initTypingAnimation();
        initProfileCarousel();
        initMusicPlayer();
        initAnalyticsTracking(); // Initialize Google Analytics event tracking
    } catch (error) {
        console.error('Error initializing application:', error);
        // Fallback: at least initialize critical functions
        try {
            initMobileNav();
            initBackToTop();
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
    navToggle.addEventListener('click', function() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        } else {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
        }
        
        // Animate hamburger lines
        hamburgerLines.forEach((line, index) => {
            if (!isActive) {
                if (index === 0) line.style.transform = 'rotate(45deg) translate(6px, 6px)';
                if (index === 1) line.style.opacity = '0';
                if (index === 2) line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
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
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) {
        console.warn('Back to top button not found');
        return;
    }

    // Show button when user scrolls past 300px
    const showThreshold = 300;
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollY > showThreshold) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.classList.remove('visible');
                // Don't hide immediately, let CSS transition handle it
            }
            scrollTimeout = null;
        }, 16); // ~60fps
    };

    // Initial check in case page is already scrolled
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Smooth scroll to top with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Fallback for older browsers
            window.scrollTo(0, 0);
        }
        
        // Hide button after scrolling
        setTimeout(() => {
            const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll <= showThreshold) {
                backToTopBtn.classList.remove('visible');
            }
        }, 500);
    });

    // Handle resize to ensure button works on different screen sizes
    window.addEventListener('resize', () => {
        handleScroll(); // Re-check scroll position on resize
    }, { passive: true });
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
function initPreloader() {
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    });
}
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        }
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
}
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('New content available! Refresh the page to update.', 'info');
                        }
                    });
                });
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
                showNotification('App updated! New content is available.', 'success');
            }
        });
    });
}
function initAnalytics() {
}
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
function initMediumFeed() {
    const mediumFeed = document.getElementById('medium-feed');
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (!mediumFeed) return;
    const mediumRssUrl = 'https://medium.com/feed/@nerdpioneer';
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = encodeURIComponent(mediumRssUrl);
    fetch(proxyUrl + targetUrl)
        .then(response => response.json())
        .then(data => {
            if (data.contents) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                displayMediumPosts(items);
            } else {
                throw new Error('No content received');
            }
        })
        .catch(error => {
            console.error('Error fetching Medium feed:', error);
            displayErrorMessage();
        });
}
function displayMediumPosts(items) {
    const mediumFeed = document.getElementById('medium-feed');
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    if (items.length === 0) {
        displayErrorMessage('No blog posts found.');
        return;
    }
    const postsToShow = Math.min(3, items.length);
    for (let i = 0; i < postsToShow; i++) {
        const item = items[i];
        const post = createBlogPostElement(item);
        mediumFeed.appendChild(post);
    }
}
function createBlogPostElement(item) {
    const title = item.querySelector('title')?.textContent || 'Untitled';
    const link = item.querySelector('link')?.textContent || '#';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const categories = item.querySelectorAll('category');
    const publishedDate = pubDate ? new Date(pubDate) : new Date();
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    let excerpt = tempDiv.textContent || tempDiv.innerText || '';
    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imgMatch ? imgMatch[1] : null;
    if (excerpt.length > 150) {
        excerpt = excerpt.substring(0, 150) + '...';
    }
    const wordCount = excerpt.split(' ').length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const postElement = document.createElement('article');
    postElement.className = 'blog-post';
    let imageHtml = '';
    if (imageUrl) {
        imageHtml = `<div class="blog-image"><img src="${imageUrl}" alt="${title}" loading="lazy"></div>`;
    } else {
        imageHtml = `<div class="blog-image"><i class="fas fa-newspaper"></i></div>`;
    }
    postElement.innerHTML = `
        ${imageHtml}
        <div class="blog-content-wrapper">
            <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
            <div class="blog-meta">
                <div class="blog-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="blog-reading-time">
                    <i class="fas fa-clock"></i>
                    <span>${readingTime} min read</span>
                </div>
            </div>
            <p class="blog-excerpt">${excerpt}</p>
            <div class="blog-actions">
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="read-more">
                    Read Article <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
    return postElement;
}
function displayErrorMessage(message = 'Unable to load blog posts at this time.') {
    const mediumFeed = document.getElementById('medium-feed');
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Oops!</h3>
        <p>${message}</p>
        <p>Please visit my <a href="https://medium.com/@nerdpioneer" target="_blank" rel="noopener noreferrer">Medium profile</a> directly to read my latest posts.</p>
    `;
    mediumFeed.appendChild(errorElement);
}
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fetchMediumPosts, 1000);
});
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
    images.forEach((img, index) => {
        const imageUrl = img.src;
        const preloadImg = new Image();
        preloadImg.src = imageUrl;
        console.log(`Preloading image ${index + 1}:`, imageUrl);
    });
    images[0].classList.add('active');
    console.log('Profile carousel initialized with', totalImages, 'images');
    function showNextImage() {
        console.log(`Transitioning from image ${currentIndex + 1} to ${((currentIndex + 1) % totalImages) + 1}`);
        const currentImage = images[currentIndex];
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
    function startCarousel() {
        console.log('Starting profile carousel');
        carouselInterval = setInterval(showNextImage, 4000);
    }
    function stopCarousel() {
        console.log('Stopping profile carousel');
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    startCarousel();
    const carousel = document.querySelector('.profile-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
        carousel.addEventListener('touchstart', stopCarousel);
        carousel.addEventListener('touchend', () => {
            setTimeout(startCarousel, 2000); // Resume after 2 seconds on mobile
        });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stopCarousel();
        images.forEach((img, index) => {
            if (index === 0) img.classList.add('active');
        });
    }
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
        } else if (event.data == YT.PlayerState.ERROR) {
            handlePlayerError('Video unavailable');
        }
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

// Google Analytics Event Tracking
function initAnalyticsTracking() {
    // Helper function to safely send events to Google Analytics
    function sendGAEvent(eventName, eventCategory, eventLabel, value = null) {
        if (typeof gtag !== 'undefined') {
            const eventData = {
                event_category: eventCategory,
                event_label: eventLabel
            };
            if (value !== null) {
                eventData.value = value;
            }
            gtag('event', eventName, eventData);
            console.log(`GA Event: ${eventName} | ${eventCategory} | ${eventLabel}`);
        }
    }

    // Track section navigation
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('href').replace('#', '');
            sendGAEvent('navigation_click', 'Navigation', `Section: ${section}`);
        });
    });

    // Track project interactions
    const projectButtons = document.querySelectorAll('.project-btn-primary');
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            sendGAEvent('project_view', 'Projects', `Project: ${projectTitle}`);
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            let platform = 'Unknown';
            if (href.includes('linkedin')) platform = 'LinkedIn';
            if (href.includes('github')) platform = 'GitHub';
            if (href.includes('medium')) platform = 'Medium';
            sendGAEvent('social_click', 'Social Media', platform);
        });
    });

    // Track Study Mode interactions
    const musicButtons = document.querySelectorAll('.music-btn');
    musicButtons.forEach(button => {
        button.addEventListener('click', function() {
            let action = 'Unknown';
            if (button.classList.contains('play-pause-btn')) action = 'Play/Pause';
            if (button.classList.contains('next-btn')) action = 'Next Track';
            if (button.classList.contains('prev-btn')) action = 'Previous Track';
            sendGAEvent('study_mode_interaction', 'Study Mode', action);
        });
    });

    // Track YouTube link clicks
    const youtubeBtn = document.querySelector('.youtube-btn');
    if (youtubeBtn) {
        youtubeBtn.addEventListener('click', function() {
            sendGAEvent('youtube_click', 'Study Mode', 'YouTube Link');
        });
    }

    // Track main CTA button
    const heroCTA = document.querySelector('.hero-cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', function() {
            sendGAEvent('cta_click', 'Hero Section', 'View My Work');
        });
    }

    // Track scroll depth for engagement measurement
    let scrollDepthMarkers = [25, 50, 75, 100];
    let scrollDepthTriggered = [];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100);
        
        scrollDepthMarkers.forEach(marker => {
            if (scrollPercent >= marker && !scrollDepthTriggered.includes(marker)) {
                scrollDepthTriggered.push(marker);
                sendGAEvent('scroll_depth', 'Engagement', `${marker}% Scrolled`, marker);
            }
        });
    });

    // Track page view time (send event after 30 seconds)
    setTimeout(() => {
        sendGAEvent('engagement_time', 'Engagement', '30 Seconds Active', 30);
    }, 30000);

    // Track page view time (send event after 2 minutes)
    setTimeout(() => {
        sendGAEvent('engagement_time', 'Engagement', '2 Minutes Active', 120);
    }, 120000);

    // Track when users reach the Study Mode section
    const studyModeSection = document.querySelector('#music');
    if (studyModeSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sendGAEvent('section_view', 'Engagement', 'Study Mode Section Viewed');
                    observer.unobserve(entry.target); // Only track once
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(studyModeSection);
    }

    // Track document visibility changes (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            sendGAEvent('tab_hidden', 'Engagement', 'User Switched Tabs');
        } else {
            sendGAEvent('tab_visible', 'Engagement', 'User Returned to Tab');
        }
    });

    console.log('Google Analytics event tracking initialized');
}
