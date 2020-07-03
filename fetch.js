const fetch = require('node-fetch');


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

module.exports.getHTML = getHTML;