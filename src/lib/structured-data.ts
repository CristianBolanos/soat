/**
 * Constructores de JSON-LD (Schema.org). Se generan desde los mismos datos que la
 * interfaz (config/site.ts y data/faq.ts), así nunca se desincronizan.
 * Sin `Offer` ni precios (D5). `InsuranceAgency` solo si hay local físico (pendiente).
 */
import type { FaqItem } from '@/data/faq';

interface OrganizationInput {
  name: string;
  url: string;
  logoUrl: string;
  phone: string;
  email: string;
  opens: string;
  closes: string;
  sameAs?: readonly string[];
}

export function organizationSchema(input: OrganizationInput) {
  return {
    '@type': 'Organization',
    '@id': `${input.url}#organizacion`,
    name: input.name,
    url: input.url,
    logo: input.logoUrl,
    email: input.email,
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: input.phone,
      contactType: 'customer service',
      areaServed: 'CO',
      availableLanguage: 'es',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: input.opens,
        closes: input.closes,
      },
    },
  };
}

export function websiteSchema(name: string, url: string) {
  return { '@type': 'WebSite', '@id': `${url}#sitio`, name, url, inLanguage: 'es-CO' };
}

export function webPageSchema(input: {
  url: string;
  siteUrl: string;
  name: string;
  description: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${input.url}#pagina`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: 'es-CO',
    isPartOf: { '@id': `${input.siteUrl}#sitio` },
    about: { '@id': `${input.siteUrl}#organizacion` },
  };
}

export function faqSchema(items: readonly FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Documento `@graph` listo para <script type="application/ld+json">. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Serializa evitando que «</script>» dentro de un texto cierre la etiqueta. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
