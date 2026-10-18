# Tarifas SOAT 2026: fuente y verificación (F0.4)

> **Referencia interna. No se publica en el sitio (decisión D5):** los precios cambian cada año y no todos los canales ofrecen el mismo valor. Este documento queda como apoyo para el asesor y como respaldo de la investigación; no existe `src/data/tarifas-*.ts`.

## Fuente oficial

- **Documento:** Superintendencia Financiera de Colombia, _Anexo 1: Tarifa máxima anual en pesos del SOAT_, vigente desde el 1 de enero de 2026.
- **Descarga:** https://www.superfinanciera.gov.co/loader.php?lServicio=Tools2&lTipo=descargas&lFuncion=descargar&idFile=1080047
- **Norma:** Circular Externa 022 del 30 de diciembre de 2025, según CER (cerlatam.com) y la prensa.
- **Ojo:** el pie del PDF dice «Circular Externa XXX de 2025». Puede ser la versión de proyecto. Las primas coinciden con los totales que terceros publican citando la circular final (ver abajo), pero **hay que confirmarlo con el cliente**, que ve el valor real al expedir.

## Cómo se calcula el valor a pagar

El anexo publica **primas**. Su propia nota aclara que no incluyen la contribución del 52 % a la ADRES (art. 3, Ley 2161 de 2021) ni la tasa RUNT.

```
total = truncar_a_la_centena( prima × 1,52 + tasa RUNT )   con tasa RUNT = $2.400
```

Esta regla es **inferida**: reproduce exactamente los 15 totales que publica rodarseguro.com/soat/precio-2026, que cita la Circular 022 de 2025 y el archivo `TarifasSOAT2026.xlsx`. La prensa reporta algunos valores con diferencias de $100 a $200 (por ejemplo, Blu Radio publica $343.500 y $256.300), por eso **queda pendiente la confirmación del cliente**.

## Primas oficiales y totales calculados (lo que se usa en el sitio)

### Motos (Tabla 1)

| Categoría               | Prima (anexo) | Total a pagar |
| ----------------------- | ------------- | ------------- |
| Ciclomotor              | 80.100        | 124.100       |
| Menos de 100 c.c.       | 167.000       | 256.200       |
| De 100 a 200 c.c.       | 224.300       | 343.300       |
| Más de 200 c.c.         | 499.400       | 761.400       |
| Motocarro (5 pasajeros) | 253.000       | 386.900       |

### Autos familiares (Tabla 5)

| Cilindraje            | Prima, 0–9 años | Prima, 10 años o más | Total, 0–9 años | Total, 10 años o más |
| --------------------- | --------------- | -------------------- | --------------- | -------------------- |
| Menos de 1.500 c.c.   | 292.700         | 388.500              | 447.300         | 592.900              |
| De 1.500 a 2.500 c.c. | 356.800         | 444.100              | 544.700         | 677.400              |
| Más de 2.500 c.c.     | 416.900         | 494.700              | 636.000         | 754.300              |

### Camperos y camionetas (Tabla 2)

| Cilindraje            | Prima, 0–9 años | Prima, 10 años o más | Total, 0–9 años | Total, 10 años o más |
| --------------------- | --------------- | -------------------- | --------------- | -------------------- |
| Menos de 1.500 c.c.   | 520.000         | 625.400              | 792.800         | 953.000              |
| De 1.500 a 2.500 c.c. | 621.200         | 736.200              | 946.600         | 1.121.400            |
| Más de 2.500 c.c.     | 728.900         | 836.600              | 1.110.300       | 1.274.000            |

Estos valores **no se usan en el código** (D5).

## Uso

Solo como referencia para el asesor. El valor real lo da la plataforma de expedición del cliente.
