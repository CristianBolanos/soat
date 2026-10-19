# Checklist de QA en dispositivos reales (F9.2)

Abre la **vista previa** (`https://astro-migration.soat-ya.pages.dev`) en cada dispositivo y marca cada punto. Si algo falla, anota el dispositivo, el navegador y qué pasó (una captura ayuda mucho).

## Dispositivos y navegadores

| Dispositivo             | Navegador                    | Hecho |
| ----------------------- | ---------------------------- | ----- |
| Android                 | Chrome                       | [ ]   |
| Android (si es Samsung) | Samsung Internet             | [ ]   |
| iPhone                  | Safari                       | [ ]   |
| Computador              | Chrome o Edge                | [ ]   |
| Computador o Android    | Brave (con Shields activado) | [ ]   |
| Computador o Android    | Opera                        | [ ]   |

## En cada uno

**Primera pantalla (sin bajar):**

- [ ] Se ven el título, «Moto / Carro», la placa amarilla y el botón «Cotizar por WhatsApp».
- [ ] Nada se ve cortado ni encimado, y no hay scroll hacia los lados.

**Cotizador:**

- [ ] Al escribir `abc12d` se convierte en `ABC12D` y se marca **Moto** sola.
- [ ] Al pulsar «Cotizar por WhatsApp» con la placa vacía aparece «Escribe la placa de tu vehículo.».
- [ ] Con una placa válida, **se abre WhatsApp** con el mensaje: «Hola, quiero el SOAT de mi moto de placa ABC12D. ¿Me ayudas con el valor? [web]». **No lo envíes.**
- [ ] En el teclado del celular, la tecla Enter dice «Enviar» o «Ir».

**Resto de la página:**

- [ ] «Consultar el valor de mi carro» marca **Carro** y lleva al campo de la placa.
- [ ] Al bajar aparece la barra fija con «Cotizar por WhatsApp» y «Llamar» (solo en el celular).
- [ ] «Llamar» abre el marcador con el número 316 734 1074.
- [ ] Las preguntas frecuentes se abren y se cierran.
- [ ] «Verificar mi SOAT en el RUNT» abre el portal del RUNT en otra pestaña.
- [ ] El botón de luna/sol cambia el tema, y al recargar se mantiene el tema elegido.
- [ ] En el pie, «Política de tratamiento de datos» y «Términos del servicio» abren sus páginas.
- [ ] Una dirección inexistente (por ejemplo, `/prueba`) muestra «Esta página no existe».

**Compartir:**

- [ ] Al enviar el enlace por WhatsApp a ti mismo, se ve la tarjeta con la imagen de SOAT YA (en la vista previa puede tardar o no aparecer; se confirma en producción).

## Resultado

- Fecha:
- Problemas encontrados:
