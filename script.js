// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(n) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial
    if (testimonials[n]) {
        testimonials[n].classList.add('active');
    }
    
    // Add active class to current dot
    if (dots[n]) {
        dots[n].classList.add('active');
    }
}

function currentSlide(n) {
    currentTestimonial = n - 1;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
function autoRotateTestimonials() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Start auto-rotation
if (testimonials.length > 0) {
    setInterval(autoRotateTestimonials, 5000); // Change every 5 seconds
}

// Smooth scrolling for anchor links
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

// Quote Form Validation and Submission
const quoteForm = document.querySelector('.quote-form');
if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const source = this.querySelector('input[placeholder*="Source"]').value.trim();
        const destination = this.querySelector('input[placeholder*="Destination"]').value.trim();
        
        if (!source || !destination) {
            alert('Please fill in both source and destination fields.');
            return;
        }
        
        // Simulate quote generation
        showQuoteLoading();
        
        setTimeout(() => {
            showQuoteResults(source, destination);
        }, 2000);
    });
}

function showQuoteLoading() {
    const submitBtn = document.querySelector('.quote-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Getting Quote...';
    submitBtn.disabled = true;
    
    // Store original text for restoration
    submitBtn.dataset.originalText = originalText;
}

function showQuoteResults(source, destination) {
    const submitBtn = document.querySelector('.quote-form button[type="submit"]');
    
    // Create results modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="color: #2c5aa0; margin-bottom: 1rem;">Quote Results</h3>
            <p><strong>Route:</strong> ${source} → ${destination}</p>
            <div style="margin: 1.5rem 0;">
                <div style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 5px;">
                    <strong>Ocean Freight:</strong> $1,200 - $1,800
                </div>
                <div style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 5px;">
                    <strong>Transit Time:</strong> 15-20 days
                </div>
                <div style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 5px;">
                    <strong>Next Departure:</strong> March 15, 2024
                </div>
            </div>
            <button onclick="this.closest('.modal').remove()" style="
                background: #2c5aa0;
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1rem;
            ">Close</button>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Restore button
    submitBtn.textContent = submitBtn.dataset.originalText;
    submitBtn.disabled = false;
}

// Button click animations
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll animations
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.feature, .customer-logo, .testimonial');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.querySelectorAll('.feature, .customer-logo').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255,255,255,0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Form input focus effects
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = '#2c5aa0';
        this.style.boxShadow = '0 0 0 2px rgba(44, 90, 160, 0.2)';
    });
    
    input.addEventListener('blur', function() {
        this.style.borderColor = 'rgba(255,255,255,0.3)';
        this.style.boxShadow = 'none';
    });
});

// Console welcome message
console.log('%cWelcome to Pravin CHA wala! 🚢', 'color: #2c5aa0; font-size: 20px; font-weight: bold;');
console.log('%cYour Digital Logistics Partner', 'color: #666; font-size: 14px;');