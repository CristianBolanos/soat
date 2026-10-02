/**
 * SOAT YA - Main Application Script
 * Progressive Stepper Quote Form, FAQ Accordion, Mobile Nav,
 * Theme Toggle, WhatsApp Deep Linking, Analytics Events (prepared),
 * Scroll-to-Top, Privacy Modal, Vehicle Card Triggers.
 *
 * IMPORTANT: No fake API calls, no invented data, no simulated queries.
 * The stepper prepares data and redirects to WhatsApp for human follow-up.
 */

/* ======================================================================
   Configuration (easily updatable without touching logic)
   ====================================================================== */
const CONFIG = {
    whatsappNumber: '573167341074',
    analyticsId: 'GA_MEASUREMENT_ID', // Replace with real ID when available
};

/* ======================================================================
   Utility: Safe Analytics Event Push (no-op if GA not configured)
   ====================================================================== */
function trackEvent(eventName, params) {
    if (typeof gtag === 'function' && CONFIG.analyticsId !== 'GA_MEASUREMENT_ID') {
        gtag('event', eventName, params || {});
    }
}

/* ======================================================================
   DOMContentLoaded — Main Init
   ====================================================================== */
document.addEventListener('DOMContentLoaded', function () {

    // ── DOM References ──────────────────────────────────────────────
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    const colorToggle = document.getElementById('colorToggle');
    const themeIcon = colorToggle ? colorToggle.querySelector('.theme-icon') : null;
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const currentYearSpan = document.getElementById('currentYear');
    const plateInput = document.getElementById('plate');
    const cedulaInput = document.getElementById('cedula');

    // Stepper elements
    const stepPanels = [
        document.getElementById('stepPanel1'),
        document.getElementById('stepPanel2'),
        document.getElementById('stepPanel3'),
        document.getElementById('stepPanel4'),
    ];
    const stepDots = document.querySelectorAll('.step-dot');
    const stepperTitle = document.getElementById('stepperStepTitle');
    const vehicleOptionBtns = document.querySelectorAll('.vehicle-option-btn');
    const selectedVehicleInput = document.getElementById('selectedVehicleType');
    const progressiveForm = document.getElementById('progressiveQuoteForm');
    const step2BackBtn = document.getElementById('step2BackBtn');

    // Result panel elements
    const resultPlateDisplay = document.getElementById('resultPlateDisplay');
    const resultTypeDisplay = document.getElementById('resultTypeDisplay');
    const resultDocDisplay = document.getElementById('resultDocDisplay');
    const resultContinueBtn = document.getElementById('resultContinueBtn');
    const resultResetBtn = document.getElementById('resultResetBtn');

    // Modals
    const privacyModal = document.getElementById('privacyModal');
    const openPrivacyBtn = document.getElementById('openPrivacyModal');
    const closePrivacyBtn = document.getElementById('closePrivacyModal');

    // Vehicle card triggers from the Tipos de Vehículo section
    const triggerQuoteBtns = document.querySelectorAll('.trigger-quote-btn');

    // ── 1. Footer Year ──────────────────────────────────────────────
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ── 2. Input Sanitization ───────────────────────────────────────
    if (plateInput) {
        plateInput.addEventListener('input', function () {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        });
    }

    if (cedulaInput) {
        cedulaInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    // ── 3. Header Scroll Behavior & Scroll-to-Top ───────────────────
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const scrollPos = window.scrollY;

                if (scrollPos > 40) {
                    header.classList.add('header--shrink');
                } else {
                    header.classList.remove('header--shrink');
                }

                if (scrollTopBtn) {
                    scrollTopBtn.classList.toggle('visible', scrollPos > 450);
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── 4. Mobile Navigation ────────────────────────────────────────
    function closeMobileNav() {
        if (headerNav) headerNav.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = headerNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.header__nav-link, .header__mobile-cta').forEach(function (link) {
            link.addEventListener('click', closeMobileNav);
        });

        document.addEventListener('click', function (e) {
            if (!header.contains(e.target) && headerNav.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }

    // ── 5. Progressive Stepper Logic ────────────────────────────────
    let currentStep = 1;
    let selectedType = '';

    const stepTitles = {
        1: 'Paso 1: Tipo de Vehículo',
        2: 'Paso 2: Placa y Documento',
        3: 'Paso 3: Procesando…',
    };

    const vehicleLabels = {
        moto: 'Motocicleta / Motocarro',
        carro: 'Automóvil / Camioneta',
        taxi: 'Taxi / Servicio Público Urbano',
        carga: 'Vehículo de Carga',
        publico: 'Bus / Microbús / Servicio Público',
        otro: 'Campero / Utilitario / Otro',
    };

    function goToStep(step) {
        // Deactivate all panels
        stepPanels.forEach(function (panel) {
            if (panel) panel.classList.remove('active');
        });

        // Activate requested panel
        if (stepPanels[step - 1]) {
            stepPanels[step - 1].classList.add('active');
        }

        // Update step dots
        stepDots.forEach(function (dot) {
            const dotStep = parseInt(dot.getAttribute('data-step'), 10);
            dot.classList.remove('active', 'completed');
            if (dotStep === step || (step === 4 && dotStep === 3)) {
                dot.classList.add('active');
            } else if (dotStep < step) {
                dot.classList.add('completed');
            }
        });

        // Update title
        if (stepperTitle) {
            stepperTitle.textContent = stepTitles[step] || 'Resultado';
        }

        currentStep = step;
    }

    // Step 1: Vehicle type selection
    vehicleOptionBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Clear previous selection
            vehicleOptionBtns.forEach(function (b) { b.classList.remove('selected'); });

            // Mark selected
            btn.classList.add('selected');
            selectedType = btn.getAttribute('data-type');

            if (selectedVehicleInput) {
                selectedVehicleInput.value = selectedType;
            }

            trackEvent('vehicle_type_selected', { vehicle_type: selectedType });

            // Advance to step 2 after brief visual feedback
            setTimeout(function () {
                goToStep(2);
                if (plateInput) plateInput.focus();
            }, 250);
        });
    });

    // Step 2: Back button
    if (step2BackBtn) {
        step2BackBtn.addEventListener('click', function () {
            goToStep(1);
        });
    }

    // Step 2: Form submission
    if (progressiveForm) {
        progressiveForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const plate = plateInput ? plateInput.value.trim().toUpperCase() : '';
            const cedula = cedulaInput ? cedulaInput.value.trim() : '';
            const termsCheck = document.getElementById('termsCheck');

            // Validation
            if (!selectedType) {
                goToStep(1);
                return;
            }

            if (!plate || plate.length < 5) {
                showFieldError(plateInput, 'Ingresa una placa válida (mínimo 5 caracteres).');
                return;
            }

            if (!cedula || cedula.length < 5) {
                showFieldError(cedulaInput, 'Ingresa un número de documento válido.');
                return;
            }

            if (termsCheck && !termsCheck.checked) {
                alert('Debes autorizar el tratamiento de datos para continuar.');
                termsCheck.focus();
                return;
            }

            trackEvent('form_submit', { vehicle_type: selectedType, plate: plate });

            // Go to loading step
            goToStep(3);

            // Simulate processing delay (NOT a real API call — purely UX animation)
            setTimeout(function () {
                showResult(plate, cedula, selectedType);
            }, 1800);
        });
    }

    function showFieldError(inputEl, msg) {
        if (!inputEl) return;
        inputEl.focus();
        inputEl.style.borderColor = 'var(--color-danger)';
        // Simple inline error feedback (accessible)
        let existingErr = inputEl.parentElement.parentElement.querySelector('.field-error');
        if (existingErr) existingErr.remove();

        const errSpan = document.createElement('span');
        errSpan.className = 'field-error';
        errSpan.setAttribute('role', 'alert');
        errSpan.style.cssText = 'display:block;font-size:0.78rem;color:var(--color-danger);margin-top:4px;font-weight:600;';
        errSpan.textContent = msg;
        inputEl.parentElement.parentElement.appendChild(errSpan);

        inputEl.addEventListener('input', function handler() {
            inputEl.style.borderColor = '';
            if (errSpan.parentElement) errSpan.remove();
            inputEl.removeEventListener('input', handler);
        });
    }

    function showResult(plate, cedula, vehicleType) {
        const typeLabel = vehicleLabels[vehicleType] || 'Vehículo';

        if (resultPlateDisplay) resultPlateDisplay.textContent = plate;
        if (resultTypeDisplay) resultTypeDisplay.textContent = typeLabel;
        if (resultDocDisplay) resultDocDisplay.textContent = cedula;

        // Build WhatsApp message with real data only
        let message = '*Solicitud de Cotización SOAT*\n\n';
        message += '🚗 *Tipo:* ' + typeLabel + '\n';
        message += '🔢 *Placa:* ' + plate + '\n';
        message += '🪪 *Documento:* ' + cedula + '\n\n';
        message += 'Solicito la liquidación oficial de mi SOAT según tarifas vigentes. Quedo atento. ¡Gracias!';

        const whatsappUrl = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);

        if (resultContinueBtn) {
            resultContinueBtn.href = whatsappUrl;
        }

        goToStep(4);

        trackEvent('quote_result_shown', { vehicle_type: vehicleType, plate: plate });
    }

    // Step 4: Reset
    if (resultResetBtn) {
        resultResetBtn.addEventListener('click', function () {
            // Clear form
            if (plateInput) { plateInput.value = ''; plateInput.style.borderColor = ''; }
            if (cedulaInput) { cedulaInput.value = ''; cedulaInput.style.borderColor = ''; }
            selectedType = '';
            if (selectedVehicleInput) selectedVehicleInput.value = '';
            vehicleOptionBtns.forEach(function (b) { b.classList.remove('selected'); });

            // Remove any error spans
            document.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });

            goToStep(1);
        });
    }

    // ── 6. Vehicle Card Triggers (Tipos de Vehículo section) ────────
    triggerQuoteBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const type = btn.getAttribute('data-type');

            // Pre-select the vehicle type in the stepper
            vehicleOptionBtns.forEach(function (b) { b.classList.remove('selected'); });
            vehicleOptionBtns.forEach(function (b) {
                if (b.getAttribute('data-type') === type) {
                    b.classList.add('selected');
                }
            });

            selectedType = type;
            if (selectedVehicleInput) selectedVehicleInput.value = type;

            // Navigate to step 2
            goToStep(2);

            // Scroll to the stepper
            const stepperEl = document.getElementById('cotizador-pasos');
            if (stepperEl) {
                stepperEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            if (plateInput) {
                setTimeout(function () { plateInput.focus(); }, 400);
            }

            trackEvent('vehicle_card_click', { vehicle_type: type });
        });
    });

    // ── 7. FAQ Accordion ────────────────────────────────────────────
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        var questionBtn = item.querySelector('.faq-item__question');
        var answerDiv = item.querySelector('.faq-item__answer');

        if (questionBtn && answerDiv) {
            questionBtn.addEventListener('click', function () {
                var isOpen = item.classList.contains('active');

                // Close all other items (accordion behavior)
                faqItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        var otherAns = otherItem.querySelector('.faq-item__answer');
                        var otherBtn = otherItem.querySelector('.faq-item__question');
                        if (otherAns) otherAns.style.maxHeight = null;
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current
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

    // ── 8. Dark Mode / Light Mode Toggle ────────────────────────────
    function updateThemeIcon(isDark) {
        if (!themeIcon) return;
        themeIcon.classList.toggle('fa-sun', isDark);
        themeIcon.classList.toggle('fa-moon', !isDark);
    }

    if (colorToggle) {
        colorToggle.addEventListener('click', function () {
            var isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });

        // Restore saved preference or OS preference
        var savedTheme = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            updateThemeIcon(true);
        } else {
            updateThemeIcon(false);
        }
    }

    // ── 9. Privacy Modal ────────────────────────────────────────────
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (openPrivacyBtn && privacyModal) {
        openPrivacyBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(privacyModal);
        });
    }

    if (closePrivacyBtn && privacyModal) {
        closePrivacyBtn.addEventListener('click', function () {
            closeModal(privacyModal);
        });
    }

    // Close modals on backdrop click
    document.querySelectorAll('.custom-alert').forEach(function (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target.classList.contains('custom-alert__backdrop')) {
                closeModal(modal);
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.custom-alert.active').forEach(function (modal) {
                closeModal(modal);
            });
            // Also close mobile nav
            if (headerNav && headerNav.classList.contains('active')) {
                closeMobileNav();
            }
        }
    });

    // ── 10. Smooth Scroll for Internal Anchors ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#' || href.includes('modal')) return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                closeMobileNav();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── 11. Track WhatsApp Clicks (Analytics-ready) ─────────────────
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
        link.addEventListener('click', function () {
            trackEvent('whatsapp_click', { source: link.closest('section') ? link.closest('section').id : 'unknown' });
        });
    });

    // ── 12. Track Verification Clicks ───────────────────────────────
    document.querySelectorAll('.verification-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            trackEvent('verification_click');
        });
    });

}); // end DOMContentLoaded
