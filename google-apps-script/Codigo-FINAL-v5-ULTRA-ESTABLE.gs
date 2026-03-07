/**
 * ============================================================================
 * TAD DOMINICANA - WEBHOOK DE CAPTURA DE LEADS v5.0 ULTRA-ESTABLE
 * ============================================================================
 * 
 * CARACTERÍSTICAS:
 * ✅ Nunca pierde parámetros (getParams robusto)
 * ✅ Soporta FormData + JSON + URLSearchParams
 * ✅ Manejo de errores profesional
 * ✅ Logs claros y detallados
 * ✅ Guarda siempre en Sheets (fail-safe)
 * ✅ Sin setHttpStatusCode (compatible 100%)
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 
 * 1. Abrir https://script.google.com/
 * 2. Abrir proyecto "TAD Webhook" o crear nuevo
 * 3. BORRAR TODO el código existente (Ctrl+A, Delete)
 * 4. Copiar ESTE CÓDIGO COMPLETO
 * 5. Pegar en el editor
 * 6. Click "Guardar" (ícono diskette o Ctrl+S)
 * 7. Click "Implementar" → "Nueva implementación"
 * 8. Tipo: "Aplicación web"
 * 9. Descripción: "TAD Webhook v5.0 ULTRA-ESTABLE"
 * 10. Ejecutar como: "Yo" (tu cuenta)
 * 11. Quién tiene acceso: "Cualquier usuario"
 * 12. Click "Implementar"
 * 13. Autorizar permisos (Configuración avanzada → Ir a proyecto)
 * 14. Copiar URL de la aplicación web
 * 15. ¡LISTO! El sistema está 100% funcional
 * 
 * ============================================================================
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
  SPREADSHEET_ID: '1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU',
  SHEET_NAME: 'Leads',
  NOTIFICATION_EMAIL: 'tad.taxiadvertising@gmail.com',
  REQUIRED_FIELDS: ['nombre', 'correo'],
  VERSION: '5.0-ULTRA-ESTABLE'
};

// ============================================
// COLUMNAS DE GOOGLE SHEETS (19 columnas)
// ============================================
const COLUMN_HEADERS = [
  'Timestamp',
  'Nombre',
  'Empresa',
  'Puesto',
  'Telefono',
  'Correo',
  'Ciudad',
  'Industria',
  'Presupuesto',
  'Tiene Agencia',
  'Necesita Diseno',
  'Taxis',
  'Espacios por Taxi',
  'Duracion',
  'Inversion Mensual',
  'Inversion Total',
  'Tipo',
  'Source',
  'Fecha'
];

// ============================================
// ENTRY POINT - POST
// ============================================
function doPost(e) {
  var startTime = Date.now();
  var requestId = 'req-' + Math.random().toString(36).substr(2, 9);
  
  try {
    log('========================================', requestId);
    log('🚀 [' + requestId + '] POST recibido - TAD v' + CONFIG.VERSION, requestId);
    log('========================================', requestId);
    log('[' + requestId + '] Timestamp: ' + new Date().toISOString(), requestId);
    
    // 1. EXTRAER PARÁMETROS (robusto, nunca falla)
    var payload = getParams(e);
    log('[' + requestId + '] Payload recibido: ' + JSON.stringify(payload), requestId);
    
    // 2. VALIDAR QUE HAY DATOS
    if (!payload || Object.keys(payload).length === 0) {
      throw new Error('Payload vacío - no se recibieron datos del formulario');
    }
    
    // 3. VALIDAR CAMPOS REQUERIDOS
    validateRequiredFields(payload, requestId);
    log('[' + requestId + '] ✅ Campos requeridos validados', requestId);
    
    // 4. VALIDAR EMAIL
    validateEmail(payload.correo, requestId);
    log('[' + requestId + '] ✅ Email válido: ' + payload.correo, requestId);
    
    // 5. SANITIZAR DATOS (XSS prevention)
    var sanitizedData = sanitizeData(payload, requestId);
    log('[' + requestId + '] ✅ Datos sanitizados', requestId);
    
    // 6. ABRIR SPREADSHEET
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    log('[' + requestId + '] 📊 Spreadsheet abierto: ' + CONFIG.SPREADSHEET_ID, requestId);
    
    // 7. OBTENER/CREAR SHEET
    var sheet = getOrCreateSheet(ss, requestId);
    log('[' + requestId + '] ✅ Sheet listo: ' + CONFIG.SHEET_NAME, requestId);
    
    // 8. CONSTRUIR FILA (19 columnas exactas)
    var row = buildRow(sanitizedData, requestId);
    log('[' + requestId + '] 📋 Fila construida: ' + row.length + ' columnas', requestId);
    
    // 9. GUARDAR EN SHEETS (CRÍTICO - siempre guarda)
    sheet.appendRow(row);
    log('[' + requestId + '] ✅ Lead guardado exitosamente en Sheets', requestId);
    
    // 10. ENVIAR EMAIL (opcional, no falla si hay error)
    try {
      sendNotificationEmail(sanitizedData, requestId);
      log('[' + requestId + '] 📧 Email de notificación enviado', requestId);
    } catch (emailError) {
      log('[' + requestId + '] ⚠️ Email error (no crítico): ' + emailError.message, requestId);
    }
    
    // 11. RETORNAR ÉXITO
    var executionTime = Date.now() - startTime;
    log('[' + requestId + '] ⏱️ Execution time: ' + executionTime + 'ms', requestId);
    log('[' + requestId + '] ========================================', requestId);
    
    return jsonResponse({
      status: 'success',
      message: 'Lead guardado correctamente',
      timestamp: new Date().toISOString(),
      requestId: requestId,
      executionTime: executionTime,
      data: sanitizedData
    });
    
  } catch (err) {
    var executionTime = Date.now() - startTime;
    log('[' + requestId + '] ❌ ERROR CRÍTICO: ' + err.message, requestId);
    log('[' + requestId + '] Stack: ' + err.stack, requestId);
    
    // RETURN ERROR (sin setHttpStatusCode)
    return jsonResponse({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
      requestId: requestId,
      executionTime: executionTime
    });
  }
}

// ============================================
// ENTRY POINT - GET (health check)
// ============================================
function doGet(e) {
  return jsonResponse({
    status: 'success',
    message: 'Webhook activo - TAD Dominicana v' + CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    spreadsheet: CONFIG.SPREADSHEET_ID,
    sheet: CONFIG.SHEET_NAME,
    instructions: 'Use POST to submit leads',
    endpoints: {
      test: 'GET /exec?test=true - Test connection',
      submit: 'POST /exec - Submit lead'
    }
  });
}

// ============================================
// 🎯 FUNCIÓN CRÍTICA: getParams()
// Extrae parámetros de múltiples formatos
// NUNCA falla, siempre retorna algo
// ============================================
function getParams(e) {
  var params = {};
  
  // Método 1: e.parameter (FormData/URLSearchParams) - MÁS COMÚN
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    Logger.log('📦 Parsing: e.parameter (FormData/URLSearchParams)');
    return parseParameterObject(e.parameter);
  }
  
  // Método 2: e.parameters (array format)
  if (e && e.parameters && Object.keys(e.parameters).length > 0) {
    Logger.log('📦 Parsing: e.parameters (array format)');
    for (var key in e.parameters) {
      if (e.parameters.hasOwnProperty(key)) {
        var value = e.parameters[key];
        // e.parameters[key] es array, tomar primer elemento
        params[key] = Array.isArray(value) && value.length > 0 ? value[0] : value;
      }
    }
    return normalizeKeys(params);
  }
  
  // Método 3: JSON body (e.postData.contents)
  if (e && e.postData && e.postData.contents) {
    try {
      Logger.log('📦 Parsing: JSON body (e.postData.contents)');
      params = JSON.parse(e.postData.contents);
      return normalizeKeys(params);
    } catch (jsonError) {
      Logger.log('⚠️ JSON parse failed: ' + jsonError.message);
    }
  }
  
  // Método 4: Fallback - intentar con e directo
  Logger.log('⚠️ Fallback: usando e directo');
  return normalizeKeys(e || {});
}

// ============================================
// PARSEO DE OBJETO DE PARÁMETROS
// ============================================
function parseParameterObject(params) {
  var data = {};
  
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var normalizedKey = normalizeKey(key);
      var value = params[key];
      
      // Manejar arrays (ej: checkboxes múltiples)
      if (Array.isArray(value)) {
        data[normalizedKey] = value.join(', ');
      } else {
        data[normalizedKey] = value;
      }
    }
  }
  
  return data;
}

// ============================================
// NORMALIZACIÓN DE KEYS (preserva camelCase)
// ============================================
function normalizeKeys(obj) {
  var normalized = {};
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      normalized[normalizeKey(key)] = obj[key];
    }
  }
  
  return normalized;
}

/**
 * CRÍTICO: Normaliza keys PRESERVANDO camelCase
 * - "espaciosPorTaxi" → "espaciosPorTaxi" ✅
 * - "EspaciosPorTaxi" → "EspaciosPorTaxi" ✅
 * - "espacios_por_taxi" → "espaciosportaxi" ✅
 * 
 * NO usa toLowerCase() - destruye camelCase
 */
function normalizeKey(key) {
  if (!key || typeof key !== 'string') return '';
  
  return key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
    .replace(/[^a-zA-Z0-9]/g, '');     // Quitar especiales, MANTENER case
}

// ============================================
// VALIDACIÓN DE CAMPOS REQUERIDOS
// ============================================
function validateRequiredFields(payload, requestId) {
  log('[' + requestId + '] 🔍 Validando campos requeridos: ' + CONFIG.REQUIRED_FIELDS.join(', '), requestId);
  
  for (var i = 0; i < CONFIG.REQUIRED_FIELDS.length; i++) {
    var field = CONFIG.REQUIRED_FIELDS[i];
    var value = payload[field];
    
    if (!value || value.toString().trim() === '') {
      log('[' + requestId + '] ❌ Campo faltante: ' + field, requestId);
      throw new Error('Falta campo requerido: ' + field);
    }
    
    log('[' + requestId + '] ✅ Campo válido: ' + field + ' = ' + value, requestId);
  }
}

// ============================================
// VALIDACIÓN DE EMAIL
// ============================================
function validateEmail(email, requestId) {
  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    log('[' + requestId + '] ❌ Email inválido: ' + email, requestId);
    throw new Error('Email inválido: ' + email);
  }
  
  log('[' + requestId + '] ✅ Email válido: ' + email, requestId);
}

// ============================================
// SANITIZACIÓN DE DATOS (XSS Prevention)
// ============================================
function sanitizeData(data, requestId) {
  var sanitized = {};
  
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var value = data[key];
      
      if (typeof value === 'string') {
        // Escape HTML entities
        value = value.replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/javascript:/gi, '')
                     .replace(/on\w+=/gi, '')
                     .trim();
        
        // Limit length
        if (value.length > 500) {
          value = value.substring(0, 500);
        }
      }
      
      sanitized[key] = value;
    }
  }
  
  log('[' + requestId + '] ✅ Datos sanitizados (' + Object.keys(sanitized).length + ' campos)', requestId);
  return sanitized;
}

// ============================================
// GESTIÓN DE SHEETS
// ============================================
function getOrCreateSheet(ss, requestId) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    log('[' + requestId + '] 📊 Creando sheet: ' + CONFIG.SHEET_NAME, requestId);
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    
    // Agregar headers
    sheet.appendRow(COLUMN_HEADERS);
    log('[' + requestId + '] 📝 Headers agregados (' + COLUMN_HEADERS.length + ' columnas)', requestId);
    
    // Congelar primera fila
    sheet.setFrozenRows(1);
    
    // Formatear headers
    var headerRange = sheet.getRange(1, 1, 1, COLUMN_HEADERS.length);
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Ajustar anchos
    adjustColumnWidths(sheet);
    
    log('[' + requestId + '] ✅ Sheet creado y formateado', requestId);
  }
  
  return sheet;
}

function adjustColumnWidths(sheet) {
  var widths = [150, 120, 120, 100, 120, 200, 100, 100, 120, 100, 120, 80, 120, 80, 120, 120, 100, 150, 200];
  
  for (var i = 0; i < widths.length && i < COLUMN_HEADERS.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
}

// ============================================
// CONSTRUCCIÓN DE FILA (19 columnas)
// ============================================
function buildRow(data, requestId) {
  var row = [
    new Date(),                              // 1. Timestamp
    data.nombre || '',                       // 2. Nombre
    data.empresa || '',                      // 3. Empresa
    data.puesto || '',                       // 4. Puesto
    data.telefono || '',                     // 5. Telefono
    data.correo || '',                       // 6. Correo
    data.ciudad || '',                       // 7. Ciudad
    data.industria || '',                    // 8. Industria
    data.presupuesto || '',                  // 9. Presupuesto
    data.tieneAgencia || '',                 // 10. Tiene Agencia
    data.necesitaDiseno || '',               // 11. Necesita Diseno
    data.taxis || '',                        // 12. Taxis
    data.espaciosPorTaxi || '',              // 13. Espacios por Taxi
    data.duracion || '',                     // 14. Duracion
    data.inversionMensual || '',             // 15. Inversion Mensual
    data.inversionTotal || '',               // 16. Inversion Total
    data.tipo || 'anunciante',               // 17. Tipo
    data.source || 'landing-anunciantes',    // 18. Source
    data.fecha || new Date().toISOString()   // 19. Fecha
  ];
  
  log('[' + requestId + '] 📋 Fila: ' + row.map(function(v, i) {
    return COLUMN_HEADERS[i] + '=' + (typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : v);
  }).join(' | '), requestId);
  
  return row;
}

// ============================================
// NOTIFICACIÓN POR EMAIL
// ============================================
function sendNotificationEmail(data, requestId) {
  var subject = '🚀 Nuevo Lead - TAD Anunciantes (' + data.nombre + ')';
  
  var body = [
    '========================================',
    'NUEVO LEAD - TAD DOMINICANA',
    '========================================',
    '',
    'Fecha: ' + new Date().toLocaleString('es-DO'),
    'Request ID: ' + requestId,
    '',
    '--- DATOS DEL LEAD ---',
    '',
    'Nombre: ' + data.nombre,
    'Empresa: ' + (data.empresa || 'N/A'),
    'Puesto: ' + (data.puesto || 'N/A'),
    'Teléfono: ' + (data.telefono || 'N/A'),
    'Email: ' + data.correo,
    'Ciudad: ' + (data.ciudad || 'N/A'),
    'Industria: ' + (data.industria || 'N/A'),
    'Presupuesto: ' + (data.presupuesto || 'N/A'),
    '',
    '--- CAMPAÑA ---',
    '',
    'Taxis: ' + (data.taxis || 'N/A'),
    'Espacios por Taxi: ' + (data.espaciosPorTaxi || 'N/A'),
    'Duración: ' + (data.duracion || 'N/A') + ' meses',
    'Inversión Mensual: RD$ ' + (data.inversionMensual || 'N/A'),
    'Inversión Total: RD$ ' + (data.inversionTotal || 'N/A'),
    '',
    '--- METADATA ---',
    '',
    'Tipo: ' + (data.tipo || 'anunciante'),
    'Source: ' + (data.source || 'landing-anunciantes'),
    '',
    '========================================'
  ].join('\n');
  
  GmailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
}

// ============================================
// JSON RESPONSE (COMPATIBLE 100% - SIN setHttpStatusCode)
// ============================================
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// LOGGING HELPER
// ============================================
function log(message, requestId) {
  Logger.log(message);
}

// ============================================
// FIN DEL CÓDIGO
// ============================================
