# 🔧 TAD DOMINICANA - DEBUG & TROUBLESHOOTING GUIDE

**Versión:** 2.0 PRODUCTION  
**Fecha:** 7 de Marzo, 2026  
**Sistema:** Google Apps Script Webhook para Captura de Leads

---

## 📋 TABLA DE CONTENIDOS

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Flujo de Datos](#flujo-de-datos)
3. [Debug Paso a Paso](#debug-paso-a-paso)
4. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
5. [Comandos de Verificación](#comandos-de-verificación)
6. [Scaling y Optimización](#scaling-y-optimización)

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│  LANDING PAGE (Vercel)                                  │
│  https://landing-anunciantes-tad.vercel.app             │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Formulario React                              │    │
│  │  ↓                                             │    │
│  │  Validación (nombre, email)                    │    │
│  │  ↓                                             │    │
│  │  Sanitización (XSS prevention)                 │    │
│  │  ↓                                             │    │
│  │  URLSearchParams                               │    │
│  │  ↓                                             │    │
│  │  fetch(POST, no-cors)                          │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
                          ↓ POST /webhook
                          ↓
┌─────────────────────────────────────────────────────────┐
│  GOOGLE APPS SCRIPT WEBHOOK                             │
│  https://script.google.com/macros/s/.../exec            │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  doPost(e)                                     │    │
│  │  ↓                                             │    │
│  │  1. Parse Payload (URLSearchParams/JSON)       │    │
│  │  ↓                                             │    │
│  │  2. Validar Campos Requeridos                  │    │
│  │  ↓                                             │    │
│  │  3. Validar Email                              │    │
│  │  ↓                                             │    │
│  │  4. Sanitizar Datos                            │    │
│  │  ↓                                             │    │
│  │  5. Abrir Spreadsheet (openById)               │    │
│  │  ↓                                             │    │
│  │  6. Get/Create Sheet "Leads"                   │    │
│  │  ↓                                             │    │
│  │  7. Build Row (19 columnas)                    │    │
│  │  ↓                                             │    │
│  │  8. Append Row                                 │    │
│  │  ↓                                             │    │
│  │  9. Send Email Notification                    │    │
│  │  ↓                                             │    │
│  │  10. Return JSON Response                      │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ↓
                          ↓ Append Row
                          ↓
┌─────────────────────────────────────────────────────────┐
│  GOOGLE SHEETS                                          │
│  https://docs.google.com/spreadsheets/d/.../edit        │
│                                                          │
│  Sheet: "Leads"                                         │
│  Columnas: 19                                           │
│  Headers: Timestamp, Nombre, Empresa, ..., Fecha        │
└─────────────────────────────────────────────────────────┘
                          ↓
                          ↓ Email
                          ↓
┌─────────────────────────────────────────────────────────┐
│  EMAIL NOTIFICATION                                     │
│  To: tad.taxiadvertising@gmail.com                      │
│  Subject: 🚀 Nuevo Lead - TAD Anunciantes               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 FLUJO DE DATOS

### Request → Response

```
1. Usuario llena formulario en landing page
2. React valida campos (nombre, email requeridos)
3. Datos sanitizados (XSS prevention)
4. Convertidos a URLSearchParams
5. fetch() POST con mode: 'no-cors'
6. Google Apps Script recibe en e.parameter
7. Script parsea, valida, sanitiza
8. Abre Spreadsheet por ID
9. Obtiene/crea sheet "Leads"
10. Construye fila con 19 columnas
11. AppendRow en Sheets
12. Envía email de notificación
13. Retorna JSON {status: 'success'}
14. Frontend muestra mensaje de éxito
```

---

## 🐛 DEBUG PASO A PASO

### Nivel 1: Frontend (Landing Page)

#### 1.1 Abrir Console del Navegador

```
F12 → Console
```

#### 1.2 Verificar Logs del Formulario

```javascript
// Deberías ver:
🚀 [FORM] Iniciando envío de lead...
🔒 [FORM] Datos sanitizados: {...}
📦 [FORM] Payload preparado: {...}
📤 [FORM] URLSearchParams: nombre=...&correo=...
📡 [FORM] Enviando a: https://script.google.com/...
📥 [FORM] Respuesta recibida
✅ [FORM] Lead enviado exitosamente
```

#### 1.3 Verificar Network Tab

```
F12 → Network → Filtrar por "script.google.com"

Deberías ver:
- Request URL: https://script.google.com/macros/s/.../exec
- Request Method: POST
- Status Code: 302 (redirect normal en GAS)
- Request Payload: nombre=...&correo=...&...
```

---

### Nivel 2: Google Apps Script

#### 2.1 Abrir Executions Log

```
1. Ve a https://script.google.com/
2. Abre tu proyecto TAD
3. Click en ícono de reloj ⏰ (Executions)
4. Click en la ejecución más reciente
```

#### 2.2 Logs Esperados

```
========================================
🚀 [req-abc123] POST recibido - TAD Dominicana v2.0-PRODUCTION
========================================
[req-abc123] Timestamp: 2026-03-07T04:30:00.000Z
[req-abc123] Content-Type: application/x-www-form-urlencoded
[req-abc123] Content-Length: 256
[req-abc123] 📦 Parseando como e.parameter (URLSearchParams/FormData)
[req-abc123] Payload parseado: {"nombre":"Juan","correo":"juan@test.com",...}
[req-abc123] 🔍 Validando campos requeridos: nombre, correo
[req-abc123] ✅ Campo válido: nombre
[req-abc123] ✅ Campo válido: correo
[req-abc123] ✅ Email válido: juan@test.com
[req-abc123] 📊 Spreadsheet abierto: 1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU
[req-abc123] 📋 Fila: Timestamp=... | Nombre=Juan | Correo=juan@test.com | ...
[req-abc123] ✅ Lead guardado exitosamente
[req-abc123] 📧 Email de notificación enviado
[req-abc123] ⏱️ Tiempo de ejecución: 234ms
========================================
```

---

### Nivel 3: Google Sheets

#### 3.1 Verificar Sheet

```
1. Abre: https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
2. Busca sheet "Leads"
3. Verifica última fila
```

#### 3.2 Columnas Esperadas

| # | Columna | Ejemplo |
|---|---------|---------|
| A | Timestamp | 2026-03-07 00:30:00 |
| B | Nombre | Juan Pérez |
| C | Empresa | Empresa SRL |
| D | Puesto | Gerente |
| E | Telefono | +18495551234 |
| F | Correo | juan@empresa.com |
| G | Ciudad | Santiago |
| H | Industria | Restaurante |
| I | Presupuesto | RD$10,000-25,000 |
| J | Tiene Agencia | No |
| K | Necesita Diseno | Sí |
| L | Taxis | 10 |
| M | Espacios por Taxi | 1 |
| N | Duracion | 12 |
| O | Inversion Mensual | 15000 |
| P | Inversion Total | 180000 |
| Q | Tipo | test-completo |
| R | Source | test-page |
| S | Fecha | 2026-03-07T04:30:00Z |

---

### Nivel 4: Email Notification

#### 4.1 Verificar Inbox

```
Email: tad.taxiadvertising@gmail.com
Subject: 🚀 Nuevo Lead - TAD Anunciantes (Juan Pérez)

Deberías recibir el email dentro de 1-2 minutos después del submit.
```

---

## ❌ ERRORES COMUNES Y SOLUCIONES

### Error 1: "Script not found" / 404

**Síntoma:**
```
Failed to load resource: net::ERR_FAILED
```

**Causas:**
1. URL del webhook incorrecta
2. Deployment eliminado
3. Permisos revocados

**Solución:**
```
1. Ve a Deploy → Manage Deployments
2. Verifica que el Web App existe
3. Copia la URL nueva
4. Actualiza en la landing page
5. Who has access: Anyone, even anonymous
```

---

### Error 2: "Permission denied"

**Síntoma:**
```
Exception: You do not have permission to call SpreadsheetApp.openById
```

**Causas:**
1. Script no está autorizado
2. Spreadsheet ID incorrecto
3. El script no tiene acceso al spreadsheet

**Solución:**
```
1. Abre el script en Google Apps Script
2. Ejecuta cualquier función manualmente (ej: doGet)
3. Click en "Review Permissions"
4. Autoriza con la cuenta tad.taxiadvertising@gmail.com
5. Verifica que el Spreadsheet ID es correcto
```

---

### Error 3: "Sheet not found"

**Síntoma:**
```
Exception: The sheet "Leads" doesn't exist
```

**Causas:**
1. Sheet fue eliminada
2. Nombre incorrecto (case-sensitive)

**Solución:**
```
El script debería crear la sheet automáticamente.
Si no:
1. Abre Google Sheets
2. Crea sheet manualmente llamada "Leads"
3. Ejecuta el test de nuevo
```

---

### Error 4: "Email inválido"

**Síntoma:**
```
Error: Email inválido: test@
```

**Causas:**
1. Email sin @
2. Email sin dominio

**Solución:**
```
Validación en frontend:
- Verificar que el email tiene @ y .
- Mensaje claro al usuario
```

---

### Error 5: Datos no llegan a Sheets

**Síntoma:**
```
✅ Lead enviado (frontend)
❌ No hay datos en Sheets
```

**Causas:**
1. Script no está guardado
2. Deployment no actualizado
3. Error en parsePayload
4. Spreadsheet ID incorrecto

**Solución:**
```
1. Verifica Executions Log (reloj ⏰)
2. Busca errores en los logs
3. Verifica Spreadsheet ID en el código
4. Re-deploya el script
5. Testea con test-completo.html
```

---

### Error 6: CORS Error

**Síntoma:**
```
Access to fetch has been blocked by CORS policy
```

**Causas:**
- Google Apps Script no envía CORS headers

**Solución:**
```javascript
// Frontend DEBE usar:
fetch(url, {
    method: 'POST',
    mode: 'no-cors',  // ← CRÍTICO
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
});
```

---

### Error 7: Rate Limit Exceeded

**Síntoma:**
```
⚠️ Por favor espera 60 segundos antes de enviar otra solicitud
```

**Causas:**
- Múltiples envíos en menos de 1 minuto

**Solución:**
```
Esperar 60 segundos entre envíos.
Configuración en:
- Frontend: RATE_LIMIT_MS = 60000
- localStorage key: tad_anunciantes_last_submit
```

---

## ✅ COMANDOS DE VERIFICACIÓN

### Verificar URL del Webhook

```bash
curl -i "https://script.google.com/macros/s/AKfycbzoXowGQhBsd99iTKIj06lRObGHyoFvVBXbn74AhPRL2mVXe3JcEbXIjbaCAuu5xBBW/exec"
```

**Respuesta esperada:**
```
HTTP/2 302
location: https://script.googleusercontent.com/...
```

---

### Verificar Landing Page

```bash
curl -I "https://landing-anunciantes-tad.vercel.app"
```

**Respuesta esperada:**
```
HTTP/2 200
content-type: text/html; charset=utf-8
```

---

### Verificar Google Sheets

```bash
# Abre en navegador:
https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
```

---

## 📈 SCALING Y OPTIMIZACIÓN

### Current Capacity

| Métrica | Valor |
|---------|-------|
| **Requests/día** | ~1,000 (GAS quota) |
| **Requests/minuto** | ~60 (rate limit) |
| **Sheet rows** | ~10,000 (antes de slowdown) |
| **Email notifications** | 100/día (GAS quota) |

---

### Optimization Suggestions

#### 1. Batch Email Notifications

**Problema:** 1 email por lead = 100 emails/día

**Solución:**
```javascript
// Enviar resumen diario en lugar de email por lead
function sendDailySummary() {
  // Contar leads del día
  // Enviar 1 email con todos
}

// Trigger con time-driven trigger (9 PM daily)
```

---

#### 2. Archive Old Data

**Problema:** Sheet con 10,000+ filas es lento

**Solución:**
```javascript
// Mover datos antiguos a sheet "Leads_Archive"
// Mantener solo últimos 1,000 en "Leads"
function archiveOldData() {
  // Ejecutar semanalmente
}
```

---

#### 3. Add Caching

**Problema:** Abrir spreadsheet cada vez es lento

**Solución:**
```javascript
// Cache por 5 minutos
var cache = CacheService.getScriptCache();
var sheet = cache.get('sheet_' + CONFIG.SPREADSHEET_ID);

if (!sheet) {
  sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  cache.put('sheet_' + CONFIG.SPREADSHEET_ID, 'ready', 300);
}
```

---

#### 4. Migrate to Cloud Run (Future)

**Cuando:** >1,000 leads/día

**Arquitectura:**
```
Landing Page → Cloud Run (Node.js) → Sheets API
                          ↓
                    Pub/Sub → Email
```

**Beneficios:**
- Sin límites de GAS
- Más rápido (<100ms)
- Más barato a escala

---

## 📞 SOPORTE

### Contactos

| Rol | Email | Telegram |
|-----|-------|----------|
| **Technical Lead** | tad.taxiadvertising@gmail.com | @Mendybb |
| **Developer** | - | @ryRosario |

### Canales de Soporte

1. **GitHub Issues:** https://github.com/tadtaxiadvertising/landing-anunciantes-tad/issues
2. **Telegram:** Grupo TAD Dominicana
3. **Email:** tad.taxiadvertising@gmail.com

---

## 📚 RECURSOS

### Documentación Oficial

- [Google Apps Script](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Vercel Deployments](https://vercel.com/docs)

### Archivos del Proyecto

| Archivo | URL |
|---------|-----|
| **Backend (GAS)** | `google-apps-script/Codigo-PRODUCTION.gs` |
| **Frontend Handler** | `js/form-handler.js` |
| **Test Page** | `test-completo.html` |
| **Landing Page** | `index.html` |

---

*Última actualización: 7 de Marzo, 2026 (04:45 UTC)*  
*Versión: 2.0 PRODUCTION*
