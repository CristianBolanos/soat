document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    const cotizarButton = document.getElementById('cotizarButton');
    const quoteForm = document.getElementById('quoteForm');
    const vehicleTypeSelect = document.getElementById('vehicleType');
    const carField = document.querySelector('.quote-form__field--car');
    const motorcycleField = document.querySelector('.quote-form__field--motorcycle');
    const colorToggle = document.getElementById('colorToggle');
    const customAlert = document.getElementById('customAlert');
    const closeAlert = document.getElementById('closeAlert');

    // Asegurarnos que el alert esté oculto al inicio
    customAlert.style.display = 'none';

    // Inicializar los event listeners del modal una sola vez
    closeAlert.addEventListener('click', () => {
        customAlert.style.display = 'none';
    });

    // Cerrar al hacer clic fuera del modal
    customAlert.addEventListener('click', (e) => {
        if (e.target === customAlert) {
            customAlert.style.display = 'none';
        }
    });

    // Header shrink on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY <= 50) {
            header.classList.add('header--shrink');
        } else {
            header.classList.remove('header--shrink');
        }
        
        // Cerrar menú móvil al hacer scroll
        if (headerNav.classList.contains('active')) {
            headerNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        headerNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && headerNav.classList.contains('active')) {
            headerNav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Smooth scroll to quote section
    cotizarButton.addEventListener('click', () => {
        const cotizarSection = document.getElementById('cotizar');
        cotizarSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Quote form handling
    vehicleTypeSelect.addEventListener('change', function() {
        if (this.value === 'car') {
            carField.style.display = 'block';
            motorcycleField.style.display = 'none';
        } else if (this.value === 'motorcycle') {
            carField.style.display = 'none';
            motorcycleField.style.display = 'block';
        } else {
            carField.style.display = 'none';
            motorcycleField.style.display = 'none';
        }
    });

    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const vehicleType = vehicleTypeSelect.value;
        const plate = document.getElementById('plate').value;
        const cedula = document.getElementById('cedula').value;
        const year = document.getElementById('year').value;
        const engineSize = document.getElementById('engineSize').value;

        let message = `Hola, me gustaría cotizar mi SOAT:\n`;
        message += `Tipo de vehículo: ${vehicleType}\n`;
        message += `Placa: ${plate}\n`;
        message += `Cédula: ${cedula}\n`;
        
        if (vehicleType === 'car') {
            message += `Modelo: ${year}\n`;
        } else if (vehicleType === 'motorcycle') {
            message += `Cilindraje: ${engineSize}\n`;
        }

        const whatsappNumber = '+573167341074'; // Replace with your actual WhatsApp number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');

        // Mostrar el alert solo después de enviar el formulario
        customAlert.style.display = 'flex';
    });

    // Toggle FAQ answers
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');

        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight;
            
            // Close all other answers
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-item__answer').style.maxHeight = null;
                }
            });

            // Toggle current answer
            if (isOpen) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Color theme toggle
    colorToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

