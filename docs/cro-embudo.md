# Mapa de CTA y embudo de conversión (F1.4)

## Regla

Hay **una sola acción principal: cotizar por WhatsApp.** Cada pantalla tiene, como máximo, un CTA primario (amarillo) y uno secundario. El verde se reserva para los botones que abren WhatsApp directamente.

## Mapa de CTA

| Ubicación                                                | CTA primario                                                                                 | Secundario                             | Evento GA4                                                                                    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| Header (escritorio)                                      | —                                                                                            | Ícono «Llamar»                         | `phone_click {ubicacion: header}`                                                             |
| Hero / cotizador                                         | **Cotizar por WhatsApp** (envía el formulario)                                               | «¿Otro vehículo? Escríbenos»           | `quote_start`, `vehicle_select`, `generate_lead`, `whatsapp_click {ubicacion: otro_vehiculo}` |
| ¿Cuánto cuesta? (`#tarifas`)                             | «Consultar el valor de mi moto» o «de mi carro» (preselecciona el tipo y lleva al cotizador) | «¿Ciclomotor u otro? Escríbenos»       | `cta_click {ubicacion: cuanto_cuesta, tipo}`                                                  |
| Así de fácil                                             | «Empezar ahora» (lleva al cotizador)                                                         | —                                      | `cta_click {ubicacion: como_funciona}`                                                        |
| Compra segura                                            | «Verificar mi SOAT en el RUNT» (enlace externo)                                              | —                                      | `runt_click`                                                                                  |
| FAQ                                                      | — (contenido)                                                                                | —                                      | `faq_open {pregunta}`                                                                         |
| CTA final                                                | **Cotizar por WhatsApp**                                                                     | «Llamar»                               | `whatsapp_click {ubicacion: cta_final}`, `phone_click {ubicacion: cta_final}`                 |
| Barra fija móvil (se oculta con el cotizador a la vista) | **WhatsApp**                                                                                 | Llamar                                 | `whatsapp_click {ubicacion: barra_movil}`, `phone_click {ubicacion: barra_movil}`             |
| Pie                                                      | —                                                                                            | Enlaces de WhatsApp, teléfono y correo | `whatsapp_click {ubicacion: pie}`, `phone_click {ubicacion: pie}`                             |

## Embudo

| Etapa          | Qué pasa                                          | Cómo se mide                                                                  |
| -------------- | ------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1. Visita      | Llega a la página                                 | Visitas en Cloudflare Web Analytics (sin cookies)                             |
| 2. Interacción | Hace scroll, toca o elige un tipo                 | `quote_start` (primer foco o clic en el cotizador) y `vehicle_select`         |
| 3. Intención   | Pulsa «Cotizar por WhatsApp» con una placa válida | **`generate_lead`**, el evento clave                                          |
| 4. Chat        | Envía el mensaje en WhatsApp                      | En WhatsApp Business: etiqueta «Lead web» (el mensaje trae `[web]` o `[ads]`) |
| 5. Venta       | Paga y recibe la póliza                           | En WhatsApp Business: etiqueta «Vendido»                                      |

**KPI:**

- Tasa de intención: `generate_lead` dividido por las visitas.
- Tasa de cierre: ventas dividido por los chats `[web]`.
- Costo por lead por canal (cuando haya pauta).

## Hipótesis para pruebas A/B [Opcional, cuando haya tráfico]

1. **H1 con promesa de tiempo** («listo hoy») **frente a sin promesa.** Métrica: `generate_lead`.
2. **Texto del CTA:** «Cotizar por WhatsApp» frente a «Quiero mi SOAT».
3. **Orden de secciones:** «¿Cuánto cuesta?» antes de «Cómo funciona» frente a después.
4. **Cotizador con placa frente a botón directo a WhatsApp.**

Cada prueba debe correr al menos 2 semanas o 100 conversiones por variante, lo que tarde más.
