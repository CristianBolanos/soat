/**
 * Preguntas frecuentes (docs/copy.md). Fuente única: alimenta la sección #faq
 * y el JSON-LD FAQPage, así nunca se desincronizan (hallazgo M7).
 * Sin precios (D5) ni nombres de aseguradoras (R44).
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: '¿Cuánto cuesta el SOAT de mi moto o carro?',
    answer:
      'Depende del tipo de vehículo, el cilindraje y, en carros y camionetas, la antigüedad. Además, el valor cambia cada año. Escríbenos tu placa por WhatsApp y te confirmamos el valor exacto antes de que pagues.',
  },
  {
    question: '¿Qué necesito para comprar el SOAT?',
    answer:
      'Solo la placa para cotizar. Para expedir la póliza, el asesor te pide por WhatsApp los datos del propietario tal como aparecen en la licencia de tránsito.',
  },
  {
    question: '¿Cómo sé que mi SOAT no es falso?',
    answer:
      'Toda póliza válida queda registrada en el RUNT. Después de comprar, consulta tu placa en el portal del RUNT. Si no aparece, no circules y comunícate con nosotros.',
  },
  {
    question: '¿Qué pasa si manejo con el SOAT vencido?',
    answer:
      'Te expones a una multa y a la inmovilización del vehículo, y quedas sin la protección que da el SOAT si ocurre un accidente.',
  },
  {
    question: '¿Puedo comprar el SOAT si ya está vencido?',
    answer:
      'Sí. Escríbenos y lo gestionamos de inmediato. Mientras no tengas un SOAT vigente, no deberías circular.',
  },
  {
    question: '¿Cómo recibo mi póliza? ¿Tengo que imprimirla?',
    answer:
      'Te llega la póliza electrónica en PDF por WhatsApp y puedes guardarla en tu celular. Las autoridades de tránsito verifican el SOAT en el RUNT con tu placa.',
  },
  {
    question: '¿Cómo puedo pagar?',
    answer:
      'Te indicamos los canales oficiales de pago disponibles. Nunca te pediremos transferir a cuentas de personas.',
  },
  {
    question: '¿Cobran algo adicional por la asesoría?',
    answer: 'No. Te confirmamos el valor total antes de que pagues.',
  },
];
