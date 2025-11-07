// Configuración y utilidades
const storageAvailable = (type) => {
    try {
        const storage = window[type];
        const test = '__storage_test__';
        storage.setItem(test, test);
        storage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Cargar tema guardado
    if (storageAvailable('localStorage')) {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            }
        } catch (e) {
            console.log('No se pudo cargar el tema guardado');
        }
    }

    // Toggle del menú móvil
    const toggleNav = () => {
        navMenu?.classList.toggle('show');
        navToggle?.classList.toggle('active');
        navOverlay?.classList.toggle('show');
        
        // Prevenir scroll cuando el menú está abierto
        if (navMenu?.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    // Toggle del tema
    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        
        // Guardar preferencia si es posible
        if (storageAvailable('localStorage')) {
            try {
                const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
                localStorage.setItem('theme', theme);
            } catch (e) {
                console.log('No se pudo guardar la preferencia de tema');
            }
        }
    };

    // Event listeners
    navToggle?.addEventListener('click', toggleNav);
    navOverlay?.addEventListener('click', toggleNav);
    themeToggle?.addEventListener('click', toggleTheme);

    // Cerrar menú al hacer click en enlaces (móvil)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navMenu?.classList.contains('show')) {
                toggleNav();
            }
        });
    });

    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('show')) {
            toggleNav();
        }
    });

    // Smooth scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces # vacíos
            if (href === '#' || href === '#!') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto parallax en el título hero (optimizado con requestAnimationFrame)
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero h1');
                if (hero) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                    hero.style.opacity = 1 - scrolled / window.innerHeight;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Manejar resize de ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Cerrar menú si se cambia a desktop
            if (window.innerWidth > 768 && navMenu?.classList.contains('show')) {
                toggleNav();
            }
        }, 250);
    });

    // Log de inicialización (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Portfolio inicializado correctamente');
        console.log('Tema:', document.body.classList.contains('dark-mode') ? 'Oscuro' : 'Claro');
    }
});