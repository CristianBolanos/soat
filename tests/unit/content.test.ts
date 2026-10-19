import { describe, expect, it } from 'vitest';
import { faq } from '../../src/data/faq';
import { priceSection, safetyTips, steps, trustItems } from '../../src/data/landing';
import {
  faqSchema,
  graph,
  serializeJsonLd,
  organizationSchema,
} from '../../src/lib/structured-data';

const PRICE = /\$\s?\d|\bCOP\b|\d{3}\.\d{3}/;

describe('contenido de la landing', () => {
  const texts = [
    ...faq.flatMap((f) => [f.question, f.answer]),
    priceSection.title,
    priceSection.intro,
    ...[...trustItems, ...priceSection.factors, ...steps, ...safetyTips].flatMap((f) => [
      f.title,
      f.text,
    ]),
  ];

  it('no publica precios (D5)', () => {
    expect(texts.filter((t) => PRICE.test(t))).toEqual([]);
  });

  it('cada sección tiene la cantidad acordada en el copy', () => {
    expect(trustItems).toHaveLength(3);
    expect(priceSection.factors).toHaveLength(3);
    expect(steps).toHaveLength(3);
    expect(safetyTips).toHaveLength(3);
    expect(faq.length).toBeGreaterThanOrEqual(6);
    expect(faq.length).toBeLessThanOrEqual(8);
  });

  it('las preguntas del FAQ terminan en «?» y no se repiten', () => {
    expect(faq.every((f) => f.question.endsWith('?'))).toBe(true);
    expect(new Set(faq.map((f) => f.question)).size).toBe(faq.length);
  });
});

describe('lib/structured-data', () => {
  it('el FAQPage refleja exactamente el FAQ visible', () => {
    const schema = faqSchema(faq);
    expect(schema.mainEntity.map((q) => q.name)).toEqual(faq.map((f) => f.question));
    expect(schema.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(faq.map((f) => f.answer));
  });

  it('omite sameAs cuando no hay redes confirmadas', () => {
    const org = organizationSchema({
      name: 'SOAT YA',
      url: 'https://soat-ya.pages.dev/',
      logoUrl: 'https://soat-ya.pages.dev/icon-512.png',
      phone: '+573167341074',
      email: 'correo@ejemplo.com',
      opens: '07:00',
      closes: '22:00',
    });
    expect(org).not.toHaveProperty('sameAs');
    expect(org.contactPoint.areaServed).toBe('CO');
  });

  it('serializa sin permitir cerrar la etiqueta <script>', () => {
    const json = serializeJsonLd(graph({ name: '</script><script>alert(1)</script>' }));
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)['@graph'][0].name).toContain('</script>');
  });
});
