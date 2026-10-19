/**
 * Contenido de las secciones de la landing.
 * Separado de la presentación: los componentes solo lo pintan.
 */
import { site } from '@/config/site';
import { paymentMethods, paymentNotice } from '@/data/payment';
import { quoteMessage } from '@/lib/whatsapp';

export interface Point {
  title: string;
  text: string;
}

/** Placas de ejemplo: las mismas en la ayuda del cotizador, la licencia y el chat. */
export const examplePlates = { carro: 'ABC123', moto: 'ABC12D' } as const;

/** ¿Cuánto cuesta? (#tarifas): de qué depende el valor, sin precios (D5). */
export const priceSection = {
  title: '¿Cuánto cuesta el SOAT de tu moto o carro?',
  intro:
    'El valor cambia cada año y depende de 3 datos de tu licencia de tránsito. Por eso no te mostramos una tabla genérica: con tu placa te confirmamos el valor exacto antes de que pagues.',
  factors: [
    { title: 'Clase de vehículo', text: 'Moto, carro familiar, camioneta o campero.' },
    { title: 'Cilindraje', text: 'Los c.c. del motor.' },
    { title: 'Modelo', text: 'En carros y camionetas también cuenta la antigüedad.' },
  ] satisfies Point[],
};

export interface LicenseField {
  label: string;
  /** Sin valor se dibuja una barra gris (dato que no importa para el precio). */
  value?: string;
  /** Número del dato en la lista de `priceSection.factors`. */
  mark?: 1 | 2 | 3;
  /** Ocupa las dos columnas de la tarjeta. */
  wide?: boolean;
}

/** Licencia de tránsito de ejemplo (dibujo simplificado, no es una réplica del documento). */
export const licenseExample = {
  title: 'Licencia de tránsito',
  caption: 'Licencia de tránsito de ejemplo. Los datos marcados definen el valor.',
  fields: [
    { label: 'Placa', value: examplePlates.moto },
    { label: 'Marca' },
    { label: 'Clase de vehículo', value: 'Motocicleta', mark: 1, wide: true },
    { label: 'Cilindrada c.c.', value: '125', mark: 2 },
    { label: 'Modelo', value: '2019', mark: 3 },
    { label: 'Servicio', value: 'Particular' },
    { label: 'Propietario' },
  ] satisfies LicenseField[],
};

export interface ChatStep {
  title: string;
  from: 'cliente' | 'asesor';
  message: string;
  /** Nombre del adjunto (la póliza en PDF). */
  file?: string;
}

/** Así compras tu SOAT por WhatsApp (#como-funciona): los 3 pasos contados como el chat real. */
export const stepsSection = {
  title: 'Así compras tu SOAT por WhatsApp',
  // La frase del horario termina en «p. m.»: ese punto cierra la oración (sin «p. m..»).
  intro: `Te atiende una persona de principio a fin, ${site.hours.phrase}`,
};

export const steps: ChatStep[] = [
  {
    title: 'Envía tu placa',
    from: 'cliente',
    // El mismo mensaje que arma el cotizador (sin la etiqueta de origen).
    message: quoteMessage('moto', examplePlates.moto),
  },
  {
    title: 'Confirma y paga',
    from: 'asesor',
    message: `¡Hola! Ya revisé los datos de tu moto. Te envío el valor exacto y las opciones de pago: puedes pagar ${paymentMethods}.`,
  },
  {
    title: 'Recibe tu póliza',
    from: 'asesor',
    file: `SOAT-${examplePlates.moto}.pdf`,
    message: 'Lista tu póliza. También te llega al correo. Verifícala en el RUNT con tu placa.',
  },
];

/** Cómo evitar un SOAT falso (#verificacion / #antifraude). */
export const safetySection = {
  title: 'Cómo evitar un SOAT falso',
  intro: 'Cada año aparecen ofertas de SOAT falso. Antes de pagar, revisa estas tres cosas:',
};

export const safetyTips: Point[] = [
  {
    title: 'Desconfía de lo demasiado barato',
    text: 'Las ofertas que parecen demasiado buenas son la trampa más común del SOAT falso.',
  },
  {
    title: 'Verifica quién te cobra',
    text: `${paymentNotice}. Si te escriben desde otro número, no pagues.`,
  },
  {
    title: 'Consulta tu póliza en el RUNT',
    text: 'Toda póliza válida queda registrada en el RUNT. Consúltala con tu placa después de comprar.',
  },
];
