const excel = require('excel4node');



//сохранение массива в xlsx-файл
function saveToExcel(dataArray, fileName) {
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet('Результат парсинга');
    const style = workBook.createStyle({
        font: {
            color: '#000000',
            size: 12,
        }
    });

    // for (let counter = 0; counter < dataArray.length; counter++){
    //     workSheet.cell(counter + 1, 1).string(dataArray[counter].name).style(style);
    //     workSheet.cell(counter + 1, 2).string(dataArray[counter].image).style(style);
    //     workSheet.cell(counter + 1, 3).string(dataArray[counter].price).style(style);
    //     workSheet.cell(counter + 1, 4).string(dataArray[counter].link).style(style);
    // }

    let row = 1;
    dataArray.forEach(item =>{
        let column = 1;
        for(let key in item){
            workSheet.cell(row, column).string(item[key]).style(style);
            column++;
        }
        row++;
    });

    try {
        workBook.write(fileName);
        console.log(`Данные успешно сохранены в ${fileName}`);
        return true;
    }
    catch (e) {
        console.log(`Не удалось сохранить таблицу excel: ${e.message}`);
        return false;
    }
}

module.exports.saveToExcel = saveToExcel;