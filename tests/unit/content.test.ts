import { describe, expect, it } from 'vitest';
import { faq } from '../../src/data/faq';
import {
  examplePlates,
  licenseExample,
  priceSection,
  safetySection,
  safetyTips,
  steps,
  stepsSection,
} from '../../src/data/landing';
import {
  faqSchema,
  graph,
  serializeJsonLd,
  organizationSchema,
} from '../../src/lib/structured-data';
import { quoteMessage } from '../../src/lib/whatsapp';

const PRICE = /\$\s?\d|\bCOP\b|\d{3}\.\d{3}/;

describe('contenido de la landing', () => {
  const texts = [
    ...faq.flatMap((f) => [f.question, f.answer]),
    priceSection.title,
    priceSection.intro,
    ...priceSection.factors.flatMap((f) => [f.title, f.text]),
    licenseExample.caption,
    stepsSection.title,
    stepsSection.intro,
    ...steps.flatMap((s) => [s.title, s.message]),
    safetySection.title,
    safetySection.intro,
    ...safetyTips.flatMap((t) => [t.title, t.text]),
  ];

  it('no publica precios (D5)', () => {
    expect(texts.filter((t) => PRICE.test(t))).toEqual([]);
  });

  it('no deja puntos dobles al unir frases («p. m..»)', () => {
    expect(texts.filter((t) => /[^.]\.\.(?!\.)/.test(t))).toEqual([]);
  });

  it('cada sección tiene la cantidad acordada en el copy', () => {
    expect(priceSection.factors).toHaveLength(3);
    expect(steps).toHaveLength(3);
    expect(safetyTips).toHaveLength(3);
    expect(faq.length).toBeGreaterThanOrEqual(6);
    expect(faq.length).toBeLessThanOrEqual(8);
  });

  it('la licencia de ejemplo marca los datos 1, 2 y 3 en el orden de la lista', () => {
    const marks = licenseExample.fields.flatMap((f) => ('mark' in f ? [f.mark] : []));
    expect(marks).toEqual([1, 2, 3]);
  });

  it('el chat empieza con el mismo mensaje que arma el cotizador', () => {
    expect(steps[0]?.from).toBe('cliente');
    expect(steps[0]?.message).toBe(quoteMessage('moto', examplePlates.moto));
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
