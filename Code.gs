function doGet(){
  return HtmlService.createTemplateFromFile("index").evaluate();
}

function getCalc(){
  return HtmlService.createTemplateFromFile('calc').evaluate();
}

function testCrunch(){
  crunch('9+9');
}

function crunch(expression){
  Logger.log(expression);
  Logger.log(eval(expression).toString());
  return eval(expression).toString();
}
  

function processForm(form){
  var sheetId = '17mS0QOT32s2pA5xatFNDDR9dsLi4s3KeKGHg88JY6Dw';
  Logger.log("Form response:");
  Logger.log(form);
  
  var date = form['sunday-date'];
  delete form['sunday-date'];
  var treasurers = form['treasurer'];
  delete form['treasurer'];
  var records = [];
  var total = 0;
  for(var record in form){
    var data = form[record];
    var newRecord = {
      date: date,
      treasurer1: treasurers[0],
      treasurer2: treasurers[1]
    }
    if(record == 'cash'){
      newRecord.type = 'Cash';
      newRecord.amount = data;
      newRecord.name = null;
      newRecord.checkNumber = null;
      newRecord.checkDate = null;
      newRecord.checkAddress = null;
      total += Number(data);
    } else {
      newRecord.type = 'Check',
      newRecord.amount = Number(data[1]);
      newRecord.name = data[0];
      newRecord.checkNumber = data[2];
      newRecord.checkDate = data[3];
      newRecord.checkAddress = data[4];
      total += Number(data[1]);
    }
    records.push(newRecord);
  }
  
  Logger.log(records);

  if(total>0){
    var ss = SpreadsheetApp.openById(sheetId).getSheets()[0];
    submitToSpreadsheet(ss, records);
  }

  return total;
}  

function submitToSpreadsheet(sheet, data){
  var newRow = sheet.getLastRow() + 1;
  var headersRange = sheet.getRange(1, 1, 1, 9);
  //timestamp name type amount checkNo checkDate checkAddress treasurer 
  Utilities.setRowsData(sheet, data, headersRange, newRow);
}
