# Estructura de columnas (formulario exacto de `#contacto`)

La hoja debe llamarse exactamente: `Leads`

## Columnas (fila 1) en orden exacto

1. `Timestamp`
2. `Nombre`
3. `Empresa`
4. `Puesto`
5. `Telefono`
6. `Correo`
7. `Ciudad`
8. `Industria`
9. `Presupuesto`
10. `Tiene Agencia`
11. `Necesita Diseno`
12. `Taxis`
13. `Espacios por Taxi`
14. `Duracion`
15. `Inversion Mensual`
16. `Inversion Total`
17. `Source`

## Payload JSON esperado (mismo contrato del frontend)

```json
{
  "nombre": "Ana Pérez",
  "empresa": "Empresa XYZ",
  "puesto": "Gerente de Marketing",
  "telefono": "+18495551234",
  "correo": "ana@empresa.com",
  "ciudad": "Santo Domingo",
  "industria": "Retail",
  "presupuesto": "RD$10,000-25,000",
  "tieneAgencia": "si",
  "necesitaDiseno": "no",
  "taxis": 10,
  "espaciosPorTaxi": 2,
  "duracion": 3,
  "inversionMensual": 30000,
  "inversionTotal": 90000,
  "source": "landing-anunciantes-tad"
}
```

## Campos obligatorios

- `nombre`
- `empresa`
- `puesto`
- `telefono`
- `correo`
- `ciudad`
- `industria`

Los demás se guardan como opcionales.
