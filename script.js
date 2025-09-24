// Expandable Service Cards
function toggleService(card) {
    const isExpanded = card.classList.contains('expanded');
    const expandBtn = card.querySelector('.expand-btn');
    
    // Close all other expanded cards
    document.querySelectorAll('.service-card.expanded').forEach(otherCard => {
        if (otherCard !== card) {
            otherCard.classList.remove('expanded');
            const otherBtn = otherCard.querySelector('.expand-btn');
            otherBtn.textContent = '+';
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
        expandBtn.textContent = '+';
    } else {
        card.classList.add('expanded');
        expandBtn.textContent = '−';
    }
}

// Initialize service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        
        // Prevent event bubbling when clicking the expand button
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleService(card);
        });
        
        // Add hover effect for expand button
        card.addEventListener('mouseenter', () => {
            expandBtn.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('expanded')) {
                expandBtn.style.opacity = '0';
            }
        });
    });
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Get selected services and join them with commas
    const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
        .map(checkbox => checkbox.value);
    
    data.services = selectedServices.join(', ');
    
    // Combine country code with phone number
    const countryCode = data.countryCode || '';
    const phoneNumber = data.phone || '';
    data.phone = countryCode + ' ' + phoneNumber;
    delete data.countryCode; // Remove the separate countryCode field
    
    // Add timestamp
    data.timestamp = new Date().toLocaleString();
    
    console.log('Form submitted with data:', data);
    
    // Your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsVp3pGHE7qTbgN2trdcXXP6HMi8_eJFQ62BEdGDmq7Ul3l6FSqYlAKwq6qKbj1nWV/exec';
    
    // Debug: Log the URL being used
    console.log('Submitting to URL:', GOOGLE_SCRIPT_URL);
    console.log('Form data being sent:', data);
    
    // Send data to Google Apps Script using XMLHttpRequest (more reliable)
    const xhr = new XMLHttpRequest();
    xhr.open('POST', GOOGLE_SCRIPT_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    // Convert data to URL-encoded format
    const params = new URLSearchParams(data).toString();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('XHR Response status:', xhr.status);
            console.log('XHR Response text:', xhr.responseText);
            
            if (xhr.status === 200 || xhr.status === 0) {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                // Reset form
                document.getElementById('contactForm').reset();
            } else {
                console.error('Error submitting form. Status:', xhr.status);
                alert('There was an error submitting your form. Please try again or contact us directly at metalstreetmedia@gmail.com');
            }
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error submitting form');
        alert('There was a network error. Please check your internet connection and try again.');
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    };
    
    xhr.send(params);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.stat, .portfolio-item, .contact-item');
    animateElements.forEach(el => observer.observe(el));
});

// Number counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 95 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 95 ? '%' : '+');
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    stat.textContent = '0' + (text.includes('%') ? '%' : '+');
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Sci-Fi Particle Animation
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.particleCount = 100;
        this.container = document.querySelector('.particles-container');
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Create additional particles dynamically
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        
        // Start animation loop
        this.animate();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties for small particles
        const size = Math.random() * 2 + 1; // 1-3px (smaller particles)
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s delay
        const duration = Math.random() * 6 + 4; // 4-10s duration (faster)
        
        // Random color from accent colors
        const colors = [
            'var(--accent-primary)',
            'var(--accent-secondary)', 
            'var(--accent-tertiary)',
            'var(--accent-quaternary)',
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#f5576c',
            '#4facfe',
            '#00f2fe',
            '#43e97b',
            '#38f9d7'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation type
        const animationType = Math.random() > 0.7 ? 'floatInPlace' : 'float';
        const top = animationType === 'floatInPlace' ? Math.random() * 80 + 10 : 'auto'; // 10-90%
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            ${top !== 'auto' ? `top: ${top}%;` : ''}
            background: ${color};
            animation: ${animationType} ${duration}s infinite linear;
            animation-delay: ${delay}s;
            opacity: ${Math.random() * 0.4 + 0.4}; // 0.4-0.8 opacity
        `;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    animate() {
        // Add mouse interaction (optimized for 100 particles)
        let mouseX = 0.5, mouseY = 0.5;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });

        // Throttled mouse interaction for performance
        setInterval(() => {
            this.particles.forEach((particle, index) => {
                if (index % 10 === 0) { // Only affect every 10th particle for performance
                    const speed = (index % 3 + 1) * 0.3;
                    const x = (mouseX - 0.5) * speed * 15;
                    const y = (mouseY - 0.5) * speed * 15;
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
        }, 100);

        // Add subtle random movement (less frequent for performance)
        setInterval(() => {
            this.particles.forEach((particle, index) => {
                if (index % 5 === 0) { // Only affect every 5th particle
                    const randomX = (Math.random() - 0.5) * 5;
                    const randomY = (Math.random() - 0.5) * 5;
                    
                    particle.style.transform += ` translate(${randomX}px, ${randomY}px)`;
                }
            });
        }, 3000);
    }
}

// Initialize particle system when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});