# 🚀 LANDING PAGE v2.0 - DEPLOYMENT GUIDE

**Fecha:** 7 de Marzo, 2026  
**Versión:** 2.0 PRODUCTION  
**Stack:** HTML5 + Vanilla JS + TailwindCSS CDN

---

## 📋 RESUMEN DE CAMBIOS

### Antes (v1.0)
- ❌ React + Babel en navegador
- ❌ 1050+ líneas de código
- ❌ Build process complejo
- ❌ Console warnings
- ❌ Slow load time

### Ahora (v2.0)
- ✅ HTML5 + Vanilla JS puro
- ✅ 662 líneas (40% menos)
- ✅ 0 build process
- ✅ 0 console errors
- ✅ Load time <2 segundos

---

## 🎯 CARACTERÍSTICAS NUEVAS

### UI/UX
- ✅ **Hero Section** con headline impactante
- ✅ **Stats Section** (50K pasajeros, 200 taxis, 24/7, RD$1,500)
- ✅ **Benefits Section** (4 beneficios con íconos)
- ✅ **Calculadora Interactiva** (slider + selects)
- ✅ **Formulario Completo** (15 campos)
- ✅ **Success Message** con animación
- ✅ **WhatsApp Float** button
- ✅ **Navigation** sticky con backdrop blur
- ✅ **Mobile-first** responsive design

### Technical
- ✅ **TailwindCSS CDN** (no build required)
- ✅ **Vanilla JavaScript** (no framework)
- ✅ **URLSearchParams** para form submission
- ✅ **no-cors mode** para GAS webhook
- ✅ **Analytics placeholders** (GA, FB, TikTok)
- ✅ **Preconnect** para performance
- ✅ **Smooth scroll** navigation

---

## 🔧 DEPLOYMENT EN VERCEL

### Opción A: Auto-Deploy (Recomendado)

El repo ya está conectado a Vercel. Solo haz push:

```bash
cd "/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes"
git add -A
git commit -m "🚀 Landing Page v2.0 - HTML5 + Vanilla JS"
git push origin main
```

**Vercel detectará el cambio y deployará automáticamente en ~30 segundos.**

---

### Opción B: Deploy Manual

Si necesitas deploy manual:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Login
vercel login

# Deploy
cd "/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes"
vercel --prod
```

---

## ✅ VERIFICACIÓN POST-DEPLOY

### 1. Abrir Landing Page

```
https://landing-anunciantes-tad.vercel.app
```

**Checklist:**
- [ ] ✅ Hero section carga correctamente
- [ ] ✅ Stats se muestran (50K, 200, 24/7, RD$1,500)
- [ ] ✅ Benefits section con 4 íconos
- [ ] ✅ Calculadora funciona (slider + selects)
- [ ] ✅ Formulario visible
- [ ] ✅ WhatsApp float button visible
- [ ] ✅ Navigation sticky funciona

---

### 2. Testear Calculadora

**Pasos:**
1. Mover slider de taxis (1-100)
2. Cambiar espacios por taxi (1-3)
3. Cambiar duración (1/3/6/12 meses)
4. Verificar que los números se actualizan

**Deberías ver:**
- Inversión Mensual: RD$ [cambia]
- Duración: [cambia] meses
- Inversión Total: RD$ [cambia]
- Impactos Mensuales: [cambia]

---

### 3. Testear Formulario

**Pasos:**
1. Llenar formulario con datos de prueba
2. Click en "Enviar Solicitud"
3. Verificar success message

**Datos de prueba:**
```
Nombre: Test Mendy
Empresa: TAD Test
Puesto: Gerente
Teléfono: +18495043872
Email: test@tad.com
Ciudad: Santiago
Industria: Publicidad
Presupuesto: RD$10,000-25,000
```

**Deberías ver:**
- ✅ Loading state ("Enviando...")
- ✅ Success message con checkmark
- ✅ Botón de WhatsApp

---

### 4. Verificar Google Sheets

**URL:**
```
https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
```

**Checklist:**
- [ ] ✅ Sheet "Leads" existe
- [ ] ✅ Nueva fila con datos del test
- [ ] ✅ 19 columnas completas
- [ ] ✅ Timestamp correcto
- [ ] ✅ tipo: "anunciante"
- [ ] ✅ source: "landing-anunciantes"

---

### 5. Verificar Email

**Email:** tad.taxiadvertising@gmail.com

**Deberías recibir:**
- ✅ Email con subject: "🚀 Nuevo Lead - TAD Anunciantes"
- ✅ Todos los campos del formulario en el cuerpo

---

## 📊 PERFORMANCE METRICS

### Target Metrics

| Metric | Target | Actual (esperado) |
|--------|--------|-------------------|
| **Load Time** | <2s | ~1.2s |
| **First Contentful Paint** | <1.5s | ~0.8s |
| **Time to Interactive** | <3s | ~1.5s |
| **Lighthouse Score** | >90 | ~95 |
| **Page Size** | <100KB | ~45KB |

---

### Verificar Performance

**Chrome DevTools:**
1. F12 → Lighthouse
2. Select: Performance, Accessibility, Best Practices, SEO
3. Click "Analyze page load"
4. Score debería ser >90

**WebPageTest:**
```
https://www.webpagetest.org/
URL: https://landing-anunciantes-tad.vercel.app
Location: Miami (close to DR)
```

---

## 🎨 CUSTOMIZACIÓN

### Cambiar Colores

En el `<script>` de Tailwind config:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                taxi: {
                    400: '#FFD700',  // Cambiar aquí
                    500: '#FFC700',  // Cambiar aquí
                    600: '#FFB700',  // Cambiar aquí
                }
            }
        }
    }
}
```

---

### Cambiar Precios

En el JavaScript:

```javascript
const PRICE_PER_TAXI = 1500;  // Cambiar aquí
const IMPACTS_PER_TAXI = 3000;  // Cambiar aquí
```

---

### Cambiar WhatsApp Number

Buscar y reemplazar:
```html
https://wa.me/18495043872
```

---

## 🔗 ANALYTICS INTEGRATION

### Google Analytics

Agregar antes del `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
    
    // Track form submission
    function trackConversion() {
        gtag('event', 'submit', {
            'event_category': 'form',
            'event_label': 'lead'
        });
    }
</script>
```

---

### Facebook Pixel

Agregar antes del `</head>`:

```html
<!-- Facebook Pixel Code -->
<script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'PIXEL_ID');
    fbq('track', 'PageView');
    
    // Track form submission
    function trackConversion() {
        fbq('track', 'Lead');
    }
</script>
```

---

### TikTok Pixel

Agregar antes del `</head>`:

```html
<!-- TikTok Pixel Code -->
<script>
    !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","ready","alias","debug","on","off","once","reset","set","plugin"],
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
        ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=n,ttq._t=ttq._t||{},ttq._t[e]="https://analytics.tiktok.com/i18n/pixel/events.js",
        ttq.s=e;var a=d.createElement(t);a.async=!0,a.src=r+n;var s=d.getElementsByTagName(t)[0];
        s.parentNode.insertBefore(a,s)};
        ttq.load('PIXEL_ID');
        ttq.page();
    }(window, document, 'ttq');
    
    // Track form submission
    function trackConversion() {
        ttq.track('SubmitForm');
    }
</script>
```

---

## 🚨 TROUBLESHOOTING

### Problema: Formulario no envía

**Solución:**
1. Abrir Console (F12)
2. Verificar errores
3. Verificar URL del webhook en el código
4. Testear webhook directamente:
   ```
   https://landing-anunciantes-tad.vercel.app/test-completo.html
   ```

---

### Problema: Calculadora no actualiza

**Solución:**
1. Verificar JavaScript console errors
2. Verificar IDs de elementos
3. Verificar event listeners

---

### Problema: Estilos no cargan

**Solución:**
1. Verificar conexión a internet
2. Verificar CDN de Tailwind:
   ```
   https://cdn.tailwindcss.com
   ```
3. Verificar Google Fonts:
   ```
   https://fonts.googleapis.com
   ```

---

## 📞 SOPORTE

### Contactos

| Rol | Nombre | Contacto |
|-----|--------|----------|
| **Developer** | Ary | @ryRosario |
| **Technical Lead** | Mendy | @Mendybb |

---

## 🔗 URLS IMPORTANTES

| Servicio | URL |
|----------|-----|
| **Landing Page** | https://landing-anunciantes-tad.vercel.app |
| **Test Page** | https://landing-anunciantes-tad.vercel.app/test-completo.html |
| **Google Sheets** | https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit |
| **GitHub Repo** | https://github.com/tadtaxiadvertising/landing-anunciantes-tad |
| **Vercel Dashboard** | https://vercel.com/tadtaxiadvertising/landing-anunciantes-tad |

---

*Guía creada: 7 de Marzo, 2026 (05:35 UTC)*  
*Versión: 2.0 PRODUCTION*
