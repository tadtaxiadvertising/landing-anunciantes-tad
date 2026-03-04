# 🚀 DEPLOY - Landing Page Anunciantes TAD

---

## ✅ CAMBIOS REALIZADOS (Actualización Mendy)

### Nueva Lógica de Calculadora:

**Fórmula actualizada:**
```
Inversión Mensual = Taxis × Espacios por Taxi × RD$1,500
```

**Campos de la calculadora:**
1. **Cantidad de Taxis:** 1-100 (slider)
2. **Espacios Publicitarios por Taxi:** 1-10 (slider)
   - Cada espacio = 1 anuncio de 30 segundos
3. **Duración de Campaña:** 1, 3, 6, 12 meses (dropdown)
4. **Duración del Anuncio:** 30 segundos (fijo, informativo)

**Resultados mostrados:**
- Precio por espacio: RD$1,500/mes
- Inversión mensual
- Descuento 10% (si 12 meses)
- Inversión total
- Impactos mensuales estimados
- Total de espacios publicitarios

---

## 📁 ARCHIVO LISTO

**ZIP actualizado:** `/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes.zip`

**Contenido:**
- `index.html` (landing page completa)
- `README.md` (instrucciones)

---

## 🌐 3 OPCIONES DE DEPLOY

### Opción 1: Netlify Drop (MÁS FÁCIL - 2 minutos) ⭐ RECOMENDADO

1. Ve a https://app.netlify.com/drop
2. **Arrastra la carpeta** `landing-anunciantes` (NO el ZIP)
3. Netlify sube y deploya automáticamente
4. URL resultante: `https://random-name.netlify.app`
5. (Opcional) Cambia el nombre en Site Settings > Change site name

**Ventajas:**
- ✅ Sin comandos
- ✅ Sin GitHub
- ✅ Instantáneo
- ✅ HTTPS automático

---

### Opción 2: Vercel CLI (5 minutos)

**Requiere Node.js instalado:**

```bash
# Instalar Vercel (primera vez)
npm install -g vercel

# Ir al directorio
cd "/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes"

# Deploy
vercel --prod
```

**Primera vez te pedirá:**
- Login con email
- Link to existing project: `No`
- Project name: `landing-anunciantes-tad`
- Directory: `./`
- Want to modify settings: `No`

**URL resultante:** `https://landing-anunciantes-tad.vercel.app`

---

### Opción 3: GitHub + Vercel (Para control total)

**Paso 1: Crear repo en GitHub**

1. Ve a https://github.com/new
2. Nombre: `landing-anunciantes-tad`
3. Descripción: "Landing page anunciantes - TAD Dominicana"
4. Público
5. Click "Create repository"

**Paso 2: Subir archivos**

Opción A - Upload manual:
1. Click "uploading an existing file"
2. Arrastra `index.html` y `README.md`
3. Commit changes

Opción B - Git command line:
```bash
cd "/root/.openclaw/workspace/TAD Dominicana/landing-anunciantes"
git remote add origin https://github.com/tu-usuario/landing-anunciantes-tad.git
git branch -M main
git push -u origin main
```

**Paso 3: Conectar con Vercel**

1. Ve a https://vercel.com/new
2. Import Git Repository
3. Selecciona `landing-anunciantes-tad`
4. Deploy

---

## 🧪 TESTING POST-DEPLOY

**Una vez deployed, prueba:**

1. ✅ **Calculadora:**
   - Mueve slider de taxis (1-100)
   - Mueve slider de espacios (1-10)
   - Cambia duración (1/3/6/12 meses)
   - Verifica que los números cuadren

2. ✅ **Fórmula manual:**
   ```
   Ejemplo: 10 taxis × 2 espacios × RD$1,500 = RD$30,000/mes
   Ejemplo: 10 taxis × 2 espacios × RD$1,500 × 12 meses × 0.90 = RD$324,000
   ```

3. ✅ **Formulario:**
   - Llena todos los campos
   - Envía
   - Verifica en Google Sheet que llegue con:
     - `tipo`: "anunciante"
     - `taxis`: (valor de calculadora)
     - `espaciosPorTaxi`: (valor de calculadora)
     - `inversionMensual`: (calculado)
     - `inversionTotal`: (calculado)

4. ✅ **WhatsApp:**
   - Click en botón flotante
   - Verifica que abra WhatsApp con mensaje pre-llenado

5. ✅ **Móvil:**
   - Abre en celular
   - Verifica que sea responsive

---

## 📊 FÓRMULAS DE LA CALCULADORA

| Concepto | Fórmula | Ejemplo |
|----------|---------|---------|
| **Inversión Mensual** | Taxis × Espacios × RD$1,500 | 10 × 2 × 1,500 = RD$30,000 |
| **Inversión Total (1 mes)** | Inversión Mensual × 1 | RD$30,000 |
| **Inversión Total (3 meses)** | Inversión Mensual × 3 | RD$90,000 |
| **Inversión Total (6 meses)** | Inversión Mensual × 6 | RD$180,000 |
| **Inversión Total (12 meses)** | Inversión Mensual × 12 × 0.90 | RD$324,000 |
| **Impactos Mensuales** | Taxis × Espacios × 3,000 | 10 × 2 × 3,000 = 60,000 |
| **Total Espacios** | Taxis × Espacios | 10 × 2 = 20 espacios |

---

## 🔧 ACTUALIZAR GOOGLE APPS SCRIPT

**Para guardar campos adicionales, agrega en `buildCanonicalRecord()`:**

```javascript
return {
  // ... campos existentes ...
  tipo: getValue(payload, normalizedPayload, ['tipo'], 'web'),
  espaciosPorTaxi: getValue(payload, normalizedPayload, ['espaciosPorTaxi', 'espacios_por_taxi', 'espacios'], '1'),
  // ... resto de campos ...
};
```

**Y en `DEFAULT_HEADERS`:**
```javascript
var DEFAULT_HEADERS = [
  'Hora', 'Nombre', 'Apellido', 'Cédula', 'Teléfono', 'Correo',
  'Marca', 'Modelo', 'Año', 'Placa', 'Plataformas', 'Horas por dia',
  'Días por semana', 'Ciudad', 'Horario', '¿Tiene tablet?',
  'Experiencia en ventas', 'Aplicación',
  // Nuevos campos para anunciantes:
  'Tipo', 'Taxis', 'Espacios por Taxi', 'Duración',
  'Inversión Mensual', 'Inversión Total'
];
```

---

## 📞 SOPORTE

Si hay problemas:

| Problema | Solución |
|----------|----------|
| Calculadora no actualiza | Abrir consola (F12) y ver errores |
| Formulario no envía | Verificar Google Apps Script URL |
| No se ve en móvil | Verificar viewport meta tag |
| Deploy falla en Netlify | Asegurar que sea carpeta, no ZIP |

---

**Actualizado:** 4 de Marzo, 2026  
**Versión:** 1.1.0  
**Estado:** ✅ Lista para deploy
