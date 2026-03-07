# 🚀 Landing Page para Anunciantes - TAD Dominicana

Landing page profesional para generar leads de anunciantes interesados en publicidad digital en taxis.

---

## 📁 Ubicación del Proyecto

```
TAD Dominicana/landing-anunciantes/
└── index.html
```

---

## 🎯 Características

- ✅ Diseño SaaS profesional (negro + amarillo taxi + blanco)
- ✅ 100% responsive (mobile-first)
- ✅ Calculadora interactiva de inversión
- ✅ Formulario de leads calificados
- ✅ Botón flotante de WhatsApp
- ✅ Integración con Google Apps Script
- ✅ Optimizado para conversión

---

## 🚀 DEPLOY EN VERCEL (2 OPCIONES)

### Opción 1: GitHub + Vercel (Recomendado)

**Paso 1: Crear repositorio en GitHub**

```bash
# En tu computadora local:
git clone https://github.com/tadtaxiadvertising/landing-anunciantes.git
cd landing-anunciantes
cp /path/to/TAD\ Dominicana/landing-anunciantes/index.html .
git add .
git commit -m "Initial commit"
git push origin main
```

**O crea el repo directamente en GitHub:**
1. Ve a https://github.com/new
2. Nombre: `landing-anunciantes`
3. Descripción: "Landing page para anunciantes - TAD Dominicana"
4. Público
5. Click en "Create repository"
6. Sube el archivo `index.html` manualmente

**Paso 2: Conectar con Vercel**

1. Ve a https://vercel.com/new
2. Click en "Import Git Repository"
3. Selecciona `landing-anunciantes`
4. Click en "Import"
5. **Settings:**
   - Framework Preset: `Other`
   - Build Command: (dejar vacío)
   - Output Directory: (dejar vacío)
6. Click en "Deploy"

**URL resultante:** `https://landing-anunciantes-tad.vercel.app` (o similar)

---

### Opción 2: Vercel CLI (Más rápido)

**Si tienes Node.js instalado:**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Ir al directorio del proyecto
cd "TAD Dominicana/landing-anunciantes"

# Deploy
vercel --prod
```

**Sigue las instrucciones:**
- Login con email (si es la primera vez)
- Link to existing project: `No`
- Project name: `landing-anunciantes-tad`
- Directory: `./`
- Want to modify settings: `No`

**¡Listo!** Vercel te dará una URL pública.

---

### Opción 3: Netlify Drop (Sin comandos)

1. Ve a https://app.netlify.com/drop
2. Arrastra la carpeta `landing-anunciantes` completa
3. Netlify subirá y deployará automáticamente
4. URL resultante: `https://random-name.netlify.app`

---

## ⚙️ CONFIGURACIÓN DE GOOGLE APPS SCRIPT

El formulario ya está configurado para usar el mismo Google Apps Script que el formulario de conductores.

**Los leads se guardarán en tu Google Sheet con:**
- `tipo`: "anunciante"
- Todos los campos del formulario
- Datos calculados de la calculadora (taxis, duración, inversión)

**Para verificar que funciona:**
1. Abre tu Google Sheet
2. Extensiones > Apps Script
3. Verifica que el código tenga el campo `tipo` en `buildCanonicalRecord()`
4. Si no lo tiene, agrega:
   ```javascript
   tipo: getValue(payload, normalizedPayload, ['tipo'], 'web'),
   ```

---

## 🎨 PERSONALIZACIÓN

### Cambiar Precios

Edita `index.html` y busca:

```javascript
const PRICES = {
    basePerTaxi: 1500,        // Precio base por taxi/mes
    banner: 200,              // Banner fijo
    qrDynamic: 300,           // QR dinámico
    exclusivity: 500,         // Exclusividad
    estimatedImpactsPerTaxi: 3000  // Impactos estimados por taxi
};
```

### Cambiar WhatsApp

Busca y reemplaza:
```javascript
const WHATSAPP_PHONE = "18495043872";
```

### Cambiar Google Apps Script URL

Busca y reemplaza:
```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
```

---

## 📊 ESTRUCTURA DE LA LANDING

1. **Hero Section** - Título impactante + mockup de tablet
2. **Problema/Oportunidad** - Por qué la publicidad tradicional no funciona
3. **Cómo Funciona** - 3 pasos simples
4. **Beneficios** - 5 beneficios clave
5. **Calculadora** - Inversión en tiempo real
6. **Formulario** - Lead calificado auto-fill desde calculadora
7. **Footer** - Información legal y contacto

---

## 🧪 TESTING

**Antes de lanzar:**

1. ✅ Probar calculadora (todos los rangos)
2. ✅ Probar formulario (envío real)
3. ✅ Verificar que los datos llegan al Google Sheet
4. ✅ Probar en móvil (responsive)
5. ✅ Probar botón de WhatsApp
6. ✅ Verificar velocidad de carga (PageSpeed Insights)

---

## 📈 MÉTRICAS DE CONVERSIÓN

**Objetivo:** 5% tasa de conversión mínima

**Para medir:**
- Google Analytics 4 (no incluido, agregar si se necesita)
- Facebook Pixel (no incluido, agregar si se necesita)
- Eventos en Google Apps Script (counts de leads por día)

---

## 🔧 SOPORTE

Si hay problemas:

1. **Formulario no envía:** Verificar Google Apps Script URL
2. **Calculadora no funciona:** Abrir consola del navegador (F12)
3. **No se ve en móvil:** Verificar que el viewport meta tag esté presente
4. **Deploy falla:** Verificar que solo hay 1 archivo index.html

---

**Creado:** 3 de Marzo, 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Lista para producción
