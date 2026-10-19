/**
 * Pagos y entrega de la póliza, confirmados por el vendedor el 2026-10-18 (decisión D7).
 * Fuente única para las preguntas frecuentes, «Compra segura» y los términos.
 * Por decisión del vendedor, su nombre no aparece en los textos de pago: la señal
 * antifraude es el número oficial, el único desde el que se envían los datos de pago.
 */
import { site } from '@/config/site';

/** Medios de pago que acepta el vendedor. */
export const paymentMethods = 'por transferencia, con link de pago o en efectivo en persona';

/** Aviso antifraude: los datos de pago solo salen del número oficial. */
export const paymentNotice = `Solo te damos los datos de pago desde nuestro número ${site.contact.phoneDisplay}, por WhatsApp o llamada`;
