/**
 * TAD Dominicana - Webhook para Leads
 * Versión ULTRA-SIMPLE - Sin errores
 */

function doPost(e) {
  try {
    // Abrir spreadsheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads');
    
    // Crear sheet si no existe
    if (!sheet) {
      sheet = ss.insertSheet('Leads');
      // Agregar headers
      sheet.appendRow([
        'Timestamp', 'Nombre', 'Empresa', 'Puesto', 'Telefono', 'Correo',
        'Ciudad', 'Industria', 'Presupuesto', 'Tiene Agencia', 'Necesita Diseno',
        'Taxis', 'Espacios por Taxi', 'Duracion', 'Inversion Mensual',
        'Inversion Total', 'Tipo', 'Source', 'Fecha'
      ]);
    }
    
    // Obtener datos
    var data = e.parameter;
    
    // Guardar fila
    sheet.appendRow([
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
    ]);
    
    // Retornar éxito
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    // Retornar error
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok', message: 'Webhook activo'}))
    .setMimeType(ContentService.MimeType.JSON);
}
