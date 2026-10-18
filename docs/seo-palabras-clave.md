# Mapa de palabras clave (F1.2)

**Criterio:** una intención principal por sección, sin que dos secciones compitan por la misma búsqueda. Las palabras se integran de forma natural en el copy (`docs/copy.md`) y nunca se repiten de manera forzada. **No se publican precios** (decisión D5): las búsquedas de precio se atienden explicando de qué depende el valor y llevando al cotizador.

## Página principal `/`

- **Intención principal (transaccional):** comprar o cotizar el SOAT de moto o carro.
- **Title** (47 caracteres): `Compra tu SOAT {año} para moto o carro | SOAT YA`
- **Meta description** (138 caracteres): `Cotiza y compra tu SOAT {año} para moto o carro por WhatsApp. Te confirmamos el valor antes de pagar y tu póliza es verificable en el RUNT.`
- **H1:** `Tu SOAT {año} para moto o carro, listo hoy por WhatsApp` (`{año}` se calcula al compilar)

| Sección                                        | Palabra clave principal   | Secundarias                                                                        | Dónde aparece                                |
| ---------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| Hero / cotizador (`#hero`, `#cotizador-pasos`) | comprar SOAT              | SOAT moto, SOAT carro, cotizar SOAT, SOAT por WhatsApp                             | H1, subtítulo y CTA                          |
| ¿Cuánto cuesta? (`#tarifas`)                   | cuánto cuesta el SOAT     | valor del SOAT de moto, valor del SOAT de carro, de qué depende el precio del SOAT | H2, factores y botones                       |
| Cómo funciona (`#como-funciona`)               | comprar SOAT por WhatsApp | SOAT en línea, SOAT sin filas                                                      | H2 y pasos                                   |
| Compra segura (`#verificacion`, `#antifraude`) | verificar SOAT en el RUNT | SOAT falso, consultar SOAT por placa                                               | H2, consejos y botón                         |
| Preguntas (`#faq`)                             | preguntas sobre el SOAT   | SOAT vencido, qué necesito para comprar el SOAT, póliza electrónica                | Preguntas en `<summary>` y JSON-LD `FAQPage` |

## Páginas secundarias

| URL                  | Title                                       | Indexar        | Nota            |
| -------------------- | ------------------------------------------- | -------------- | --------------- |
| `/politica-de-datos` | Política de tratamiento de datos \| SOAT YA | Sí             | Requisito legal |
| `/terminos`          | Términos del servicio \| SOAT YA            | Sí             | —               |
| `/404`               | Página no encontrada \| SOAT YA             | No (`noindex`) | —               |

## Fase 2 [Opcional]

Si se quiere ganar búsquedas informativas: `/soat-moto`, `/soat-carro`, `/consultar-soat-runt` y `/soat-vencido`, cada una con contenido propio, **sin cifras de precio**, y con CTA a WhatsApp.

## Datos estructurados (resumen)

- `Organization`: nombre, `url`, `logo`, `contactPoint` (teléfono, `contactType: customer service`, `areaServed: CO`, `availableLanguage: es`) y horario. `sameAs` solo cuando el cliente confirme Facebook.
- `WebSite` y `WebPage` (`inLanguage: es-CO`).
- `FAQPage`: se genera del mismo `src/data/faq.ts` que la interfaz.
- `InsuranceAgency` con dirección: solo si se confirma un local físico.
- No se usa `Offer` ni `price` (decisión D5).
