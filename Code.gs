// ============================================
// GOOGLE APPS SCRIPT - TAD DOMINICANA
// Landing Page Anunciantes Webhook
// ============================================
// 
// INSTRUCCIONES DE DEPLOY:
// 1. Abre https://script.google.com/
// 2. Crea nuevo proyecto
// 3. Pega este código en Code.gs
// 4. Click en "Implementar" → "Nueva implementación"
// 5. Tipo: "Aplicación web"
// 6. Quién tiene acceso: "Cualquier usuario"
// 7. Click en "Implementar"
// 8. Copia la URL del webhook
// ============================================

// URL de la hoja de cálculo (reemplaza con tu ID)
const SPREADSHEET_ID = "TU_SPREADSHEET_ID_AQUI"; // <-- PON TU ID AQUÍ
const SHEET_NAME = "Leads";

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Habilitar CORS para todas las origins
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    // Manejar preflight OPTIONS request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }
    
    // Parsear datos entrantes (soporta múltiples formatos)
    let data = parsePayload(e);
    
    Logger.log('Datos recibidos: ' + JSON.stringify(data));
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'empresa', 'telefono', 'correo'];
    for (let field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return createResponse({
          success: false,
          error: 'Campo requerido faltante: ' + field
        }, headers);
      }
    }
    
    // Validar email
    if (!isValidEmail(data.correo)) {
      return createResponse({
        success: false,
        error: 'Email inválido'
      }, headers);
    }
    
    // Obtener o crear la hoja
    const sheet = getSheet();
    
    // Obtener headers de la hoja
    const headers = getSheetHeaders(sheet);
    
    // Construir registro según headers
    const record = buildRecord(data, headers);
    
    // Agregar fila
    sheet.appendRow(record);
    
    Logger.log('Fila agregada exitosamente: ' + JSON.stringify(record));
    
    // Enviar email de notificación (opcional)
    // enviarEmailNotificacion(data);
    
    return createResponse({
      success: true,
      message: 'Lead guardado exitosamente',
      timestamp: new Date().toISOString(),
      data: record
    }, headers);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    return createResponse({
      success: false,
      error: error.toString()
    }, headers);
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function parsePayload(e) {
  let data = {};
  
  // Intentar parsear como JSON primero
  if (e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log('Parseado como JSON');
      return normalizeKeys(data);
    } catch (ex) {
      Logger.log('No es JSON válido, intentando form-urlencoded');
    }
  }
  
  // Si no, usar e.parameter (form-urlencoded)
  if (e.parameter) {
    for (let key in e.parameter) {
      data[key] = e.parameter[key];
    }
    Logger.log('Parseado como form-urlencoded');
    return data;
  }
  
  return data;
}

function normalizeKeys(obj) {
  const normalized = {};
  for (let key in obj) {
    // Convertir a minúsculas y quitar acentos
    const normalizedKey = key.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n');
    normalized[normalizedKey] = obj[key];
  }
  return normalized;
}

function getSheet() {
  let ss;
  
  if (SPREADSHEET_ID && SPREADSHEET_ID !== 'TU_SPREADSHEET_ID_AQUI') {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Crear headers por defecto
    const defaultHeaders = [
      'Timestamp', 'Nombre', 'Empresa', 'Puesto', 'Telefono', 'Correo',
      'Ciudad', 'Industria', 'Presupuesto', 'Tiene Agencia', 'Necesita Diseno',
      'Taxis', 'Espacios por Taxi', 'Duracion', 'Inversion Mensual', 'Inversion Total',
      'Tipo', 'Source'
    ];
    sheet.appendRow(defaultHeaders);
  }
  
  return sheet;
}

function getSheetHeaders(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    return [];
  }
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function buildRecord(data, headers) {
  const record = [];
  const now = new Date();
  
  // Mapeo de campos del formulario a columns de la hoja
  const fieldMapping = {
    'timestamp': now,
    'nombre': getValue(data, ['nombre', 'name', 'full_name'], ''),
    'empresa': getValue(data, ['empresa', 'company', 'business'], ''),
    'puesto': getValue(data, ['puesto', 'position', 'job_title', 'cargo'], ''),
    'telefono': getValue(data, ['telefono', 'phone', 'telefono', 'celular'], ''),
    'correo': getValue(data, ['correo', 'email', 'correo_electronico', 'e-mail'], ''),
    'ciudad': getValue(data, ['ciudad', 'city', 'ubicacion'], ''),
    'industria': getValue(data, ['industria', 'industry', 'sector'], ''),
    'presupuesto': getValue(data, ['presupuesto', 'budget', 'presupuesto_mensual'], ''),
    'tiene agencia': getValue(data, ['tieneagencia', 'tiene_agencia', 'has_agency', 'agencia'], ''),
    'necesita diseno': getValue(data, ['necesitadiseno', 'necesita_diseno', 'needs_design', 'diseno'], ''),
    'taxis': getValue(data, ['taxis', 'num_taxis', 'cantidad_taxis'], '0'),
    'espacios por taxi': getValue(data, ['espaciosportaxi', 'espacios_por_taxi', 'spaces_per_taxi', 'espacios'], '1'),
    'duracion': getValue(data, ['duracion', 'duration', 'meses'], '1'),
    'inversion mensual': getValue(data, ['inversionmensual', 'inversion_mensual', 'monthly_investment'], '0'),
    'inversion total': getValue(data, ['inversiontotal', 'inversion_total', 'total_investment'], '0'),
    'tipo': getValue(data, ['tipo', 'type', 'lead_type'], 'anunciante'),
    'source': getValue(data, ['source', 'fuente', 'origin'], 'landing-anunciantes')
  };
  
  // Construir array según orden de headers
  for (let header of headers) {
    const headerLower = header.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    for (let key in fieldMapping) {
      const keyNormalized = key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (headerLower === keyNormalized || headerLower === key.replace(/\s/g, '')) {
        record.push(fieldMapping[key]);
        break;
      }
    }
    // Si no hay match, agregar vacío
    if (record.length === 0 || record[record.length - 1] === undefined) {
      record.push('');
    }
  }
  
  return record;
}

function getValue(data, keys, defaultValue) {
  for (let key of keys) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      return data[key];
    }
  }
  return defaultValue;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function createResponse(data, headers) {
  const json = JSON.stringify(data);
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

function enviarEmailNotificacion(data) {
  try {
    const email = 'tad.taxiadvertising@gmail.com';
    const subject = 'Nuevo Lead - Anunciante: ' + data.empresa;
    const body = `
      Nuevo lead recibido desde la landing page de anunciantes:
      
      Nombre: ${data.nombre}
      Empresa: ${data.empresa}
      Puesto: ${data.puesto}
      Teléfono: ${data.telefono}
      Email: ${data.correo}
      Ciudad: ${data.ciudad}
      Industria: ${data.industria}
      
      Detalles de la campaña:
      - Taxis: ${data.taxis}
      - Espacios por taxi: ${data.espaciosPorTaxi}
      - Duración: ${data.duracion} meses
      - Inversión mensual: RD$ ${data.inversionMensual}
      - Inversión total: RD$ ${data.inversionTotal}
      
      Fecha: ${new Date().toLocaleString('es-DO')}
    `;
    
    MailApp.sendEmail(email, subject, body);
    Logger.log('Email de notificación enviado');
  } catch (error) {
    Logger.log('Error enviando email: ' + error.toString());
  }
}
