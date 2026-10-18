/**
 * Fuente única de los datos del negocio (plan, tarea F4.1).
 * Cualquier cambio de contacto, horario o red aliada se hace solo aquí.
 */
export const site = {
  name: 'SOAT YA',
  locale: 'es-CO',
  /** Zona horaria del negocio: se usa para calcular el año que se muestra (T10). */
  timeZone: 'America/Bogota',
  contact: {
    /** Número en formato internacional, solo dígitos (lo exige wa.me). */
    whatsapp: '573167341074',
    /** Número para enlaces tel: (E.164). */
    phone: '+573167341074',
    phoneDisplay: '(+57) 316 734 1074',
    email: 'ventasypublicidad7@gmail.com',
  },
  hours: {
    display: 'Lunes a domingo, 7:00 a. m. a 10:00 p. m.',
    short: 'L–D, 7 a. m.–10 p. m.',
    opens: '07:00',
    closes: '22:00',
  },
  social: {
    /** Pendiente de confirmar (plan D.5): solo se publica si el cliente confirma que la página es suya. */
    facebook: null as string | null,
  },
  /** Pendiente (decisión D4): nombre de la red aliada, solo con su permiso. */
  partnerNetwork: null as string | null,
} as const;

export type Site = typeof site;
