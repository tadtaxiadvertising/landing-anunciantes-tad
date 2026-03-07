# 🧪 Guía de Testing - Formulario Landing Anunciantes

**Fecha:** 7 de Marzo, 2026  
**URL:** https://landing-anunciantes-tad.vercel.app

---

## 🔧 FIX APLICADO

### Problemas Corregidos

| # | Problema | Solución |
|---|----------|----------|
| 1 | Campos ocultos no se enviaban | Ahora se incluyen explícitamente en FormData |
| 2 | Datos como JSON | Cambiado a FormData (form-urlencoded) |
| 3 | Faltaba campo `tipo` | Agregado `tipo: 'anunciante'` |
| 4 | Manejo de errores débil | Mejorado con logs y validación de status HTTP |

---

## 📋 PASOS PARA TESTEAR

### Paso 1: Abrir la Landing

```
https://landing-anunciantes-tad.vercel.app
```

---

### Paso 2: Usar la Calculadora

1. Ve a la sección **Calculadora**
2. Selecciona:
   - **Número de taxis:** 10
   - **Duración:** 3 meses
   - **Extras:** Marca Banner y QR
3. Verifica que el total se actualice

---

### Paso 3: Llenar Formulario

Ve a `#contacto` y completa:

| Campo | Valor de prueba |
|-------|-----------------|
| **Nombre** | Juan Pérez Test |
| **Empresa** | Empresa Test SRL |
| **Puesto** | Gerente de Marketing |
| **Teléfono** | +18495551234 |
| **Correo** | test@empresa.com |
| **Ciudad** | Santiago |
| **Industria** | Restaurante |
| **Presupuesto** | RD$10,000-25,000 |
| **¿Tienes Agencia?** | No |
| **¿Necesitas Diseño?** | Sí |

**Campos automáticos (de la calculadora):**
- `taxis`: 10
- `espaciosPorTaxi`: 1
- `duracion`: 3
- `inversionMensual`: RD$15,000
- `inversionTotal`: RD$45,000

---

### Paso 4: Enviar Formulario

1. Click en **"Enviar Solicitud"**
2. Deberías ver:
   - ✅ Spinner de "Enviando..."
   - ✅ Mensaje de éxito
   - ✅ Pantalla de confirmación

---

### Paso 5: Verificar Google Sheets

**URL del Sheet:** (Mendy debe proporcionar)

**Columnas que deben llegar:**

| Columna | Valor esperado |
|---------|----------------|
| `nombre` | Juan Pérez Test |
| `empresa` | Empresa Test SRL |
| `puesto` | Gerente de Marketing |
| `telefono` | +18495551234 |
| `correo` | test@empresa.com |
| `ciudad` | Santiago |
| `industria` | Restaurante |
| `presupuesto` | RD$10,000-25,000 |
| `tieneAgencia` | No |
| `necesitaDiseno` | Sí |
| `taxis` | 10 |
| `espaciosPorTaxi` | 1 |
| `duracion` | 3 |
| `inversionMensual` | 15000 |
| `inversionTotal` | 45000 |
| `tipo` | **anunciante** ✅ |
| `fecha` | 2026-03-07T... |
| `source` | landing-anunciantes |

---

## 🔍 DEBUGGING

### Si los datos NO llegan a Sheets:

#### Opción 1: Abrir Console del Navegador

1. Abre la landing en Chrome
2. Presiona `F12` (o clic derecho → Inspect)
3. Ve a la pestaña **Console**
4. Llena y envía el formulario
5. Busca logs que empiezan con:
   - `🔒 Datos a enviar:`
   - `📡 URL de Google Apps Script:`
   - `📥 Respuesta raw:`

**Logs esperados:**
```
🔒 Datos a enviar: {nombre: "Juan Pérez Test", empresa: "...", ...}
📡 URL de Google Apps Script: https://script.google.com/...
📥 Respuesta raw: {"result":"success",...}
✅ Solicitud enviada exitosamente
```

#### Opción 2: Ver Network Tab

1. En Chrome DevTools, ve a **Network**
2. Envía el formulario
3. Busca request a `script.google.com`
4. Click en el request
5. Verifica:
   - **Status:** 200 OK
   - **Method:** POST
   - **Payload:** Debe incluir todos los campos

---

## 🚨 ERRORES COMUNES

### Error: "Error al enviar"

**Causas posibles:**
1. ❌ Google Apps Script no está desplegado
2. ❌ URL del script es incorrecta
3. ❌ CORS no está configurado en Apps Script

**Solución:**
```javascript
// En Google Apps Script, verificar:
function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify({result: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Error: Datos incompletos en Sheets

**Causa:** Google Apps Script no está parseando correctamente

**Solución:** Verificar script de Mendy (5/Mar/2026):

```javascript
function doPost(e) {
  // Parsear FormData
  const data = e.parameter; // Para form-urlencoded
  // O
  const data = JSON.parse(e.postData.contents); // Para JSON
  
  // ... resto del código
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Landing page carga correctamente
- [ ] Calculadora funciona (cambia precios)
- [ ] Formulario tiene todos los campos
- [ ] Al enviar, muestra "Enviando..."
- [ ] Después de enviar, muestra mensaje de éxito
- [ ] Datos llegan a Google Sheets
- [ ] Columna `tipo` dice "anunciante"
- [ ] Campos de calculadora llegan (taxis, duracion, inversion)

---

## 📞 SOPORTE

**Si algo falla:**

1. **Toma screenshot** del error en console
2. **Copia los logs** del navegador
3. **Verifica el Sheet** (¿llegaron datos?)
4. **Envía todo a Mendy** para debugging

---

**URL de Testing:** https://landing-anunciantes-tad.vercel.app  
**Fecha del fix:** 7 de Marzo, 2026
