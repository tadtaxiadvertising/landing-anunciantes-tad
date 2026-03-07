# 🧪 TAD - TEST PAGE COMPLETA

**URL:** https://landing-anunciantes-tad.vercel.app/test-final.html

---

## 📋 INSTRUCCIONES DE TEST

### 1. Abrir Test Page
```
https://landing-anunciantes-tad.vercel.app/test-final.html
```

### 2. Verificar Datos Pre-llenados
- Nombre: Test Mendy
- Email: test@tad.com
- Teléfono: +18495043872
- Taxis: 10
- Espacios: 1
- Duración: 3
- Inversión Mensual: 15000
- Inversión Total: 45000

### 3. Click "🚀 Enviar Test"

### 4. Ver Logs en Pantalla
Debes ver:
```
[HH:MM:SS] 🚀 Iniciando test...
[HH:MM:SS] 📦 Datos a enviar:
[HH:MM:SS]    taxis: 10
[HH:MM:SS]    espaciosPorTaxi: 1
[HH:MM:SS]    duracion: 3
[HH:MM:SS]    inversionMensual: 15000
[HH:MM:SS]    inversionTotal: 45000
[HH:MM:SS]    nombre: Test Mendy
[HH:MM:SS]    correo: test@tad.com
[HH:MM:SS]    ...
[HH:MM:SS] 📤 Enviando a Google Apps Script...
[HH:MM:SS] ✅ Respuesta recibida (XXXms)
[HH:MM:SS] 🎉 TEST COMPLETADO
```

### 5. Verificar Google Sheets
Click en el link que aparece y verifica:
- ✅ Última fila tiene TODAS las columnas llenas
- ✅ Columna "Taxis" = 10
- ✅ Columna "Espacios por Taxi" = 1
- ✅ Columna "Duracion" = 3
- ✅ Columna "Inversion Mensual" = 15000
- ✅ Columna "Inversion Total" = 45000

---

## ✅ CHECKLIST DE ÉXITO

- [ ] Test page carga sin errores
- [ ] Datos pre-llenados se muestran
- [ ] Click enviar funciona
- [ ] Logs muestran 18 campos
- [ ] Google Sheets recibe fila completa
- [ ] TODAS las columnas tienen valor
- [ ] Email de notificación llega (opcional)

---

## 🔗 URLS IMPORTANTES

| Servicio | URL |
|----------|-----|
| **Test Page** | https://landing-anunciantes-tad.vercel.app/test-final.html |
| **Landing** | https://landing-anunciantes-tad.vercel.app |
| **Google Sheets** | https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit |
| **Google Apps Script** | https://script.google.com/ |

---

## 🐛 TROUBLESHOOTING

### Si los campos llegan vacíos:

1. **Verificar Console (F12)**
   - Ver logs de "📦 Form data"
   - Confirmar que taxis, espaciosPorTaxi, etc. tienen valores

2. **Verificar Google Apps Script**
   - Abrir https://script.google.com/
   - Click en "Ejecuciones" (reloj izquierda)
   - Ver logs de la última ejecución
   - Confirmar que payload tiene los valores

3. **Verificar Columnas en Sheets**
   - Los nombres deben ser EXACTOS:
     - "Taxis" (no "taxis")
     - "Espacios por Taxi" (no "EspaciosPorTaxi")
     - "Duracion" (no "duración")
     - "Inversion Mensual" (no "inversionMensual")

### Si hay error de CORS:

- Es normal con `mode: 'no-cors'`
- El request SÍ se envía aunque el response sea opaque
- Verificar Sheets directamente

### Si hay error de permisos:

- Google Apps Script debe estar publicado como:
  - "Quién tiene acceso: Cualquier usuario"
- Re-implementar si es necesario

---

## 📊 CAMPOS ESPERADOS (18 TOTAL)

### Calculator (5)
1. `taxis` → Columna: Taxis
2. `espaciosPorTaxi` → Columna: Espacios por Taxi
3. `duracion` → Columna: Duracion
4. `inversionMensual` → Columna: Inversion Mensual
5. `inversionTotal` → Columna: Inversion Total

### Personal (10)
6. `nombre` → Nombre
7. `empresa` → Empresa
8. `puesto` → Puesto
9. `telefono` → Telefono
10. `correo` → Correo
11. `ciudad` → Ciudad
12. `industria` → Industria
13. `presupuesto` → Presupuesto
14. `tieneAgencia` → Tiene Agencia
15. `necesitaDiseno` → Necesita Diseno

### Metadata (3)
16. `tipo` → Tipo
17. `source` → Source
18. `fecha` → Fecha

Plus: `Timestamp` (auto-generado)

---

*Test Page v1.0 - 7 de Marzo, 2026*
