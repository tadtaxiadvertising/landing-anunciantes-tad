/**
 * ============================================================================
 * TAD DOMINICANA - WEBHOOK DE CAPTURA DE LEADS
 * ============================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 
 * 1. Abrir https://script.google.com/
 * 2. Crear nuevo proyecto o abrir existente
 * 3. Borrar TODO el código existente
 * 4. Copiar y pegar ESTE CÓDIGO COMPLETO
 * 5. Guardar (Ctrl+S o ícono diskette)
 * 6. Click "Implementar" → "Nueva implementación"
 * 7. Tipo: "Aplicación web"
 * 8. Descripción: "TAD Webhook v4.0 PRODUCTION"
 * 9. Ejecutar como: "Yo" (tu cuenta)
 * 10. Quién tiene acceso: "Cualquier usuario"
 * 11. Click "Implementar"
 * 12. Autorizar permisos (Google → Configuración avanzada → Ir a proyecto (inseguro))
 * 13. Copiar URL de la aplicación web
 * 14. Actualizar en index.html (línea ~540)
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
  VERSION: '4.0-PRODUCTION-FINAL'
};

// ============================================
// COLUMNAS DE GOOGLE SHEETS
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
    Logger.log('🚀 [' + requestId + '] POST recibido - TAD v' + CONFIG.VERSION);
    Logger.log('========================================');
    Logger.log('[' + requestId + '] Timestamp: ' + new Date().toISOString());
    
    // 1. PARSEAR PAYLOAD (soporta múltiples formatos)
    var payload = parsePayload(e, requestId);
    Logger.log('[' + requestId + '] Payload: ' + JSON.stringify(payload));
    
    // 2. VALIDAR CAMPOS REQUERIDOS
    validateRequiredFields(payload, requestId);
    
    // 3. VALIDAR EMAIL
    validateEmail(payload.correo, requestId);
    
    // 4. SANITIZAR DATOS (XSS prevention)
    var sanitizedData = sanitizeData(payload, requestId);
    
    // 5. ABRIR SPREADSHEET
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    
    // 6. OBTENER/CREAR SHEET
    var sheet = getOrCreateSheet(ss, requestId);
    
    // 7. CONSTRUIR FILA (19 columnas exactas)
    var row = buildRow(sanitizedData, requestId);
    Logger.log('[' + requestId + '] Fila: ' + row.length + ' columnas');
    
    // 8. GUARDAR EN SHEETS
    sheet.appendRow(row);
    Logger.log('[' + requestId + '] ✅ Lead guardado exitosamente');
    
    // 9. ENVIAR EMAIL (opcional, no falla si error)
    try {
      sendNotificationEmail(sanitizedData, requestId);
      Logger.log('[' + requestId + '] 📧 Email enviado');
    } catch (emailError) {
      Logger.log('[' + requestId + '] ⚠️ Email error: ' + emailError.message);
    }
    
    // 10. RETORNAR ÉXITO
    var executionTime = Date.now() - startTime;
    Logger.log('[' + requestId + '] ⏱️ Execution: ' + executionTime + 'ms');
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
// ENTRY POINT - GET (health check)
// ============================================
function doGet(e) {
  return jsonResponse({
    status: 'success',
    message: 'Webhook activo - TAD Dominicana v' + CONFIG.VERSION,
    timestamp: new Date().toISOString(),
    spreadsheet: CONFIG.SPREADSHEET_ID,
    sheet: CONFIG.SHEET_NAME,
    instructions: 'Use POST to submit leads'
  });
}

// ============================================
// PARSEO DE PAYLOAD (robusto, múltiples formatos)
// ============================================
function parsePayload(e, requestId) {
  var data = {};
  
  // Método 1: FormData/URLSearchParams (e.parameter) - RECOMENDADO
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    Logger.log('[' + requestId + '] 📦 Parsing: e.parameter (FormData/URLSearchParams)');
    return parseParameterData(e.parameter);
  }
  
  // Método 2: JSON body (e.postData.contents)
  if (e && e.postData && e.postData.contents) {
    try {
      Logger.log('[' + requestId + '] 📦 Parsing: JSON body');
      data = JSON.parse(e.postData.contents);
      return normalizeKeys(data);
    } catch (jsonError) {
      Logger.log('[' + requestId + '] ⚠️ JSON parse failed: ' + jsonError.message);
    }
  }
  
  // Método 3: Fallback (e.parameters)
  if (e && e.parameters) {
    Logger.log('[' + requestId + '] 📦 Parsing: e.parameters fallback');
    return parseParametersFallback(e.parameters);
  }
  
  // Fallback final
  Logger.log('[' + requestId + '] ⚠️ Usando e directo como fallback');
  return normalizeKeys(e);
}

// ============================================
// PARSEO DE PARAMETROS
// ============================================
function parseParameterData(params) {
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

// Fallback para e.parameters
function parseParametersFallback(params) {
  var data = {};
  
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var normalizedKey = normalizeKey(key);
      var value = params[key];
      
      // e.parameters[key] es array, tomar primer elemento
      if (Array.isArray(value) && value.length > 0) {
        data[normalizedKey] = value[0];
      } else if (!Array.isArray(value)) {
        data[normalizedKey] = value;
      }
    }
  }
  
  return data;
}

// ============================================
// NORMALIZACIÓN DE KEYS
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
 * CRÍTICO: Normaliza keys preservando camelCase
 * - "espaciosPorTaxi" → "espaciosPorTaxi" ✅
 * - "EspaciosPorTaxi" → "EspaciosPorTaxi" ✅
 * - "espacios_por_taxi" → "espaciosportaxi" ✅
 * 
 * NO convierte a lowercase para mantener compatibilidad
 */
function normalizeKey(key) {
  if (!key) return '';
  
  // 1. Normalizar unicode (quitar acentos)
  // 2. Remover caracteres especiales
  // 3. PRESERVAR camelCase
  return key
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
    .replace(/[^a-zA-Z0-9]/g, '');     // Quitar especiales, mantener case
}

// ============================================
// VALIDACIÓN
// ============================================
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

function validateEmail(email, requestId) {
  if (!email || email.indexOf('@') === -1) {
    Logger.log('[' + requestId + '] ❌ Email inválido: ' + email);
    throw new Error('Email inválido: ' + email);
  }
  
  Logger.log('[' + requestId + '] ✅ Email válido: ' + email);
}

// ============================================
// SANITIZACIÓN (XSS Prevention)
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
                     .trim();
        
        // Limit length
        if (value.length > 500) {
          value = value.substring(0, 500);
        }
      }
      
      sanitized[key] = value;
    }
  }
  
  Logger.log('[' + requestId + '] ✅ Datos sanitizados');
  return sanitized;
}

// ============================================
// GESTIÓN DE SHEETS
// ============================================
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
    
    // Ajustar anchos
    adjustColumnWidths(sheet);
    
    Logger.log('[' + requestId + '] ✅ Sheet creado');
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
// CONSTRUCCIÓN DE FILA
// ============================================
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
  
  Logger.log('[' + requestId + '] 📋 Fila construida: ' + row.map(function(v, i) {
    return COLUMN_HEADERS[i] + '=' + (typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : v);
  }).join(' | '));
  
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
// UTILIDADES
// ============================================
function jsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  if (statusCode) {
    output.setHttpStatusCode(statusCode);
  }
  
  return output;
}

function generateRequestId() {
  return 'req-' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// FIN DEL CÓDIGO
// ============================================
