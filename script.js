// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Custom Cursor
function initCustomCursor() {
    if (window.innerWidth < 1024) return; // Don't initialize on mobile/tablet

    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    if (!cursor || !cursorDot) return;

    document.body.classList.add('cursor-none');

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
    });

    // Add hover effect
    const links = document.querySelectorAll('a, button, .nav-toggle, .theme-toggle');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorDot.style.transform += ' scale(1.5)';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.5)', '');
        });
    });
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', initCustomCursor);

// Reinitialize custom cursor on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('cursor-none');
        initCustomCursor();
    }, 250);
});

// Animate skill progress bars when they come into view
const skillItems = document.querySelectorAll('.skill-item');

const animateSkills = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.skill-progress-fill');
            const progress = entry.target.dataset.progress;
            progressBar.style.width = `${progress}%`;
            observer.unobserve(entry.target);
        }
    });
};

const skillsObserver = new IntersectionObserver(animateSkills, {
    threshold: 0.5
});

skillItems.forEach(item => {
    skillsObserver.observe(item);
});

// Animate stats numbers
const stats = document.querySelectorAll('.stat-number');

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

const animateStats = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = parseInt(entry.target.textContent);
            animateValue(entry.target, 0, value, 2000);
            observer.unobserve(entry.target);
        }
    });
};

const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
});

stats.forEach(stat => {
    statsObserver.observe(stat);
});

// Typing animation
const typingText = new Typed('.typing-text', {
    strings: [
        'I am a <span class="highlight">Frontend Developer</span> at heart.',
        'I create <span class="highlight">beautiful websites</span>.',
        'I build <span class="highlight">user experiences</span>.',
        'I craft <span class="highlight">digital solutions</span>.'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true,
    contentType: 'html'
});

// 3D Card Tilt Effect
function handleCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    card.style.transform = `
        translateZ(50px) 
        rotateX(${-deltaY * 10}deg) 
        rotateY(${deltaX * 10}deg)
    `;
}

function resetCardTilt(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
}

// Apply 3D tilt to project and skill cards
function initCardTiltEffects() {
    const cards = document.querySelectorAll('.project-card, .skills-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardTilt);
        card.addEventListener('mouseleave', resetCardTilt);
    });
}

// 3D Parallax Hero Effect
function initParallaxHero() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroSection || !heroContent) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroContent.style.transform = `
            translateZ(-1px) 
            scale(2) 
            translateY(${scrollPosition * 0.5}px)
        `;
    });
}

// Initialize 3D effects
document.addEventListener('DOMContentLoaded', () => {
    initCardTiltEffects();
    initParallaxHero();
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon
function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// Set initial theme based on user preference
if (!savedTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = prefersDark ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', initialTheme);
    localStorage.setItem('theme', initialTheme);
    updateThemeIcon(initialTheme);
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Section Highlighting
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    const scrollPosition = window.scrollY;

    // Find the current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Update active link
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        
        if (href === currentSectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize section highlighting
document.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
    
    // Smooth scroll to section when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
});

// Update active section on scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveSection, 100);
});

// Add hover effects for buttons
const buttons = document.querySelectorAll('.download-cv, .hire-me');
buttons.forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        const x = e.clientX - button.getBoundingClientRect().left;
        const y = e.clientY - button.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    });
});

// Download CV functionality
document.querySelector('.download-cv').addEventListener('click', () => {
    // Add your download logic here
    alert('CV download started!');
});

// Hire me button functionality
document.querySelector('.hire-me').addEventListener('click', () => {
    // Add your contact form or hiring logic here
    window.location.href = '#contact';
});

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(50px)';
            
            setTimeout(() => {
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 300);
        });
    });
});

// Initialize project cards
projectCards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'scale(1) translateY(0)';
});

// Contact Form Handling
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add loading state to button
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Show success message
        alert('Message sent successfully! I will get back to you soon.');
        
        // Reset form
        form.reset();
        
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
    
    return false;
}

// Floating label animation
const formInputs = document.querySelectorAll('.input-group input, .input-group textarea');

formInputs.forEach(input => {
    // Add placeholder to maintain floating label
    input.setAttribute('placeholder', ' ');
    
    // Handle autofill
    input.addEventListener('animationstart', (e) => {
        if (e.animationName === 'onAutoFillStart') {
            const label = input.nextElementSibling;
            label.style.top = '-10px';
            label.style.left = '1rem';
            label.style.fontSize = '0.8rem';
            label.style.background = 'var(--background-color)';
            label.style.color = 'var(--primary-color)';
        }
    });
});

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Active link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveLink);

// Set active link on scroll
window.addEventListener('scroll', setActiveLink);

// Set active link on click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});
