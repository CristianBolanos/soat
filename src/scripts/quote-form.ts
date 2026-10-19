/**
 * Cotizador (F5.2): valida sin frenar, deduce moto/carro por la placa, arma el
 * mensaje y abre WhatsApp. Sin este script el formulario igual funciona (va a
 * wa.me con un mensaje genérico).
 */
import { PLATE_HINTS, PLATE_PLACEHOLDERS, QUOTE_ERRORS } from '@/data/quote-messages';
import { track, trackThenNavigate } from '@/lib/analytics';
import {
  inferVehicle,
  isVehicleType,
  normalizePlate,
  validateQuote,
  type QuoteError,
  type VehicleType,
} from '@/lib/quote-validation';
import { originFromSearch, quoteMessage, whatsappUrl, withOrigin } from '@/lib/whatsapp';

interface Elements {
  form: HTMLFormElement;
  plate: HTMLInputElement;
  plateHint: HTMLElement;
  plateError: HTMLElement;
  vehicleError: HTMLElement;
  radios: HTMLInputElement[];
  number: string;
}

interface State {
  userChoseVehicle: boolean;
  acceptUnusual: boolean;
  started: boolean;
}

function findElements(form: HTMLFormElement): Elements | null {
  const plate = form.querySelector<HTMLInputElement>('[data-plate-input]');
  const plateHint = form.querySelector<HTMLElement>('[data-plate-hint]');
  const plateError = form.querySelector<HTMLElement>('[data-plate-error]');
  const vehicleError = form.querySelector<HTMLElement>('[data-vehicle-error]');
  const radios = [...form.querySelectorAll<HTMLInputElement>('[data-vehicle-option]')];
  const number = form.dataset['whatsapp'] ?? '';
  if (!plate || !plateHint || !plateError || !vehicleError || radios.length === 0 || !number) {
    return null;
  }
  return { form, plate, plateHint, plateError, vehicleError, radios, number };
}

function selectedVehicle(els: Elements): VehicleType | null {
  const value = els.radios.find((radio) => radio.checked)?.value;
  return isVehicleType(value) ? value : null;
}

function updateHint(els: Elements, vehicle: VehicleType | null): void {
  els.plateHint.textContent = PLATE_HINTS[vehicle ?? 'none'];
  els.plate.placeholder = PLATE_PLACEHOLDERS[vehicle ?? 'none'];
}

function setVehicle(els: Elements, vehicle: VehicleType): void {
  for (const radio of els.radios) radio.checked = radio.value === vehicle;
  updateHint(els, vehicle);
}

function clearErrors(els: Elements): void {
  for (const element of [els.plateError, els.vehicleError]) {
    element.textContent = '';
    element.hidden = true;
  }
  els.plate.removeAttribute('aria-invalid');
}

function showError(els: Elements, error: QuoteError): void {
  clearErrors(els);
  const isVehicle = error === 'vehicle';
  const target = isVehicle ? els.vehicleError : els.plateError;
  target.textContent = QUOTE_ERRORS[error];
  target.hidden = false;
  if (isVehicle) {
    els.radios[0]?.focus();
  } else {
    els.plate.setAttribute('aria-invalid', 'true');
    els.plate.focus();
  }
}

function submitQuote(els: Elements, state: State): void {
  const result = validateQuote({
    vehicle: selectedVehicle(els),
    rawPlate: els.plate.value,
    acceptUnusual: state.acceptUnusual,
  });
  if (!result.ok) {
    if (result.error === 'plate-unusual') state.acceptUnusual = true;
    showError(els, result.error);
    return;
  }
  const origin = originFromSearch(window.location.search);
  const url = whatsappUrl(
    els.number,
    withOrigin(quoteMessage(result.vehicle, result.plate), origin),
  );
  trackThenNavigate('generate_lead', { tipo: result.vehicle, origen: origin }, url);
}

function onPlateInput(els: Elements, state: State): void {
  const normalized = normalizePlate(els.plate.value);
  if (normalized !== els.plate.value) els.plate.value = normalized;
  state.acceptUnusual = false;
  clearErrors(els);
  const inferred = inferVehicle(normalized);
  // Si el visitante no eligió tipo, lo marcamos por él según el formato de la placa.
  if (!state.userChoseVehicle && inferred) setVehicle(els, inferred);
}

/** Clic o toque real (los clics que genera el teclado tienen pointerType vacío). */
function isPointerActivation(event: Event): boolean {
  const { pointerType } = event as PointerEvent;
  if (typeof pointerType === 'string') return pointerType !== '';
  return (event as MouseEvent).detail > 0;
}

function onVehicleChange(els: Elements, state: State, event: Event): void {
  state.userChoseVehicle = true;
  const vehicle = selectedVehicle(els);
  updateHint(els, vehicle);
  clearErrors(els);
  if (vehicle) track('vehicle_select', { tipo: vehicle });
  // Con clic o toque (no con flechas del teclado) pasamos directo a la placa.
  if (isPointerActivation(event) && !els.plate.value) els.plate.focus();
}

/** Botones «Consultar el valor de mi moto/carro»: preseleccionan el tipo y llevan a la placa. */
function bindPreselect(els: Elements, state: State): void {
  document.addEventListener('click', (event) => {
    const trigger =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-preselect]')
        : null;
    const vehicle = trigger?.dataset['preselect'];
    if (!isVehicleType(vehicle)) return;
    setVehicle(els, vehicle);
    state.userChoseVehicle = true;
    track('cta_click', { ubicacion: 'cuanto_cuesta', tipo: vehicle });
    window.setTimeout(() => els.plate.focus({ preventScroll: true }), 450);
  });
}

function initQuoteForm(form: HTMLFormElement): void {
  const els = findElements(form);
  if (!els) return;
  const state: State = { userChoseVehicle: false, acceptUnusual: false, started: false };
  const markStart = () => {
    if (state.started) return;
    state.started = true;
    track('quote_start');
  };
  form.addEventListener('focusin', markStart);
  form.addEventListener('pointerdown', markStart);
  els.plate.addEventListener('input', () => onPlateInput(els, state));
  for (const radio of els.radios) {
    radio.addEventListener('click', (event) => onVehicleChange(els, state, event));
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuote(els, state);
  });
  bindPreselect(els, state);
}

for (const form of document.querySelectorAll<HTMLFormElement>('[data-quote-form]')) {
  initQuoteForm(form);
}
