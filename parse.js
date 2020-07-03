const cheerio = require('cheerio');



//вернет массив относительных путей из каталога
function parseLinkCatalog(HTMLString) {
    const ch = cheerio.load(HTMLString);
    result = [];
    ch('.dropdown-menu').find('a').each((index, elem) =>{
        result.push(ch(elem).attr('href'));
    });
    return result;
}

//вернет массив объектов с данными. Каждый объект парсится с одной карточки товара
function parseCards(HTMLString, domain) {
    const result = [];
    const ch = cheerio.load(HTMLString);
    let category = ch('.b-title-catalog').text().trim();
    if (category.endsWith('оптом')){
        category = category.slice(0, category.indexOf('оптом', 0));
        category = category.trim();
    }
    ch('.b-goods').each((index, elem) => {
        const obj = {};
        obj.name = ch(elem).find('.b-goods__name > a').text().trim();
        obj.price = ch(elem).find('.b-goods__price-1').text().trim();
        obj.category = category;
        obj.link = domain + ch(elem).find('.b-goods__name > a').attr('href');
        obj.image = ch(elem).find('.b-img-height').attr('src');

        obj.name && result.push(obj);
    });
    return result;
}

//вернет массив относительных путей на все страницы с пагинации
function parseLinkPage(HTMLString) {
    const ch = cheerio.load(HTMLString);
    const result = [];
    ch('.b-pagination').first().find('a').each((index, elem)=>{
        result.push(ch(elem).attr('href'));
    });
    return result;
}

//вернет массив ссылок на разделы каталога
function getCatalogLinks(HTMLString, domain) {
    return parseLinkCatalog(HTMLString).map(path => domain + path);
}

//вернет массив ссылок на страницы раздела каталога
function getPageLinks(HTMLString, domain){
    return parseLinkPage(HTMLString).map(path => domain + path);
}



module.exports = {
    getCatalogLinks,
    getPageLinks,
    parseCards,
};