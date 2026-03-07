# 🚀 TAD DOMINICANA - DEPLOYMENT INSTRUCTIONS

**Versión:** 2.0 PRODUCTION  
**Fecha:** 7 de Marzo, 2026

---

## 📋 CHECKLIST DE DEPLOYMENT

### Pre-Deployment

- [ ] Código Google Apps Script actualizado
- [ ] Spreadsheet ID verificado
- [ ] Webhook URL actualizada en frontend
- [ ] Tests locales completados
- [ ] Backup del código anterior

### Deployment

- [ ] Google Apps Script actualizado
- [ ] Deployment actualizado en GAS
- [ ] Permisos verificados
- [ ] Frontend actualizado en Vercel
- [ ] Tests post-deployment completados

### Post-Deployment

- [ ] Test GET exitoso
- [ ] Test POST exitoso
- [ ] Datos en Google Sheets
- [ ] Email de notificación recibido
- [ ] Landing page funcionando

---

## 🔧 PASO A PASO

### 1. Actualizar Google Apps Script

#### 1.1 Copiar Código

```bash
# URL del código:
https://raw.githubusercontent.com/tadtaxiadvertising/landing-anunciantes-tad/main/google-apps-script/Codigo-PRODUCTION.gs
```

1. Abre esa URL en tu navegador
2. Ctrl+A (seleccionar todo)
3. Ctrl+C (copiar)

#### 1.2 Pegar en Google Apps Script

1. Ve a https://script.google.com/
2. Abre tu proyecto TAD
3. **BORRA TODO** el código existente (Ctrl+A, Delete)
4. **PEGA** el nuevo código (Ctrl+V)
5. **GUARDA** (Ctrl+S o ícono de diskette)
6. Ponle nombre: `TAD Webhook v2.0`

---

### 2. Actualizar Deployment

#### 2.1 Verificar Deployment Existente

1. Click en **"Deploy"** → **"Manage Deployments"**
2. Deberías ver tu Web App listado

#### 2.2 Actualizar Deployment

1. Click en el ícono de **lápiz** (editar) junto al deployment
2. **Version:** New version
3. **Description:** v2.0 PRODUCTION - 7/Mar/2026
4. **Execute as:** Me
5. **Who has access:** Anyone, even anonymous ⚠️
6. Click en **Update**

#### 2.3 Copiar Nueva URL

```
https://script.google.com/macros/s/AKfycbzoXowGQhBsd99iTKIj06lRObGHyoFvVBXbn74AhPRL2mVXe3JcEbXIjbaCAuu5xBBW/exec
```

**NOTA:** La URL NO cambia al actualizar el deployment.

---

### 3. Actualizar Frontend

#### 3.1 Actualizar URL en index.html

```html
<!-- En TAD Dominicana/landing-anunciantes/index.html -->
const SCRIPT_URL_B64 = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyby9zL0FLZnljYnpvWG93R1FoQnNkOTlpVEtJajA2bFJPYkdIeW9GdlZCWGJuNzRBaFBSbDJtVlhlM0pjRWJYSWpiY0NBdXU1eEJCVy9leGVj";
const SCRIPT_URL = atob(SCRIPT_URL_B64);
```

#### 3.2 Commit y Push

```bash
cd "/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes"
git add -A
git commit -m "🚀 Deploy v2.0 PRODUCTION"
git push origin main
```

#### 3.3 Vercel Auto-Deploy

Vercel detectará el push y deployará automáticamente en ~30 segundos.

**Verificar:**
```
https://vercel.com/tadtaxiadvertising/landing-anunciantes-tad/deployments
```

---

### 4. Tests Post-Deployment

#### 4.1 Test GET

```
https://landing-anunciantes-tad.vercel.app/test-completo.html
```

1. Abre esa URL
2. Click en **"Ejecutar Test GET"**
3. Debería decir: ✅ Test GET Exitoso

#### 4.2 Test POST Simple

1. En la misma página de test
2. Click en **"Enviar Test Simple"**
3. Debería decir: ✅ Test POST Simple Exitoso

#### 4.3 Test POST Completo

1. Click en **"Enviar Test Completo"**
2. Debería decir: ✅ Test POST Completo Exitoso

#### 4.4 Verificar Google Sheets

1. Abre: https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
2. Sheet: "Leads"
3. Verifica las últimas filas
4. Deberías ver los datos de test

#### 4.5 Verificar Email

1. Abre: tad.taxiadvertising@gmail.com
2. Busca: "🚀 Nuevo Lead - TAD Anunciantes"
3. Deberías recibir 2 emails (uno por test POST)

---

## 🔍 VERIFICACIÓN

### Checklist Final

- [ ] ✅ Test GET exitoso
- [ ] ✅ Test POST Simple exitoso
- [ ] ✅ Test POST Completo exitoso
- [ ] ✅ Datos en Google Sheets (3 nuevas filas)
- [ ] ✅ Emails de notificación recibidos (2 emails)
- [ ] ✅ Landing page cargando correctamente
- [ ] ✅ Formulario funcionando

---

## 🚨 ROLLBACK

### Si Algo Sale Mal

#### 1. Rollback Google Apps Script

```
1. Ve a Google Apps Script
2. Click en "Version History" (ícono de reloj con flecha)
3. Selecciona versión anterior
4. Click en "Restore"
5. Re-deploya
```

#### 2. Rollback Frontend

```bash
# Ver commits anteriores
git log --oneline

# Revertir al commit anterior
git revert HEAD

# O checkout a commit específico
git checkout <commit-hash>

# Forzar push a Vercel
git push -f origin main
```

---

## 📊 MONITORING

### Google Apps Script Dashboard

```
1. Ve a https://script.google.com/
2. Click en tu proyecto
3. Click en "Executions" (reloj ⏰)
4. Ver:
   - Total executions
   - Success rate
   - Average execution time
   - Errors
```

### Google Sheets

```
1. Abre el spreadsheet
2. Sheet "Leads"
3. Ver:
   - Total rows (debería crecer con cada lead)
   - Last update timestamp
```

### Vercel Analytics

```
1. Ve a https://vercel.com/tadtaxiadvertising/landing-anunciantes-tad
2. Click en "Analytics"
3. Ver:
   - Page views
   - Unique visitors
   - Form submissions (custom event)
```

---

## 🎯 PRODUCTION CHECKLIST

### Daily

- [ ] Verificar Executions Log (sin errores)
- [ ] Verificar nuevos leads en Sheets
- [ ] Verificar emails de notificación

### Weekly

- [ ] Revisar Vercel Analytics
- [ ] Verificar rate limiting (sin abusos)
- [ ] Backup de Google Sheets (exportar a Excel)

### Monthly

- [ ] Revisar GAS quota usage
- [ ] Optimizar si >50% de quota usada
- [ ] Actualizar dependencias (si aplica)
- [ ] Revisar y archivar datos antiguos

---

## 📞 SOPORTE

### Contactos de Emergencia

| Rol | Nombre | Contacto |
|-----|--------|----------|
| **Technical Lead** | Mendy | @Mendybb (Telegram) |
| **Developer** | Ary | @ryRosario (Telegram) |

### Escalamiento

1. **Nivel 1:** Revisar DEBUG-GUIDE.md
2. **Nivel 2:** Revisar Executions Log
3. **Nivel 3:** Contactar Technical Lead
4. **Nivel 4:** Rollback inmediato

---

## 🔗 URLS IMPORTANTES

| Servicio | URL |
|----------|-----|
| **Landing Page** | https://landing-anunciantes-tad.vercel.app |
| **Test Page** | https://landing-anunciantes-tad.vercel.app/test-completo.html |
| **Google Apps Script** | https://script.google.com/ |
| **Google Sheets** | https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit |
| **Vercel Dashboard** | https://vercel.com/tadtaxiadvertising/landing-anunciantes-tad |
| **GitHub Repo** | https://github.com/tadtaxiadvertising/landing-anunciantes-tad |

---

*Última actualización: 7 de Marzo, 2026 (04:50 UTC)*  
*Versión: 2.0 PRODUCTION*
