const xlsx = require('xlsx');
const path = require('path');
/* module.exports = {

    excel: function (req, res, next) {
        console.log('777777777777777');
        const xlsxPath = path.resolve(__dirname, '../public');
        let workbook = xlsx.readFile(xlsxPath + "/" + 'xlsx/text.xlsx');
        let sheetNames = workbook.SheetNames;
        let sheet = workbook.Sheets[sheetNames[0]];
        let data = xlsx.utils.sheet_to_json(sheet);
        console.log('444444444');
        console.log(data);
        res.json(data);

    }
} */
module.exports = function excel(filePath, callback){
    const xlsxPath = path.resolve(__dirname, '../public');
    let workbook = xlsx.readFile(xlsxPath + "/" + 'xlsx/' + filePath);
    let sheetNames = workbook.SheetNames;
    let sheet = workbook.Sheets[sheetNames[0]];
    let data = xlsx.utils.sheet_to_json(sheet);
    callback(data)
}