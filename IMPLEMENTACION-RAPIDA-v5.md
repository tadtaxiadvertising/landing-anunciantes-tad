# 🚀 IMPLEMENTACIÓN RÁPIDA - v5.0 ULTRA-ESTABLE

**Tiempo estimado:** 5 minutos

---

## PASOS DE IMPLEMENTACIÓN

### 1️⃣ Abrir Google Apps Script
```
https://script.google.com/
```

### 2️⃣ Abrir/Crear Proyecto
- Buscar "TAD Webhook" o proyecto existente
- Si no existe: "Nuevo proyecto"

### 3️⃣ BORRAR CÓDIGO EXISTENTE
```
Ctrl + A  (seleccionar todo)
Delete    (borrar)
```

### 4️⃣ COPIAR CÓDIGO v5

**Opción A - Desde GitHub:**
1. Abrir: https://github.com/tadtaxiadvertising/landing-anunciantes-tad/blob/main/google-apps-script/Codigo-FINAL-v5-ULTRA-ESTABLE.gs
2. Click botón **"Raw"** (arriba derecha)
3. `Ctrl + A` (seleccionar todo)
4. `Ctrl + C` (copiar)

**Opción B - Desde archivo local:**
1. Abrir `google-apps-script/Codigo-FINAL-v5-ULTRA-ESTABLE.gs`
2. `Ctrl + A`
3. `Ctrl + C`

### 5️⃣ PEGAR EN EDITOR
```
Ctrl + V  (pegar)
```

**Verificar:** Deberían ser ~474 líneas

### 6️⃣ GUARDAR
```
Ctrl + S  o  Click ícono 💾
```

### 7️⃣ IMPLEMENTAR

1. Click **"Implementar"** (arriba derecha)
2. **"Nueva implementación"**
3. Configurar:
   - **Tipo:** Aplicación web
   - **Descripción:** TAD Webhook v5.0 ULTRA-ESTABLE
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario ⚠️
4. Click **"Implementar"**

### 8️⃣ AUTORIZAR

1. Click **"Autorizar acceso"**
2. Seleccionar cuenta: `tad.taxiadvertising@gmail.com`
3. Click **"Configuración avanzada"**
4. Click **"Ir a proyecto (inseguro)"**
5. Click **"Continuar"**
6. Click **"Permitir"**

### 9️⃣ COPIAR URL

- Copiar URL de la aplicación web
- Formato: `https://script.google.com/macros/s/XXXXX/exec`
- **Nota:** La URL NO cambia al actualizar, usa la misma

### 🔟 TESTEAR

**1. Abrir test page:**
```
https://landing-anunciantes-tad.vercel.app/test-final.html
```

**2. Abrir Console (F12)**

**3. Click "🚀 Enviar Test"**

**4. Verificar logs:**
```
🚀 [req-xxx] POST recibido - TAD v5.0-ULTRA-ESTABLE
📦 Parsing: e.parameter (FormData/URLSearchParams)
✅ Campo válido: nombre = Test Mendy
✅ Campo válido: correo = test@test.com
✅ Lead guardado exitosamente en Sheets
```

**5. Click link a Google Sheets**

**6. Verificar última fila:**
- ✅ TODAS las columnas con valor
- ✅ Taxis: 10
- ✅ Espacios por Taxi: 1
- ✅ Duracion: 3
- ✅ Inversion Mensual: 15000
- ✅ Inversion Total: 45000

---

## ✅ CHECKLIST FINAL

- [ ] Código v5 copiado completo
- [ ] Código pegado en GAS
- [ ] Guardado (Ctrl+S)
- [ ] Implementado como aplicación web
- [ ] Quién tiene acceso: Cualquier usuario
- [ ] Autorizado permisos
- [ ] URL copiada
- [ ] Test page cargada
- [ ] Formulario enviado
- [ ] Google Sheets con fila completa
- [ ] Email recibido (opcional)

---

## 🐛 TROUBLESHOOTING

### Error: "Payload vacío"
- Verificar código v5 está pegado completo
- Re-implementar aplicación web

### Error: "setHttpStatusCode is not a function"
- Código v4 aún está activo
- Borrar TODO y pegar v5 de nuevo

### Campos vacíos en Sheets
- Abrir https://script.google.com/
- Click "Ejecuciones" (reloj izquierda)
- Ver logs de última ejecución
- Enviar screenshot

### CORS error en Console
- Es NORMAL con mode: 'no-cors'
- El request SÍ se envía
- Verificar Sheets directamente

---

## 📞 SOPORTE

Si algo falla, enviar:
1. Screenshot de Console (F12)
2. Screenshot de Google Sheets (última fila)
3. Screenshot de Ejecuciones en GAS

---

*Guía creada: 7 de Marzo, 2026*  
*Versión: v5.0 ULTRA-ESTABLE*
