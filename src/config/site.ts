import { nbsp } from '@/lib/text';

/**
 * Fuente única de los datos del negocio (plan, tarea F4.1).
 * Cualquier cambio de contacto, horario, enlaces o datos legales se hace solo aquí.
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
    /** Con espacios no separables para que el número nunca se parta entre líneas. */
    phoneDisplay: nbsp('(+57) 316 734 1074'),
    email: 'ventasypublicidad7@gmail.com',
  },
  hours: {
    display: 'Lunes a domingo, 7:00 a. m. a 10:00 p. m.',
    short: 'L–D, 7 a. m.–10 p. m.',
    opens: '07:00',
    closes: '22:00',
  },
  links: {
    /** Consulta ciudadana del RUNT (el enlace del sitio anterior redirige aquí). */
    runt: 'https://portalpublico.runt.gov.co/#/consulta-vehiculo/consulta/consulta-ciudadana',
    developer: 'https://cristianbolanos.github.io/cb/',
  },
  social: {
    /** Pendiente de confirmar (docs/insumos-cliente.md): solo si el cliente confirma que la página es suya. */
    facebook: null as string | null,
  },
  /** Pendiente (decisión D4): nombre de la red aliada, solo con su permiso. */
  partnerNetwork: null as string | null,
  /**
   * Responsable del tratamiento de datos (Ley 1581 de 2012). Los valores
   * «[PENDIENTE…]» bloquean el lanzamiento: `pnpm test:release` falla mientras existan.
   */
  legal: {
    responsibleName: '[PENDIENTE: nombre o razón social]',
    responsibleId: '[PENDIENTE: cédula o NIT]',
    responsibleAddress: '[PENDIENTE: dirección y ciudad]',
    requestsEmail: 'ventasypublicidad7@gmail.com',
    policyDate: '[PENDIENTE: fecha de publicación]',
  },
} as const;

export type Site = typeof site;
