# Copy deck SOAT YA (F1.3)

Estos son todos los textos del sitio. Se aprueban en la compuerta **G1** antes de diseñar.

- **Reglas:** se tutea, las frases son cortas, no se nombran aseguradoras (R44), **no se publican precios** (decisión D5) y no se promete nada que no se pueda verificar.
- **`[Confirmar]`** marca una frase que depende de un dato del cliente (`docs/insumos-cliente.md`). Si el dato no llega, se usa la alternativa indicada.
- **`{año}`** se calcula solo al compilar el sitio (año actual en Colombia); no se escribe a mano.

---

## Metadatos

- **Title:** Compra tu SOAT {año} para moto o carro | SOAT YA
- **Description:** Cotiza y compra tu SOAT {año} para moto o carro por WhatsApp. Te confirmamos el valor antes de pagar y tu póliza es verificable en el RUNT.
- **OG/X:** el mismo título y la misma descripción. **Alt de la imagen OG:** «SOAT YA: cotiza tu SOAT de moto o carro por WhatsApp».

## Header

- **Logo:** SOAT YA (enlace a `#hero`, `aria-label`: «SOAT YA, ir al inicio»)
- **Anclas (solo en escritorio):** ¿Cuánto cuesta? · Cómo funciona · Preguntas
- **Botón de llamada:** ícono de teléfono, con `aria-label` «Llamar al (+57) 316 734 1074»
- **Selector de tema:** `aria-label` «Activar tema oscuro» o «Activar tema claro», según el tema actual

## Hero (`#hero`)

- **Antetítulo:** SOAT {año} · Moto y carro
- **H1 (opción A, recomendada):** Tu SOAT {año} para moto o carro, listo hoy por WhatsApp `[Confirmar que la expedición es el mismo día]`
- **H1 (opción B, sin promesa de tiempo):** Tu SOAT {año} para moto o carro, por WhatsApp y sin filas
- **Subtítulo:** Te confirmamos el valor exacto antes de pagar, te acompaña un asesor real y recibes tu póliza electrónica, verificable en el RUNT.

### Cotizador (`#cotizador-pasos`)

- **Título del bloque (`legend`):** ¿Qué vehículo vas a asegurar?
- **Opciones:** Moto · Carro
- **Etiqueta:** Placa del vehículo
- **Placeholder:** ABC123 (carro) o ABC12D (moto)
- **Ayuda según el tipo:**
  - Moto: «3 letras, 2 números y 1 letra. Ejemplo: ABC12D.»
  - Carro: «3 letras y 3 números. Ejemplo: ABC123.»
- **CTA principal:** Cotizar por WhatsApp
- **Aviso de datos (bajo el botón):** Al continuar se abrirá WhatsApp con tu placa para que un asesor te responda. [Consulta cómo tratamos tus datos](/politica-de-datos).
- **Enlace secundario:** ¿Taxi, camión, bus u otro vehículo? Escríbenos por WhatsApp
- **Microcopy de confianza:** Valor confirmado antes de pagar · Verificable en el RUNT · L–D, 7 a. m.–10 p. m.
- **Errores** (en línea, anunciados a lectores de pantalla):
  - Sin tipo elegido: «Elige si es moto o carro.»
  - Placa vacía: «Escribe la placa de tu vehículo.»
  - Placa con formato poco común (aviso, no bloquea): «Revisa la placa: normalmente es ABC123 (carro) o ABC12D (moto). Si está bien, pulsa de nuevo “Cotizar por WhatsApp”.»
- **Alt de la imagen principal:** depende de la foto elegida en F3.6. Ejemplo: «Conductor revisando su SOAT en el celular junto a su moto».

## Franja de confianza (`#beneficios`)

1. **Valor claro antes de pagar:** Te confirmamos el valor exacto de tu SOAT antes de cualquier pago.
2. **Póliza verificable:** Tu SOAT queda registrado en el RUNT y lo consultas con tu placa.
3. **Asesor real:** Te atiende una persona por WhatsApp, todos los días de 7 a. m. a 10 p. m. `[Confirmar horario]`

## ¿Cuánto cuesta? (`#tarifas`; se conserva el ancla del sitio anterior)

- **H2:** ¿Cuánto cuesta el SOAT de tu moto o carro?
- **Introducción:** El valor cambia cada año y depende de tu vehículo. Por eso no te mostramos una tabla genérica: te confirmamos el valor exacto para tu placa antes de que pagues.
- **Tres factores** (tarjetas):
  1. **Tipo de vehículo:** moto, carro familiar, camioneta o campero.
  2. **Cilindraje:** los c.c. que aparecen en la licencia de tránsito.
  3. **Modelo:** en carros y camionetas también cuenta la antigüedad.
- **Botones:** Consultar el valor de mi moto · Consultar el valor de mi carro. Cada uno preselecciona el tipo y lleva al cotizador.
- **Enlace:** ¿Ciclomotor, motocarro u otro vehículo? Escríbenos

## Así de fácil (`#como-funciona`)

- **H2:** Así de fácil: tu SOAT en 3 pasos

1. **Envía tu placa.** Elige moto o carro, escribe la placa y abre WhatsApp.
2. **Confirma y paga.** Un asesor revisa los datos de tu vehículo, y te confirma el valor y las opciones de pago.
3. **Recibe tu póliza.** Te llega la póliza electrónica en PDF. Verifícala en el RUNT con tu placa.

- **CTA:** Empezar ahora (lleva al cotizador)

## Compra segura (`#verificacion`, que contiene `#antifraude`)

- **H2:** Compra segura: evita el SOAT falso
- **Introducción:** Cada año aparecen ofertas de SOAT falso. Con estos tres consejos compras con tranquilidad.

1. **Desconfía de lo demasiado barato.** Las ofertas que parecen demasiado buenas son la trampa más común del SOAT falso.
2. **Verifica quién te cobra.** Solo te damos los datos de pago desde nuestro número (+57) 316 734 1074, por WhatsApp o llamada. Si te escriben desde otro número, no pagues. (Medios de pago confirmados por el cliente, D7.)
3. **Verifica en el RUNT.** Toda póliza válida queda registrada en el RUNT. Consúltala con tu placa después de comprar.

- **Botón:** Verificar mi SOAT en el RUNT (abre runt.gov.co en otra pestaña; texto para lectores de pantalla: «se abre en una pestaña nueva»)

## Preguntas frecuentes (`#faq`)

- **H2:** Preguntas frecuentes sobre el SOAT

1. **¿Cuánto cuesta el SOAT de mi moto o carro?**
   Depende del tipo de vehículo, el cilindraje y, en carros y camionetas, la antigüedad. Además, el valor cambia cada año. Escríbenos tu placa por WhatsApp y te confirmamos el valor exacto antes de que pagues.
2. **¿Qué necesito para comprar el SOAT?**
   Solo la placa para cotizar. Para expedir la póliza, el asesor te pide por WhatsApp los datos del propietario tal como aparecen en la licencia de tránsito y un correo para enviártela.
3. **¿Cómo sé que mi SOAT no es falso?**
   Toda póliza válida queda registrada en el RUNT. Después de comprar, consulta tu placa en el portal del RUNT. Si no aparece, no circules y comunícate con nosotros.
4. **¿Qué pasa si manejo con el SOAT vencido?**
   Te expones a una multa y a la inmovilización del vehículo, y quedas sin la protección que da el SOAT si ocurre un accidente.
5. **¿Puedo comprar el SOAT si ya está vencido?**
   Sí. Escríbenos y lo gestionamos de inmediato. Mientras no tengas un SOAT vigente, no deberías circular.
6. **¿Cómo recibo mi póliza? ¿Tengo que imprimirla?**
   Te llega la póliza electrónica en PDF a tu correo y también te la enviamos por WhatsApp, para que la guardes en tu celular. Las autoridades de tránsito verifican el SOAT en el RUNT con tu placa.
7. **¿Cómo puedo pagar?** `[Confirmar]`
   Puedes pagar por transferencia, con link de pago o en efectivo en persona. El asesor te confirma las opciones antes de que pagues. Solo te damos los datos de pago desde nuestro número (+57) 316 734 1074, por WhatsApp o llamada: si te los envían desde otro número, no pagues y avísanos.
8. **¿Cobran algo adicional por la asesoría?** `[Confirmar con el cliente; si cobra, se ajusta o se elimina esta pregunta]`
   No. Te confirmamos el valor total antes de que pagues.

## CTA final

- **H2:** ¿Tu SOAT vence pronto? Déjalo listo hoy.
- **Texto:** Escríbenos por WhatsApp: te confirmamos el valor y te acompañamos en la compra.
- **Botones:** Cotizar por WhatsApp · Llamar al (+57) 316 734 1074

## Pie de página

- **Marca:** SOAT YA. Cotización y compra asistida del SOAT para moto y carro en Colombia.
- **Aviso legal:** SOAT YA es punto aliado de una red autorizada para la venta del SOAT. Las pólizas las expiden aseguradoras vigiladas por la Superintendencia Financiera de Colombia. `[Si el cliente autoriza: nombre de la red]`
- **Contacto:** WhatsApp (+57) 316 734 1074 · Teléfono (+57) 316 734 1074 · ventasypublicidad7@gmail.com · Lunes a domingo, 7:00 a. m. a 10:00 p. m.
- **Enlaces:** Política de tratamiento de datos · Términos del servicio · Verificar SOAT en el RUNT
- **Línea final:** © {año} SOAT YA · Sitio desarrollado por Cristian Bolaños

## Barra fija móvil

- WhatsApp · Llamar

## Mensajes de WhatsApp (pre-llenados)

| Origen                          | Mensaje                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| Cotizador                       | Hola, quiero el SOAT de mi {moto/carro} de placa {PLACA}. ¿Me ayudas con el valor? [web] |
| Header, barra móvil y CTA final | Hola, quiero cotizar mi SOAT. [web]                                                      |
| «Otro vehículo»                 | Hola, quiero cotizar el SOAT de otro tipo de vehículo (taxi, camión, bus u otro). [web]  |
| Sin JavaScript (respaldo)       | Hola, quiero cotizar mi SOAT. [web]                                                      |

La etiqueta de origen cambia a **[ads]** si la visita llega con `gclid`, `fbclid` o `utm_medium=cpc`. Así el asesor sabe de dónde viene cada chat sin que se envíe ningún dato personal a la analítica.

## Página 404

- **H1:** Esta página no existe
- **Texto:** Puede que el enlace esté mal escrito o que la página ya no exista.
- **Botones:** Ir al inicio · Cotizar por WhatsApp

## Páginas legales (estructura; el texto final requiere los datos del cliente)

- **Política de tratamiento de datos** (Ley 1581 de 2012 y Decreto 1377 de 2013): responsable (nombre, identificación, domicilio, correo y teléfono); qué datos se tratan (placa, nombre y documento del propietario, número de WhatsApp y datos de navegación); finalidades (cotizar y gestionar la compra del SOAT, contactar al titular, cumplir obligaciones legales y medir el uso del sitio con analítica sin datos personales); que los datos se reciben por WhatsApp (un servicio de Meta); derechos del titular (conocer, actualizar, rectificar, suprimir y revocar) y cómo ejercerlos; plazos de respuesta (10 días hábiles para consultas y 15 para reclamos); vigencia y fecha de publicación.
- **Términos del servicio:** qué es SOAT YA (asesoría y gestión de compra como punto aliado); que la póliza la expide una aseguradora autorizada; que el valor se confirma antes del pago según los datos del vehículo; obligaciones del usuario (datos veraces); medios de contacto; ley aplicable (Colombia).
