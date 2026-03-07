# 📋 Instrucciones para Actualizar Google Apps Script

**Fecha:** 7 de Marzo, 2026  
**Problema:** Error 500 - Script no soportaba FormData

---

## 🔧 **PASO A PASO**

### Paso 1: Abrir Google Apps Script

1. Ve a: https://script.google.com/
2. Busca tu proyecto de **TAD Dominicana**
3. Click en el proyecto

---

### Paso 2: Reemplazar Código

1. Abre el archivo `Código.gs` (o `Code.gs`)
2. **Selecciona TODO el código** (Ctrl+A)
3. **Bórralo** (Delete)
4. **Copia el nuevo código** de `Codigo.gs` (en este repo)
5. **Pégalo** en el editor

---

### Paso 3: Guardar

1. Click en el ícono de **Save** (diskette)
2. O presiona `Ctrl+S`
3. Ponle nombre: `Webhook TAD v2.0`

---

### Paso 4: Verificar Deployment

1. Click en **"Deploy"** → **"Manage Deployments"**
2. Verifica que el Web App esté activo
3. **NO necesitas crear nuevo deployment** (a menos que hayas cambiado la URL)

**Configuración correcta:**
- **Execute as:** Me
- **Who has access:** Anyone, even anonymous ⚠️

---

### Paso 5: Testear

1. Abre: https://landing-anunciantes-tad.vercel.app
2. Llena el formulario con datos de prueba
3. Envía
4. **Verifica Google Sheets** - los datos deberían llegar

---

## 🆕 **MEJORAS DEL NUEVO CÓDIGO**

| Feature | Descripción |
|---------|-------------|
| **Soporte JSON + FormData** | Funciona con ambos formatos |
| **Normalización de keys** | `correo` = `correoElectronico` = `email` |
| **Aliases automáticos** | `telefono` = `phone` = `whatsapp` |
| **Headers auto-actualizables** | Agrega columnas nuevas automáticamente |
| **Logs detallados** | Verás qué formato recibió y qué guardó |
| **Campo `tipo`** | Diferencia entre `anunciante` y `conductor` |
| **Campo `fecha`** | Timestamp ISO del envío |

---

## 📊 **COLUMNAS EN SHEETS**

El script ahora guarda estas columnas:

| # | Columna | Ejemplo |
|---|---------|---------|
| 1 | Timestamp | 2026-03-07 03:15:00 |
| 2 | Nombre | Juan Pérez |
| 3 | Empresa | Empresa SRL |
| 4 | Puesto | Gerente |
| 5 | Telefono | +18495551234 |
| 6 | Correo | juan@empresa.com |
| 7 | Ciudad | Santiago |
| 8 | Industria | Restaurante |
| 9 | Presupuesto | RD$10,000-25,000 |
| 10 | Tiene Agencia | No |
| 11 | Necesita Diseno | Sí |
| 12 | Taxis | 10 |
| 13 | Espacios por Taxi | 1 |
| 14 | Duracion | 3 |
| 15 | Inversion Mensual | 15000 |
| 16 | Inversion Total | 45000 |
| 17 | **Tipo** | **anunciante** ✅ |
| 18 | Source | landing-anunciantes-tad |
| 19 | **Fecha** | **2026-03-07T03:15:00Z** ✅ |

---

## 🧪 **TEST RÁPIDO**

### Test 1: GET (verificar script activo)

Abre en tu navegador:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Debería mostrar:
```json
{
  "status": "success",
  "message": "Webhook activo - TAD Dominicana",
  "version": "2.0",
  "timestamp": "..."
}
```

---

### Test 2: POST (formulario)

1. Abre: https://landing-anunciantes-tad.vercel.app
2. Calculadora: 10 taxis, 3 meses
3. Formulario:
   - Nombre: Test Mendy
   - Empresa: TAD Test
   - Email: test@tad.com.do
   - Teléfono: +18495551234
4. Enviar
5. Ver Sheets

---

## 🚨 **TROUBLESHOOTING**

### Error: "Script not found"

**Solución:**
- Verifica que copiaste la URL correcta del Web App
- Deploy → Manage Deployments → Copiar URL

---

### Error: "Permission denied"

**Solución:**
- Deploy → Manage Deployments
- Who has access: **Anyone, even anonymous**
- Click en **Update**

---

### Error: "Sheet not found"

**Solución:**
- El script crea la sheet automáticamente
- Verifica que el Spreadsheet ID sea correcto
- La sheet se llamará "Leads"

---

### Datos no llegan

**Verifica:**
1. **Logs del script:**
   - En Apps Script, click en **"Executions"** (reloj)
   - Verás cada ejecución y errores

2. **URL del script:**
   - ¿Es la misma que en el HTML?
   - Debe empezar con `https://script.google.com/macros/s/`

3. **Headers en Sheets:**
   - ¿La fila 1 tiene los headers correctos?
   - Si no, bórralos y deja que el script los cree

---

## 📞 **SOPORTE**

**Si algo falla:**

1. Screenshot de **"Executions"** en Apps Script
2. Screenshot de **Google Sheets** (headers + datos)
3. Screenshot del **Console** (F12) del navegador

---

**URL del nuevo código:** `google-apps-script/Codigo.gs` en este repo
