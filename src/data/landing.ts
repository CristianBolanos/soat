/**
 * Contenido de las secciones de la landing (docs/copy.md, aprobado en G1).
 * Separado de la presentación: los componentes solo lo pintan.
 */
import { paymentNotice } from '@/data/payment';

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

/** Franja de confianza (#beneficios). */
export const trustItems: Feature[] = [
  {
    icon: 'badge-check',
    title: 'Valor claro antes de pagar',
    text: 'Te confirmamos el valor exacto de tu SOAT antes de cualquier pago.',
  },
  {
    icon: 'shield-check',
    title: 'Póliza verificable',
    text: 'Tu SOAT queda registrado en el RUNT y lo consultas con tu placa.',
  },
  {
    icon: 'message-circle',
    title: 'Asesor real',
    text: 'Te atiende una persona por WhatsApp, todos los días de 7 a. m. a 10 p. m.',
  },
];

/** ¿Cuánto cuesta? (#tarifas): de qué depende el valor, sin precios (D5). */
export const priceSection = {
  title: '¿Cuánto cuesta el SOAT de tu moto o carro?',
  intro:
    'El valor cambia cada año y depende de tu vehículo. Por eso no te mostramos una tabla genérica: te confirmamos el valor exacto para tu placa antes de que pagues.',
  factors: [
    {
      icon: 'car-front',
      title: 'Tipo de vehículo',
      text: 'Moto, carro familiar, camioneta o campero.',
    },
    {
      icon: 'gauge',
      title: 'Cilindraje',
      text: 'Los c.c. que aparecen en la licencia de tránsito.',
    },
    {
      icon: 'calendar',
      title: 'Modelo',
      text: 'En carros y camionetas también cuenta la antigüedad.',
    },
  ] satisfies Feature[],
};

/** Así de fácil (#como-funciona). */
export const steps: Feature[] = [
  {
    icon: 'send',
    title: 'Envía tu placa',
    text: 'Elige moto o carro, escribe la placa y abre WhatsApp.',
  },
  {
    icon: 'message-circle-check',
    title: 'Confirma y paga',
    text: 'Un asesor revisa los datos de tu vehículo y te confirma el valor y las opciones de pago.',
  },
  {
    icon: 'file-check',
    title: 'Recibe tu póliza',
    text: 'Te llega la póliza electrónica en PDF. Verifícala en el RUNT con tu placa.',
  },
];

/** Compra segura (#verificacion / #antifraude). */
export const safetyTips: Feature[] = [
  {
    icon: 'badge-alert',
    title: 'Desconfía de lo demasiado barato',
    text: 'Las ofertas que parecen demasiado buenas son la trampa más común del SOAT falso.',
  },
  {
    icon: 'shield-user',
    title: 'Verifica quién te cobra',
    text: `${paymentNotice}. Si te escriben desde otro número, no pagues.`,
  },
  {
    icon: 'search-check',
    title: 'Verifica en el RUNT',
    text: 'Toda póliza válida queda registrada en el RUNT. Consúltala con tu placa después de comprar.',
  },
];
