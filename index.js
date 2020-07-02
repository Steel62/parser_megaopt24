(async function() {
    const fetch = require('node-fetch');
    const cheerio = require('cheerio');

    const state = {
        catalogLinks: [],
        parcedObjects: [],

    };

    const domain = 'https://megaopt24.ru';

    async function getHTML(url) {
        try {
            const responce = await fetch(url);
            return await responce.text();
        }
        catch (e) {
            console.log(`Что-то пошло не так. Проверьте соединение с Интернетом. ${e.message}`);
            return false;
        }

    }

    function parseLinkCatalog(HTMLString) {
        const ch = cheerio.load(HTMLString);
        result = [];
        ch('.dropdown-menu').find('a').each((index, elem) =>{
            result.push(ch(elem).attr('href'));
        });
        return result;
    }

    function parseCards(HTMLString) {
        const result = [];
        const ch = cheerio.load(HTMLString);
        ch('.b-goods').each((index, elem) => {
            const obj = {};
            obj.name = ch(elem).find('.b-goods__name > a').text().trim();
            obj.price = ch(elem).find('.b-goods__price-1').text().trim();
            obj.link = ch(elem).find('.b-goods__name > a').attr('href');
            obj.image = ch(elem).find('.b-img-height').attr('src');
            result.push(obj);
        });
        return result;
    }

    function parseLinkPage(HTMLString) {
        const ch = cheerio.load(HTMLString);
        const result = [];
        ch('.b-pagination').first().find('a').each((index, elem)=>{
            result.push(ch(elem).attr('href'));
        });
        return result;
    }

    function buildFullLink(domain, pathArray) {
        return pathArray.map(item =>domain + item)
    }

    //вернет массив ссылок на разделы каталога
    function getCatalogLinks(HTMLString, domain) {
        return buildFullLink(domain, parseLinkCatalog(HTMLString));
    }

    //вернет массив ссылок на страницы раздела каталога
    function getPageLinks(HTMLString, domain){
        return buildFullLink(domain, parseLinkPage(HTMLString))
    }

    let html = await getHTML(domain);

    state.catalogLinks = state.catalogLinks.concat(getCatalogLinks(html, domain));
    for(let catalogLink of state.catalogLinks){
        console.log(`Парсинг  ${catalogLink}`);
        html = await getHTML(catalogLink);
        const pageLinks = getPageLinks(html, domain);
        let resultObjects;
        if (pageLinks.length <= 1){
            resultObjects = parseCards(html);
            resultObjects.length && (state.parcedObjects = state.parcedObjects.concat(resultObjects));
        } else {
            for(let pageLink of pageLinks){
                html = await getHTML(pageLink);
                resultObjects = parseCards(html);
                resultObjects.length && (state.parcedObjects = state.parcedObjects.concat(resultObjects));
            }
        }
    }
}());






