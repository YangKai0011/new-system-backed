const xlsx = require('xlsx');
const path = require('path');
module.exports = function excel(filePath, callback){
    const xlsxPath = path.resolve(__dirname, '../public');
    let workbook = xlsx.readFile(xlsxPath + "/" + 'xlsx/' + filePath);
    let sheetNames = workbook.SheetNames;
    console.log(sheetNames);
    console.log('1111111111');
    let sheet = workbook.Sheets[sheetNames[0]];
    console.log(sheet);
    
    let data = xlsx.utils.sheet_to_json(sheet);
    callback(data)
}