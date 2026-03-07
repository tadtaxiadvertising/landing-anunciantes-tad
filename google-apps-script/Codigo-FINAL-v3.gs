/**
 * ============================================================================
 * TAD DOMINICANA - WEBHOOK DE CAPTURA DE LEADS
 * ============================================================================
 * 
 * Versión: 3.0 PRODUCTION - FIX NORMALIZACIÓN
 * Fecha: 7 de Marzo, 2026
 * 
 * CAMBIOS:
 * - normalizeKey() ahora preserva camelCase (espaciosPorTaxi, inversionMensual)
 * - Solo quita acentos y caracteres especiales
 * - No convierte a lowercase para mantener compatibilidad con frontend
 * 
 * ============================================================================
 */

const CONFIG = {
  SPREADSHEET_ID: '1ESGFhpY3ZWZBEJ4HB7e39ANgrZbwHjqWRS_q9RFJ-MU',
  SHEET_NAME: 'Leads',
  NOTIFICATION_EMAIL: 'tad.taxiadvertising@gmail.com',
  REQUIRED_FIELDS: ['nombre', 'correo'],
  VERSION: '3.0-PRODUCTION-FIX'
};

const COLUMN_HEADERS = [
  'Timestamp', 'Nombre', 'Empresa', 'Puesto', 'Telefono', 'Correo',
  'Ciudad', 'Industria', 'Presupuesto', 'Tiene Agencia', 'Necesita Diseno',
  'Taxis', 'Espacios por Taxi', 'Duracion', 'Inversion Mensual', 'Inversion Total',
  'Tipo', 'Source', 'Fecha'
];

function doPost(e) {
  var startTime = Date.now();
  var requestId = generateRequestId();
  
  try {
    Logger.log('🚀 [' + requestId + '] POST recibido - TAD v' + CONFIG.VERSION);
    
    // Parse payload
    var payload = parsePayload(e, requestId);
    Logger.log('[' + requestId + '] Payload: ' + JSON.stringify(payload));
    
    // Validate required fields
    validateRequiredFields(payload, requestId);
    
    // Validate email
    validateEmail(payload.correo, requestId);
    
    // Sanitize data
    var sanitizedData = sanitizeData(payload, requestId);
    
    // Open spreadsheet
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = getOrCreateSheet(ss, requestId);
    
    // Build and save row
    var row = buildRow(sanitizedData, requestId);
    sheet.appendRow(row);
    
    Logger.log('[' + requestId + '] ✅ Lead guardado');
    
    // Send notification email
    try {
      sendNotificationEmail(sanitizedData, requestId);
    } catch (emailError) {
      Logger.log('[' + requestId + '] ⚠️ Email error: ' + emailError.message);
    }
    
    var executionTime = Date.now() - startTime;
    Logger.log('[' + requestId + '] ⏱️ Execution: ' + executionTime + 'ms');
    
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
    
    return jsonResponse({
      status: 'error',
      message: err.message,
      timestamp: new Date().toISOString(),
      requestId: requestId,
      executionTime: executionTime
    }, 500);
  }
}

function doGet(e) {
  return jsonResponse({
    status: 'success',
    message: 'Webhook activo - TAD Dominicana v' + CONFIG.VERSION,
    timestamp: new Date().toISOString()
  });
}

function parsePayload(e, requestId) {
  var data = {};
  
  // Method 1: FormData/URLSearchParams (e.parameter)
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    Logger.log('[' + requestId + '] 📦 Parsing e.parameter');
    return parseParameterData(e.parameter);
  }
  
  // Method 2: JSON body
  if (e && e.postData && e.postData.contents) {
    try {
      Logger.log('[' + requestId + '] 📦 Parsing JSON');
      data = JSON.parse(e.postData.contents);
      return normalizeKeys(data);
    } catch (jsonError) {
      Logger.log('[' + requestId + '] ⚠️ JSON parse failed');
    }
  }
  
  // Fallback
  return normalizeKeys(e);
}

function parseParameterData(params) {
  var data = {};
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var normalizedKey = normalizeKey(key);
      var value = params[key];
      data[normalizedKey] = Array.isArray(value) ? value.join(', ') : value;
    }
  }
  return data;
}

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
 * CRITICAL FIX: Preserva camelCase, solo quita acentos
 */
function normalizeKey(key) {
  if (!key) return '';
  return key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/[^a-zA-Z0-9]/g, '');      // Remove special chars but keep case
}

function validateRequiredFields(payload, requestId) {
  for (var i = 0; i < CONFIG.REQUIRED_FIELDS.length; i++) {
    var field = CONFIG.REQUIRED_FIELDS[i];
    var value = payload[field];
    if (!value || value.toString().trim() === '') {
      throw new Error('Falta campo requerido: ' + field);
    }
  }
}

function validateEmail(email, requestId) {
  if (!email || email.indexOf('@') === -1) {
    throw new Error('Email inválido: ' + email);
  }
}

function sanitizeData(data, requestId) {
  var sanitized = {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var value = data[key];
      if (typeof value === 'string') {
        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
        if (value.length > 500) value = value.substring(0, 500);
      }
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function getOrCreateSheet(ss, requestId) {
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log('[' + requestId + '] 📊 Creando sheet');
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(COLUMN_HEADERS);
    sheet.setFrozenRows(1);
    var headerRange = sheet.getRange(1, 1, 1, COLUMN_HEADERS.length);
    headerRange.setBackground('#4285F4');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
  }
  return sheet;
}

function buildRow(data, requestId) {
  var row = [
    new Date(),
    data.nombre || '',
    data.empresa || '',
    data.puesto || '',
    data.telefono || '',
    data.correo || '',
    data.ciudad || '',
    data.industria || '',
    data.presupuesto || '',
    data.tieneAgencia || '',
    data.necesitaDiseno || '',
    data.taxis || '',
    data.espaciosPorTaxi || '',
    data.duracion || '',
    data.inversionMensual || '',
    data.inversionTotal || '',
    data.tipo || 'anunciante',
    data.source || 'landing-anunciantes',
    data.fecha || new Date().toISOString()
  ];
  
  Logger.log('[' + requestId + '] 📋 Row: taxis=' + data.taxis + ', espacios=' + data.espaciosPorTaxi + ', duracion=' + data.duracion);
  return row;
}

function sendNotificationEmail(data, requestId) {
  var subject = '🚀 Nuevo Lead - TAD (' + data.nombre + ')';
  var body = [
    'NUEVO LEAD - TAD DOMINICANA',
    '================================',
    'Nombre: ' + data.nombre,
    'Empresa: ' + data.empresa,
    'Email: ' + data.correo,
    'Telefono: ' + (data.telefono || 'N/A'),
    '',
    'CAMPAÑA:',
    'Taxis: ' + (data.taxis || 'N/A'),
    'Espacios: ' + (data.espaciosPorTaxi || 'N/A'),
    'Duracion: ' + (data.duracion || 'N/A') + ' meses',
    'Inversion Mensual: RD$ ' + (data.inversionMensual || 'N/A'),
    'Inversion Total: RD$ ' + (data.inversionTotal || 'N/A'),
    '',
    'Request ID: ' + requestId
  ].join('\n');
  
  GmailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
}

function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateRequestId() {
  return 'req-' + Math.random().toString(36).substr(2, 9);
}
