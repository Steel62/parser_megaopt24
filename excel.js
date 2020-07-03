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

    const columnWidths = [85, 10, 30, 50, 50];
    for (let column = 1; column <= columnWidths.length; column++){
        workSheet.column(column).setWidth(columnWidths[column-1]);
    }


    let row = 1;
    dataArray.forEach(item =>{
        let column = 1;
        for(let key in item){
            workSheet.cell(row, column).string(item[key]).style(style);
            column++;
        }
        row++;
    });

        workBook.write(fileName, (err) => {
            if(err){
                console.log(`Не удалось сохранить таблицу excel:`);
                console.log(err);
            } else {
                console.log(`Данные успешно сохранены в ${fileName}`);
            }
        });
}



module.exports.saveToExcel = saveToExcel;