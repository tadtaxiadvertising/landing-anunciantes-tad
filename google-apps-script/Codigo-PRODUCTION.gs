/**
 * ============================================================================
 * TAD DOMINICANA - WEBHOOK DE CAPTURA DE LEADS
 * ============================================================================
 * 
 * Empresa: TAD Dominicana (Taxi Advertising)
 * Landing Page: https://landing-anunciantes-tad.vercel.app
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU/edit
 * 
 * Versión: 2.0 PRODUCTION
 * Fecha: 7 de Marzo, 2026
 * Autor: Senior Backend Engineer - Google Apps Script Specialist
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
  VERSION: '2.0-PRODUCTION'
};

// ============================================
// HEADERS DE COLUMNA
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
  var requestId = generateRequestId();
  
  try {
    Logger.log('========================================');
    Logger.log('🚀 [' + requestId + '] POST recibido - TAD Dominicana v' + CONFIG.VERSION);
    Logger.log('========================================');
    Logger.log('[' + requestId + '] Timestamp: ' + new Date().toISOString());
    Logger.log('[' + requestId + '] Content-Type: ' + (e.postData ? e.postData.type : 'N/A'));
    Logger.log('[' + requestId + '] Content-Length: ' + (e.postData ? e.postData.length : 'N/A'));
    
    // ============================================
    // 1. PARSEAR PAYLOAD
    // ============================================
    var payload = parsePayload(e, requestId);
    Logger.log('[' + requestId + '] Payload parseado: ' + JSON.stringify(payload));
    
    // ============================================
    // 2. VALIDAR CAMPOS REQUERIDOS
    // ============================================
    validateRequiredFields(payload, requestId);
    Logger.log('[' + requestId + '] Validación completada');
    
    // ============================================
    // 3. VALIDAR EMAIL
    // ============================================
    validateEmail(payload.correo, requestId);
    Logger.log('[' + requestId + '] Email validado: ' + payload.correo);
    
    // ============================================
    // 4. SANITIZAR DATOS
    // ============================================
    var sanitizedData = sanitizeData(payload, requestId);
    Logger.log('[' + requestId + '] Datos sanitizados');
    
    // ============================================
    // 5. ABRIR SPREADSHEET
    // ============================================
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    Logger.log('[' + requestId + '] Spreadsheet abierto: ' + CONFIG.SPREADSHEET_ID);
    
    // ============================================
    // 6. OBTENER/CREAR SHEET
    // ============================================
    var sheet = getOrCreateSheet(ss, requestId);
    Logger.log('[' + requestId + '] Sheet listo: ' + CONFIG.SHEET_NAME);
    
    // ============================================
    // 7. CONSTRUIR FILA
    // ============================================
    var row = buildRow(sanitizedData, requestId);
    Logger.log('[' + requestId + '] Fila construida: ' + row.length + ' columnas');
    
    // ============================================
    // 8. GUARDAR EN SHEETS
    // ============================================
    sheet.appendRow(row);
    Logger.log('[' + requestId + '] ✅ Lead guardado exitosamente');
    
    // ============================================
    // 9. ENVIAR EMAIL DE NOTIFICACIÓN
    // ============================================
    try {
      sendNotificationEmail(sanitizedData, requestId);
      Logger.log('[' + requestId + '] 📧 Email de notificación enviado');
    } catch (emailError) {
      Logger.log('[' + requestId + '] ⚠️ Error enviando email: ' + emailError.message);
      // No fallamos por el email
    }
    
    // ============================================
    // 10. RETORNAR ÉXITO
    // ============================================
    var executionTime = Date.now() - startTime;
    Logger.log('[' + requestId + '] ⏱️ Tiempo de ejecución: ' + executionTime + 'ms');
    Logger.log('[' + requestId + '] ========================================');
    
    return jsonResponse({
      status: 'success',
      message: 'Lead guardado correctamente',
      timestamp: new Date().toISOString(),
      requestId: requestId,
      executionTime: executionTime
    });
    
  } catch (err) {
    var executionTime = Date.now() - startTime;
    Logger.log('[' + requestId + '] ❌ ERROR: ' + err.message);
    Logger.log('[' + requestId + '] Stack: ' + err.stack);
    Logger.log('[' + requestId + '] ⏱️ Tiempo hasta error: ' + executionTime + 'ms');
    Logger.log('[' + requestId + '] ========================================');
    
    return jsonResponse({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
      requestId: requestId,
      executionTime: executionTime
    }, 500);
  }
}

// ============================================
// ENTRY POINT - GET
// ============================================
function doGet(e) {
  return jsonResponse({
    status: 'success',
    message: 'Webhook activo - TAD Dominicana',
    version: CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    spreadsheet: CONFIG.SPREADSHEET_ID,
    sheet: CONFIG.SHEET_NAME,
    instructions: 'Use POST to submit leads'
  });
}

// ============================================
// FUNCIONES DE PARSEO
// ============================================

/**
 * Parsea el payload soportando múltiples formatos
 */
function parsePayload(e, requestId) {
  var data = {};
  
  // Método 1: URLSearchParams / FormData (e.parameter)
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    Logger.log('[' + requestId + '] 📦 Parseando como e.parameter (URLSearchParams/FormData)');
    data = parseParameterData(e.parameter);
    return data;
  }
  
  // Método 2: JSON (e.postData.contents)
  if (e && e.postData && e.postData.contents) {
    try {
      Logger.log('[' + requestId + '] 📦 Parseando como JSON (e.postData.contents)');
      data = JSON.parse(e.postData.contents);
      return normalizeKeys(data);
    } catch (jsonError) {
      Logger.log('[' + requestId + '] ⚠️ JSON parse failed: ' + jsonError.message);
    }
  }
  
  // Método 3: Fallback a e directo
  Logger.log('[' + requestId + '] 📦 Usando e directo como fallback');
  return normalizeKeys(e);
}

/**
 * Parsea datos de e.parameter
 */
function parseParameterData(params) {
  var data = {};
  
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var normalizedKey = normalizeKey(key);
      var value = params[key];
      
      // Manejar arrays (ej: checkboxes)
      if (Array.isArray(value)) {
        data[normalizedKey] = value.join(', ');
      } else {
        data[normalizedKey] = value;
      }
    }
  }
  
  return data;
}

/**
 * Normaliza keys (quita acentos, minúsculas)
 */
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
 * Normaliza una key individual (preserva camelCase)
 */
function normalizeKey(key) {
  if (!key) return '';
  
  // Solo quitar acentos y normalizar, pero preservar camelCase
  return key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
    .replace(/[^a-zA-Z0-9]/g, '');      // Quitar espacios y especiales, pero mantener case
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Valida campos requeridos
 */
function validateRequiredFields(payload, requestId) {
  Logger.log('[' + requestId + '] 🔍 Validando campos requeridos: ' + CONFIG.REQUIRED_FIELDS.join(', '));
  
  for (var i = 0; i < CONFIG.REQUIRED_FIELDS.length; i++) {
    var field = CONFIG.REQUIRED_FIELDS[i];
    var value = payload[field];
    
    if (!value || value.toString().trim() === '') {
      Logger.log('[' + requestId + '] ❌ Campo faltante: ' + field);
      throw new Error('Falta campo requerido: ' + field);
    }
    
    Logger.log('[' + requestId + '] ✅ Campo válido: ' + field);
  }
}

/**
 * Valida formato de email
 */
function validateEmail(email, requestId) {
  if (!email || email.indexOf('@') === -1) {
    Logger.log('[' + requestId + '] ❌ Email inválido: ' + email);
    throw new Error('Email inválido: ' + email);
  }
  
  Logger.log('[' + requestId + '] ✅ Email válido: ' + email);
}

// ============================================
// FUNCIONES DE SANITIZACIÓN
// ============================================

/**
 * Sanitiza todos los datos
 */
function sanitizeData(payload, requestId) {
  var sanitized = {};
  
  for (var i = 0; i < COLUMN_HEADERS.length; i++) {
    var header = COLUMN_HEADERS[i];
    var key = normalizeKey(header);
    var value = payload[key] || '';
    
    sanitized[key] = sanitizeValue(value);
  }
  
  // Valores por defecto
  if (!sanitized.tipo) sanitized.tipo = 'anunciante';
  if (!sanitized.source) sanitized.source = 'landing-anunciantes';
  if (!sanitized.fecha) sanitized.fecha = new Date().toISOString();
  
  return sanitized;
}

/**
 * Sanitiza un valor individual
 */
function sanitizeValue(value) {
  if (value === undefined || value === null) return '';
  
  var str = value.toString();
  
  // Trim
  str = str.trim();
  
  // Remover caracteres peligrosos
  str = str.replace(/[<>]/g, '');
  str = str.replace(/javascript:/gi, '');
  str = str.replace(/on\w+=/gi, '');
  
  // Limitar longitud
  if (str.length > 500) {
    str = str.substring(0, 500);
  }
  
  return str;
}

// ============================================
// FUNCIONES DE SHEETS
// ============================================

/**
 * Obtiene o crea la sheet
 */
function getOrCreateSheet(ss, requestId) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    Logger.log('[' + requestId + '] 📊 Creando sheet: ' + CONFIG.SHEET_NAME);
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    
    // Agregar headers
    sheet.appendRow(COLUMN_HEADERS);
    Logger.log('[' + requestId + '] 📝 Headers agregados');
    
    // Congelar primera fila
    sheet.setFrozenRows(1);
    
    // Formatear headers
    var headerRange = sheet.getRange(1, 1, 1, COLUMN_HEADERS.length);
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Ajustar anchos de columna
    adjustColumnWidths(sheet);
    
    Logger.log('[' + requestId + '] ✅ Sheet creado y formateado');
  }
  
  return sheet;
}

/**
 * Ajusta anchos de columna
 */
function adjustColumnWidths(sheet) {
  var widths = [150, 120, 120, 100, 120, 200, 100, 100, 120, 100, 120, 80, 120, 80, 120, 120, 100, 150, 200];
  
  for (var i = 0; i < widths.length && i < COLUMN_HEADERS.length; i++) {
    sheet.setColumnWidth(i + 1, widths[i]);
  }
}

/**
 * Construye la fila para guardar
 */
function buildRow(data, requestId) {
  var row = [
    new Date(),                              // Timestamp
    data.nombre || '',                       // Nombre
    data.empresa || '',                      // Empresa
    data.puesto || '',                       // Puesto
    data.telefono || '',                     // Telefono
    data.correo || '',                       // Correo
    data.ciudad || '',                       // Ciudad
    data.industria || '',                    // Industria
    data.presupuesto || '',                  // Presupuesto
    data.tieneAgencia || '',                 // Tiene Agencia
    data.necesitaDiseno || '',               // Necesita Diseno
    data.taxis || '',                        // Taxis
    data.espaciosPorTaxi || '',              // Espacios por Taxi
    data.duracion || '',                     // Duracion
    data.inversionMensual || '',             // Inversion Mensual
    data.inversionTotal || '',               // Inversion Total
    data.tipo || 'anunciante',               // Tipo
    data.source || 'landing-anunciantes',    // Source
    data.fecha || new Date().toISOString()   // Fecha
  ];
  
  Logger.log('[' + requestId + '] 📋 Fila: ' + row.map(function(v, i) {
    return COLUMN_HEADERS[i] + '=' + (typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : v);
  }).join(' | '));
  
  return row;
}

// ============================================
// FUNCIONES DE NOTIFICACIÓN
// ============================================

/**
 * Envía email de notificación
 */
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
    'Empresa: ' + data.empresa,
    'Puesto: ' + data.puesto,
    'Teléfono: ' + (data.telefono || 'N/A'),
    'Email: ' + data.correo,
    'Ciudad: ' + (data.ciudad || 'N/A'),
    'Industria: ' + (data.industria || 'N/A'),
    '',
    '--- DETALLES DE LA CAMPAÑA ---',
    '',
    'Taxis: ' + (data.taxis || 'N/A'),
    'Espacios por Taxi: ' + (data.espaciosPorTaxi || 'N/A'),
    'Duración: ' + (data.duracion || 'N/A') + ' meses',
    'Inversión Mensual: RD$ ' + (data.inversionMensual || '0'),
    'Inversión Total: RD$ ' + (data.inversionTotal || '0'),
    '',
    '--- EXTRAS ---',
    '',
    'Presupuesto: ' + (data.presupuesto || 'N/A'),
    'Tiene Agencia: ' + (data.tieneAgencia || 'N/A'),
    'Necesita Diseño: ' + (data.necesitaDiseno || 'N/A'),
    '',
    '========================================',
    'Landing Page: https://landing-anunciantes-tad.vercel.app',
    'Spreadsheet: https://docs.google.com/spreadsheets/d/' + CONFIG.SPREADSHEET_ID + '/edit',
    '========================================'
  ].join('\n');
  
  MailApp.sendEmail({
    to: CONFIG.NOTIFICATION_EMAIL,
    subject: subject,
    body: body
  });
  
  Logger.log('[' + requestId + '] 📧 Email enviado a: ' + CONFIG.NOTIFICATION_EMAIL);
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Genera ID único para cada request
 */
function generateRequestId() {
  return 'req-' + Math.random().toString(36).substring(2, 8) + '-' + Date.now().toString(36);
}

/**
 * Crea respuesta JSON
 */
function jsonResponse(obj, statusCode) {
  var output = ContentService
    .createTextOutput(JSON.stringify(obj, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
  
  if (statusCode) {
    // Google Apps Script no permite setear status code directamente
    // pero lo logueamos para debugging
    Logger.log('HTTP Status: ' + statusCode);
  }
  
  return output;
}
