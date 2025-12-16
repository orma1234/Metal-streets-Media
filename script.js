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
    
    // Combine budget amount with currency
    const budgetAmount = data.budgetAmount || '';
    const budgetCurrency = data.budgetCurrency || '';
    data.budget = budgetAmount + ' ' + budgetCurrency;
    delete data.budgetAmount; // Remove the separate budgetAmount field
    delete data.budgetCurrency; // Remove the separate budgetCurrency field
    
    // Debug: Log the processed data
    console.log('Processed form data:', data);
    
    // Add timestamp
    data.timestamp = new Date().toLocaleString();
    
    console.log('Form submitted with data:', data);
    
    // Try multiple submission methods
    submitFormData(data, submitBtn, originalText);
});

// Enhanced form submission with multiple fallback methods
async function submitFormData(data, submitBtn, originalText) {
    const methods = [
        { name: 'Google Apps Script', url: 'https://script.google.com/macros/s/AKfycbwNFnB2_aG_x9dyiYsypicbT76pme7W7VtmewINhB8ta03ze3NreKe5pxDeJL4YqnLKwQ/exec' },
        { name: 'Email Fallback', url: null }
    ];
    
    for (let i = 0; i < methods.length; i++) {
        const method = methods[i];
        console.log(`Trying submission method ${i + 1}: ${method.name}`);
        
        try {
            if (method.name === 'Email Fallback') {
                // Use mailto as final fallback
                await submitViaEmail(data);
                showSuccessMessage(submitBtn, originalText);
                return;
            } else if (method.name === 'Google Apps Script') {
                // Use iframe method to bypass CORS (same as simple form test)
                const success = await submitViaIframe(data, method.url);
                if (success) {
                    showSuccessMessage(submitBtn, originalText);
                    return;
                }
            } else {
                const success = await submitViaXHR(data, method.url, method.name);
                if (success) {
                    showSuccessMessage(submitBtn, originalText);
                    return;
                }
            }
        } catch (error) {
            console.error(`Method ${method.name} failed:`, error);
            if (i === methods.length - 1) {
                // All methods failed
                showErrorMessage(submitBtn, originalText, 'All submission methods failed. Please contact us directly at metalstreetmedia@gmail.com');
            }
        }
    }
}

// Submit via iframe (bypasses CORS)
function submitViaIframe(data, url) {
    return new Promise((resolve, reject) => {
        try {
            const params = new URLSearchParams(data).toString();
            const fullUrl = `${url}?${params}`;
            
            console.log('Submitting via iframe:', fullUrl);
            
            // Create a hidden iframe to submit the form
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = fullUrl;
            document.body.appendChild(iframe);
            
            // Resolve after a short delay (iframe method can't read response)
            setTimeout(() => {
                console.log('Iframe submission completed');
                document.body.removeChild(iframe);
                resolve(true);
            }, 2000);
            
        } catch (error) {
            console.error('Iframe submission error:', error);
            reject(error);
        }
    });
}

// Submit via XMLHttpRequest
function submitViaXHR(data, url, methodName) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // For Google Apps Script, we need to handle CORS differently
        if (methodName === 'Google Apps Script') {
            // Use GET request with parameters for Google Apps Script
            const params = new URLSearchParams(data).toString();
            const getUrl = `${url}?${params}`;
            
            xhr.open('GET', getUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
        } else {
            // Use POST for other services
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            // Convert data to URL-encoded format
            const params = new URLSearchParams(data).toString();
        }
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(`${methodName} Response status:`, xhr.status);
                console.log(`${methodName} Response text:`, xhr.responseText);
                
                if (xhr.status === 200 || xhr.status === 0) {
                    // Check if response contains success message
                    const responseText = xhr.responseText.toLowerCase();
                    console.log(`${methodName} Response analysis:`, {
                        status: xhr.status,
                        responseText: xhr.responseText,
                        containsSuccess: responseText.includes('success'),
                        containsDataSaved: responseText.includes('data saved')
                    });
                    
                    if (responseText.includes('success') || responseText.includes('data saved')) {
                        resolve(true);
                    } else {
                        reject(new Error(`Unexpected response: ${xhr.responseText}`));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
                }
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error'));
        };
        
        xhr.ontimeout = function() {
            reject(new Error('Request timeout'));
        };
        
        // Set timeout to 15 seconds for Google Apps Script
        xhr.timeout = 15000;
        
        try {
            if (methodName === 'Google Apps Script') {
                xhr.send();
            } else {
                const params = new URLSearchParams(data).toString();
                xhr.send(params);
            }
        } catch (error) {
            reject(error);
        }
    });
}

// Submit via Google Apps Script using fetch (bypasses some CORS issues)
function submitViaGoogleAppsScript(data, url) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams(data).toString();
        const getUrl = `${url}?${params}`;
        
        console.log('Submitting to Google Apps Script:', getUrl);
        
        // Use fetch with no-cors mode to bypass CORS
        fetch(getUrl, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache'
        })
        .then(() => {
            // With no-cors mode, we can't read the response, but if no error occurred, assume success
            console.log('Google Apps Script submission completed (no-cors mode)');
            resolve(true);
        })
        .catch(error => {
            console.error('Google Apps Script fetch error:', error);
            reject(error);
        });
    });
}

// Submit via email fallback
function submitViaEmail(data) {
    return new Promise((resolve, reject) => {
        try {
            const subject = encodeURIComponent('New Contact Form Submission - Metal Streets Media');
            const body = encodeURIComponent(`
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Country: ${data.country}
Business Type: ${data.businessType}
Services Required: ${data.services}
Timestamp: ${data.timestamp}

This submission was made through the Metal Streets Media contact form.
            `);
            
            const mailtoUrl = `mailto:metalstreetmedia@gmail.com?subject=${subject}&body=${body}`;
            
            // Open mailto link
            window.open(mailtoUrl, '_blank');
            
            // Show instruction to user
            alert('Your form submission failed, but we\'ve opened your email client with the form details pre-filled. Please send the email to complete your submission.');
            
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

// Show beautiful success message
function showSuccessMessage(submitBtn, originalText) {
    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    
    // Show beautiful success modal
    showBeautifulSuccessModal();
}

// Show beautiful success modal
function showBeautifulSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset form
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
    }
}

// Show error message
function showErrorMessage(submitBtn, originalText, message) {
    alert(message);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

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

// Hero video autoplay helper (especially for mobile)
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroVideo');
    if (!heroVideo) return;

    const heroContainer = heroVideo.closest('.hero-logo-container');

    // Try to play as soon as DOM is ready
    const tryPlay = () => {
        heroVideo.muted = true; // ensure muted for mobile autoplay policies
        const playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(() => {
                    // Mark container as playing so we can fade out the cover
                    if (heroContainer) {
                        heroContainer.classList.add('playing');
                    }
                })
                .catch((err) => {
                    console.warn('Autoplay blocked, will retry on first user interaction.', err);
                });
        } else {
            // No promise support; assume playing
            if (heroContainer) {
                heroContainer.classList.add('playing');
            }
        }
    };

    // Initial attempt
    tryPlay();

    // Fallback: retry on first user interaction (tap/scroll)
    const unlockEvents = ['touchstart', 'click', 'scroll'];
    const unlockHandler = () => {
        tryPlay();
        unlockEvents.forEach(evt => window.removeEventListener(evt, unlockHandler));
    };
    unlockEvents.forEach(evt => window.addEventListener(evt, unlockHandler, { once: true }));
});
