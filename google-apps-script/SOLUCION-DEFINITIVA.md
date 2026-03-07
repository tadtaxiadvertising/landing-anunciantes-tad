# 🔧 SOLUCIÓN DEFINITIVA - Google Apps Script

**Fecha:** 7 de Marzo, 2026  
**Problema:** Los datos no llegan a Google Sheets  
**Solución:** Script 100% compatible + Página de test

---

## 🚨 **PASOS CRÍTICOS - SIGUE ESTO EXACTAMENTE**

### Paso 1: Abre Google Apps Script

```
https://script.google.com/
```

---

### Paso 2: Busca tu Proyecto TAD

Debería llamarse algo como:
- "TAD Dominicana"
- "Webhook TAD"
- "Leads TAD"

---

### Paso 3: BORRA TODO el Código Existente

1. Click en `Código.gs` (o `Code.gs`)
2. **Ctrl+A** (seleccionar todo)
3. **Delete** (borrar todo)
4. **Asegúrate de que el editor esté vacío**

---

### Paso 4: COPIA el Nuevo Código

**URL del código:**
```
https://raw.githubusercontent.com/tadtaxiadvertising/landing-anunciantes-tad/main/google-apps-script/Codigo-FINAL.gs
```

1. Abre ese link en tu navegador
2. **Ctrl+A** (seleccionar todo)
3. **Ctrl+C** (copiar)

---

### Paso 5: PEGA el Código

1. Vuelve a Google Apps Script
2. **Ctrl+V** (pegar)
3. **Ctrl+S** (guardar)
4. Ponle nombre: `Webhook TAD Final`

---

### Paso 6: VERIFICA el Deployment

1. Click en **"Deploy"** → **"Manage Deployments"**
2. Deberías ver tu Web App
3. Click en el ícono de **lápiz** (editar)
4. **Configuración:**
   - **Execute as:** Me
   - **Who has access:** Anyone, even anonymous ⚠️
5. Click en **Update**

---

### Paso 7: COPIA la URL del Web App

Debería verse así:
```
https://script.google.com/macros/s/AKfycbzoXowGQhBsd99iTKIj06lRObGHyoFvVBXbn74AhPRL2mVXe3JcEbXIjbaCAuu5xBBW/exec
```

**Esta URL DEBE coincidir con la que está en la landing page.**

---

## 🧪 **TESTEA CON LA PÁGINA DE TEST**

### Opción A: Test Online

**URL:**
```
https://landing-anunciantes-tad.vercel.app/test-conexion.html
```

**Pasos:**
1. Abre esa URL
2. Click en **"Test GET"**
   - Debería decir "✅ Si no hay error de red, el script está accesible"
3. Click en **"Test POST Simple"**
   - Debería decir "✅ POST enviado"
4. Click en **"Test POST Completo"**
   - Debería decir "✅ POST completo enviado"
5. **Verifica Google Sheets**

---

### Opción B: Test Manual en la Landing

**URL:**
```
https://landing-anunciantes-tad.vercel.app
```

**Pasos:**
1. Ve a la calculadora
2. Pon: 10 taxis, 3 meses
3. Baja al formulario
4. Llena con datos de prueba:
   - Nombre: Test Mendy
   - Empresa: TAD Test
   - Email: test@tad.com
   - Teléfono: 8495551234
   - Ciudad: Santiago
5. Click en "Enviar Solicitud"
6. **Verifica Google Sheets**

---

## 📊 **VERIFICA GOOGLE SHEETS**

### Deberías Ver:

**Sheet:** `Leads`

**Headers (Fila 1):**
```
Timestamp | Nombre | Empresa | Puesto | Telefono | Correo | Ciudad | Industria | 
Presupuesto | Tiene Agencia | Necesita Diseno | Taxis | Espacios por Taxi | 
Duracion | Inversion Mensual | Inversion Total | Tipo | Source | Fecha
```

**Datos (Fila 2+):**
```
2026-03-07 00:00:00 | Test Mendy | TAD Test | Gerente | 8495551234 | 
test@tad.com | Santiago | Publicidad | RD$10,000-25,000 | No | Sí | 
10 | 1 | 3 | 15000 | 45000 | test | test-page | 2026-03-07T00:00:00Z
```

---

## 🔍 **TROUBLESHOOTING**

### Error: "Script not found"

**Causa:** URL incorrecta

**Solución:**
1. Ve a Deploy → Manage Deployments
2. Copia la URL del Web App
3. Actualiza la landing page con esa URL

---

### Error: "Permission denied"

**Causa:** Permisos incorrectos

**Solución:**
1. Deploy → Manage Deployments
2. Click en lápiz (editar)
3. Who has access: **Anyone, even anonymous**
4. Update

---

### Error: "Sheet not found"

**Causa:** La sheet no existe

**Solución:**
- El script crea la sheet automáticamente
- Si no la crea, crea una sheet llamada `Leads` manualmente
- Ejecuta el test de nuevo

---

### Datos no llegan

**Verifica los logs:**

1. En Apps Script, click en **"Executions"** (ícono de reloj ⏰)
2. Click en la ejecución más reciente
3. Verás los logs detallados

**Logs que deberías ver:**
```
========================================
🚀 POST recibido - TAD Anunciantes
========================================
📦 Datos en e.parameter
Datos recibidos: {...}
Fila a guardar: ...
✅ Lead guardado exitosamente
📧 Email de notificación enviado
```

**Si ves errores:**
- Screenshot de los logs
- Screenshot de la consola del navegador (F12)
- Envíamelos

---

## 📋 **CHECKLIST**

- [ ] Código copiado de `Codigo-FINAL.gs`
- [ ] Código pegado en Apps Script
- [ ] Código guardado (Ctrl+S)
- [ ] Deployment actualizado
- [ ] Who has access: Anyone, even anonymous
- [ ] URL copiada
- [ ] Test GET exitoso
- [ ] Test POST exitoso
- [ ] Datos en Google Sheets
- [ ] Email de notificación recibido (opcional)

---

## 🔗 **URLS IMPORTANTES**

| Servicio | URL |
|----------|-----|
| **Google Apps Script** | https://script.google.com/ |
| **Código Final** | https://raw.githubusercontent.com/tadtaxiadvertising/landing-anunciantes-tad/main/google-apps-script/Codigo-FINAL.gs |
| **Página de Test** | https://landing-anunciantes-tad.vercel.app/test-conexion.html |
| **Landing Page** | https://landing-anunciantes-tad.vercel.app |
| **GitHub Repo** | https://github.com/tadtaxiadvertising/landing-anunciantes-tad |

---

## 📞 **SOPORTE**

**Si algo falla, envíame:**

1. **Screenshot de Executions** (reloj en Apps Script)
   - Click en la ejecución más reciente
   - Screenshot de TODO el log

2. **Screenshot de Google Sheets**
   - Sheet "Leads"
   - Headers (fila 1)
   - Datos (filas 2+)

3. **Screenshot de la consola del navegador**
   - F12 → Console
   - Después de hacer el test

---

*Guía creada: 7 de Marzo, 2026 (04:20 UTC)*  
*Versión: FINAL - 100% compatible*
