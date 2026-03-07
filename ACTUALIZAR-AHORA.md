# ⚡ GUÍA RÁPIDA - ACTUALIZAR AHORA

**Fecha:** 7 de Marzo, 2026  
**Tiempo estimado:** 5 minutos

---

## 🎯 PASOS A SEGUIR

### PASO 1: Abrir Google Apps Script (1 min)

```
https://script.google.com/
```

1. Abre ese link
2. Busca tu proyecto "TAD" o "Webhook TAD"
3. Click en el proyecto

---

### PASO 2: Borrar Código Viejo (30 seg)

1. En el editor de código (`Código.gs`)
2. **Ctrl + A** (seleccionar todo)
3. **Delete** (borrar todo)
4. Verifica que esté **vacío**

---

### PASO 3: Copiar Código Nuevo (1 min)

**Abre este link en otra pestaña:**
```
https://raw.githubusercontent.com/tadtaxiadvertising/landing-anunciantes-tad/main/google-apps-script/Codigo-PRODUCTION.gs
```

1. **Ctrl + A** (seleccionar todo)
2. **Ctrl + C** (copiar)

---

### PASO 4: Pegar Código Nuevo (30 seg)

1. Vuelve a Google Apps Script
2. **Ctrl + V** (pegar)
3. **Ctrl + S** (guardar)
4. Ponle nombre: `TAD Webhook v2.0`

---

### PASO 5: Actualizar Deployment (1 min)

1. Click en **"Deploy"** (arriba a la derecha)
2. **"Manage Deployments"**
3. Click en el **lápiz** ✏️ junto al deployment
4. **Version:** New version
5. **Description:** v2.0 PRODUCTION
6. **Execute as:** Me
7. **Who has access:** Anyone, even anonymous
8. Click en **"Update"**

---

### PASO 6: Testear (2 min)

**Abre esta URL:**
```
https://landing-anunciantes-tad.vercel.app/test-completo.html
```

1. **Click en "Ejecutar Test GET"**
   - ✅ Debería decir "Test GET Exitoso"

2. **Click en "Enviar Test Simple"**
   - ✅ Debería decir "Test POST Simple Exitoso"

3. **Abre Google Sheets:**
   ```
   https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
   ```

4. **Verifica la sheet "Leads"**
   - ✅ Deberías ver nuevas filas con los datos de test

5. **Verifica tu email:**
   - tad.taxiadvertising@gmail.com
   - ✅ Deberías tener emails con subject: "🚀 Nuevo Lead - TAD Anunciantes"

---

## ✅ CHECKLIST

- [ ] Código viejo borrado
- [ ] Código nuevo pegado
- [ ] Código guardado (Ctrl+S)
- [ ] Deployment actualizado
- [ ] Test GET exitoso
- [ ] Test POST exitoso
- [ ] Datos en Google Sheets
- [ ] Email de notificación recibido

---

## 🚨 SI ALGO FALLA

### Mándame screenshot de:

1. **Executions** (reloj ⏰ en Apps Script)
   - Click en la última ejecución
   - Screenshot de todo el log

2. **Google Sheets**
   - Sheet "Leads"
   - Headers y últimas filas

3. **Consola del navegador**
   - F12 → Console
   - Después del test

---

## 📞 CONTACTO

**Telegram:** @ryRosario (Ary)

**Envíame los screenshots si hay algún error.**

---

*Tiempo total: ~5 minutos*
