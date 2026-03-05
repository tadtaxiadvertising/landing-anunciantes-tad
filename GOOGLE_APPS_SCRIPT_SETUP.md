# Google Apps Script + Google Sheets (campos exactos de `#contacto`)

Esta guía está adaptada al formulario actual de la landing en `#contacto`.

## 1) Código completo de Apps Script

Usa este archivo como `Code.gs`:

- `apps-script/Code.gs`

Incluye:
- `doPost(e)` con parseo seguro de JSON.
- Validación de campos obligatorios reales del formulario.
- Inserción de fila en hoja `Leads`.
- `Timestamp` automático.
- Respuesta JSON de éxito/error.

## 2) Conectar con Google Sheet

1. Crea o abre un Google Spreadsheet.
2. Crea una pestaña llamada exactamente **`Leads`**.
3. Ve a **Extensiones → Apps Script**.
4. Reemplaza el contenido por `apps-script/Code.gs`.
5. Guarda.

## 3) Deploy como Web App

1. En Apps Script: **Deploy → New deployment**.
2. Tipo: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone** (o **Anyone with link**).
5. Deploy y autoriza.
6. Copia la URL terminada en `/exec`.

## 4) Configurar endpoint en frontend

En `index.html`, reemplaza `SCRIPT_URL_B64` por tu URL `/exec` codificada en Base64.

Ejemplo para codificar:

```bash
printf '%s' 'https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec' | base64
```

## 5) Payload JSON exacto del formulario

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

## 6) Ejemplo fetch() (POST JSON)

```javascript
const payload = {
  nombre,
  empresa,
  puesto,
  telefono,
  correo,
  ciudad,
  industria,
  presupuesto,
  tieneAgencia,
  necesitaDiseno,
  taxis,
  espaciosPorTaxi,
  duracion,
  inversionMensual,
  inversionTotal,
  source: 'landing-anunciantes-tad'
};

const response = await fetch('https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

const result = await response.json();
```

## 7) Prueba con curl

```bash
curl -X POST 'https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec' \
  -H 'Content-Type: application/json' \
  -d '{
    "nombre":"Ana Pérez",
    "empresa":"Empresa XYZ",
    "puesto":"Gerente de Marketing",
    "telefono":"+18495551234",
    "correo":"ana@empresa.com",
    "ciudad":"Santo Domingo",
    "industria":"Retail",
    "presupuesto":"RD$10,000-25,000",
    "tieneAgencia":"si",
    "necesitaDiseno":"no",
    "taxis":10,
    "espaciosPorTaxi":2,
    "duracion":3,
    "inversionMensual":30000,
    "inversionTotal":90000,
    "source":"landing-anunciantes-tad"
  }'
```

## 8) Estructura de columnas

Revisa: `apps-script/SHEET_STRUCTURE.md`
