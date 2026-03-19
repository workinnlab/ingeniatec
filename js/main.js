/**
 * INGENIATEC - Script Principal
 * Semillero de Investigación - CUA
 * Funcionalidades: Terminal, scroll, animaciones, formulario
 */

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    initCounter();
    initFormHandler();
    initSmoothScroll();
    initTerminalAnimations();
});

// ========================================
// ANIMACIONES DE TERMINAL
// ========================================
function initTerminalAnimations() {
    const terminalLines = document.querySelectorAll('.animate-terminal');

    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(20px)';

        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

// ========================================
// EFECTOS DE SCROLL
// ========================================
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.getElementById('scrollTop');

function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Efecto navbar al hacer scroll
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Botón scroll to top
        if (currentScrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Scroll to top button
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// ANIMACIÓN DE CONTADORES
// ========================================
function initCounter() {
    const counters = document.querySelectorAll('.count');
    const speed = 200; // Velocidad de animación
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const increment = target / speed;
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ========================================
// MANEJO DEL FORMULARIO DE CONTACTO
// ========================================
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            asunto: document.getElementById('asunto').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        // Validación básica
        if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Validar email
        if (!isValidEmail(formData.email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }
        
        // Simular envío (aquí iría la lógica real de envío)
        console.log('Formulario enviado:', formData);
        
        // Mostrar notificación de éxito
        showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
        
        // Resetear formulario
        contactForm.reset();
    });
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Muestra notificaciones toast
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}-fill"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? 'linear-gradient(135deg, #198754, #20c997)' : 
                    type === 'error' ? 'linear-gradient(135deg, #dc3545, #ff6b6b)' : 
                    'linear-gradient(135deg, #0d6efd, #0dcaf0)',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px',
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: '600'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Agregar animaciones de notificación al CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// SCROLL SUAVE PARA ENLACES INTERNOS
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignorar enlaces # vacíos
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Considerar navbar fixed
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Actualizar estado activo en navbar
                updateActiveNavLink(href);
            }
        });
    });
}

/**
 * Actualiza el enlace activo en la navegación
 */
function updateActiveNavLink(targetHref) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetHref) {
            link.classList.add('active');
        }
    });
}

// ========================================
// INTERSECTION OBSERVER PARA ANIMACIONES
// ========================================
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observar elementos para animación
document.querySelectorAll('.line-card, .contact-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(el);
});

// Agregar estilos para animación
const animateStyle = document.createElement('style');
animateStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animateStyle);

// ========================================
// EFECTO PARALLAX SUAVE EN HERO
// ========================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-section');
    const scrolled = window.scrollY;
    
    if (hero && scrolled < window.innerHeight) {
        const particles = document.getElementById('particles');
        if (particles) {
            particles.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
});

// ========================================
// PRELOADER (Opcional)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Eliminar cualquier loader si existe
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
});

// ========================================
// CONSOLE EASTER EGG
// ========================================
console.log(`
%c🚀 INNOVATEC - Semillero de Investigación
%cCorporación Universitaria Americana - Barranquilla

%c¿Eres desarrollador? ¡Únete a nosotros!
Visita: workinnlab.americana.edu.co

`,
    'font-size: 20px; font-weight: bold; color: #0d6efd;',
    'font-size: 12px; color: #6c757d;',
    'font-size: 14px; color: #00d4ff;'
);

// ========================================
// MENÚ MÓVIL
// ========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un enlace
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
