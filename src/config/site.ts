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
   * Responsable del tratamiento de datos (Ley 1581 de 2012): quien vende como punto
   * aliado y recibe los datos por WhatsApp (decisión D6). El Decreto 1377 de 2013
   * (art. 13) exige nombre, domicilio, dirección, correo y teléfono; no exige cédula ni NIT.
   * Mientras un dato esté en null, la política se muestra sin él y `pnpm test:release`
   * impide publicar.
   */
  legal: {
    /** Nombre completo de la persona (o razón social). */
    responsibleName: 'Cristian Bolaños' as string | null,
    /** Domicilio: ciudad y departamento. */
    city: 'Cali, Valle del Cauca' as string | null,
    /** Dirección para notificaciones (comercial o de correspondencia). */
    address: 'La Buitrera, Cali' as string | null,
    requestsEmail: 'ventasypublicidad7@gmail.com',
    /** Fecha de entrada en vigencia de la política (AAAA-MM-DD); se fija al publicar. */
    policyDate: null as string | null,
    /** Plataforma de recaudo y expedición con la que se emite la póliza (se informa en la política). */
    issuingPlatform: 'Refácil',
  },
} as const;

export type Site = typeof site;
