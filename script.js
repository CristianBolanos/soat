document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    const quoteForm = document.getElementById('quoteForm');
    const vehicleTypeSelect = document.getElementById('vehicleType');
    const carField = document.querySelector('.quote-form__field--car');
    const motorcycleField = document.querySelector('.quote-form__field--motorcycle');
    const colorToggle = document.getElementById('colorToggle');
    const themeIcon = colorToggle ? colorToggle.querySelector('.theme-icon') : null;
    const customAlert = document.getElementById('customAlert');
    const closeAlert = document.getElementById('closeAlert');
    const alertSummary = document.getElementById('alertSummary');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const plateInput = document.getElementById('plate');
    const currentYearSpan = document.getElementById('currentYear');

    // 1. Set dynamic current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 2. Format plate input automatically to uppercase
    if (plateInput) {
        plateInput.addEventListener('input', function () {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }

    // 3. Header elevation on scroll & Scroll-to-top button visibility
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        if (scrollPos > 30) {
            header.classList.add('header--shrink');
        } else {
            header.classList.remove('header--shrink');
        }

        if (scrollTopBtn) {
            if (scrollPos > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Mobile Navigation Menu Toggle
    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = headerNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close mobile nav when clicking a link
        document.querySelectorAll('.header__nav-link, .header__mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                headerNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && headerNav.classList.contains('active')) {
                headerNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // 5. Vehicle Type Selection & Conditional Fields
    if (vehicleTypeSelect) {
        vehicleTypeSelect.addEventListener('change', function () {
            const val = this.value;
            if (val === 'car') {
                if (carField) carField.style.display = 'block';
                if (motorcycleField) motorcycleField.style.display = 'none';
            } else if (val === 'motorcycle') {
                if (carField) carField.style.display = 'none';
                if (motorcycleField) motorcycleField.style.display = 'block';
            } else {
                if (carField) carField.style.display = 'none';
                if (motorcycleField) motorcycleField.style.display = 'none';
            }
        });
    }

    // 6. Form Submission & WhatsApp Deep Linking
    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const vehicleType = vehicleTypeSelect.value;
            const plate = document.getElementById('plate').value.trim().toUpperCase();
            const cedula = document.getElementById('cedula').value.trim();
            const year = document.getElementById('year') ? document.getElementById('year').value.trim() : '';
            const engineSize = document.getElementById('engineSize') ? document.getElementById('engineSize').value.trim() : '';

            if (!vehicleType) {
                alert('Por favor selecciona el tipo de vehículo.');
                vehicleTypeSelect.focus();
                return;
            }

            if (!plate || plate.length < 5) {
                alert('Por favor ingresa una placa válida.');
                document.getElementById('plate').focus();
                return;
            }

            if (!cedula) {
                alert('Por favor ingresa el número de cédula del propietario.');
                document.getElementById('cedula').focus();
                return;
            }

            // Vehicle translation label
            let typeLabel = 'Vehículo Particular';
            if (vehicleType === 'car') typeLabel = 'Carro / Camioneta';
            if (vehicleType === 'motorcycle') typeLabel = 'Moto / Motocarro';
            if (vehicleType === 'heavy') typeLabel = 'Carga Pesada / Taxi / Público';

            // Construct friendly WhatsApp Message
            let message = `*¡Hola SOAT YA!* Deseo cotizar mi póliza oficial:\n\n`;
            message += `🚗 *Tipo:* ${typeLabel}\n`;
            message += `🔢 *Placa:* ${plate}\n`;
            message += `🪪 *Cédula:* ${cedula}\n`;

            if (vehicleType === 'car' && year) {
                message += `📅 *Modelo:* ${year}\n`;
            } else if (vehicleType === 'motorcycle' && engineSize) {
                message += `⚡ *Cilindraje:* ${engineSize} c.c.\n`;
            }

            message += `\nQuedo atento a la liquidación oficial en RUNT y opciones de pago. ¡Gracias!`;

            const whatsappNumber = '573167341074';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            // Summary display in modal
            if (alertSummary) {
                alertSummary.innerHTML = `
                    <p style="margin: 0 0 4px 0;"><strong>Vehículo:</strong> ${typeLabel}</p>
                    <p style="margin: 0 0 4px 0;"><strong>Placa:</strong> ${plate}</p>
                    <p style="margin: 0;"><strong>Cédula:</strong> ${cedula}</p>
                `;
            }

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');

            // Show confirmation modal
            if (customAlert) {
                customAlert.classList.add('active');
                customAlert.setAttribute('aria-hidden', 'false');
            }
        });
    }

    // Modal close events
    if (closeAlert && customAlert) {
        closeAlert.addEventListener('click', () => {
            customAlert.classList.remove('active');
            customAlert.setAttribute('aria-hidden', 'true');
        });

        customAlert.addEventListener('click', (e) => {
            if (e.target.classList.contains('custom-alert__backdrop')) {
                customAlert.classList.remove('active');
                customAlert.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 7. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-item__question');
        const answerDiv = item.querySelector('.faq-item__answer');

        if (questionBtn && answerDiv) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-item__question');
                        const otherAns = otherItem.querySelector('.faq-item__answer');
                        if (otherAns) otherAns.style.maxHeight = null;
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answerDiv.style.maxHeight = null;
                    questionBtn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // 8. Dark Mode / Light Mode Preference & Toggle
    function updateThemeIcon(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (colorToggle) {
        colorToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });

        // Check stored preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }
    }

    // 9. Smooth Scroll for all internal hash anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
