(async function() {
    const fetch = require('./fetch');
    const save = require('./excel');
    const parse = require('./parse');



    const state = {
        catalogLinks: [],
        parcedObjects: [],

    };

    const domain = 'https://megaopt24.ru';
    const outputFileName = 'result.xlsx';



    let html = await fetch.getHTML(domain);

    state.catalogLinks.push(...parse.getCatalogLinks(html, domain));
    for(let catalogLink of state.catalogLinks){
        console.log(`Парсинг  ${catalogLink}`);
        html = await fetch.getHTML(catalogLink);
        const pageLinks = parse.getPageLinks(html, domain);
        let resultObjects;
        if(pageLinks.length <= 1){
            resultObjects = parse.parseCards(html, domain);
            resultObjects.length && (state.parcedObjects.push(...resultObjects));
        } else {
            pageLinks.forEach(async pageLink => {
                html = await fetch.getHTML(pageLink);
                resultObjects = parse.parseCards(html, domain);
                resultObjects.length && (state.parcedObjects.push(...resultObjects));
            });
        }

    }
    console.log(`Парсинг товаров завершен. Получено ${state.parcedObjects.length} позиций. Сохранение...`);

    save.saveToExcel(state.parcedObjects, outputFileName);
}());






