readData('rpg.txt');
function readData(genre) {
    const fs = require('fs');
    const { join } = require("path");

    const relativePath = '../genres'; // Relative path to your text file
    const filename = join(__dirname, relativePath, genre);

    const titleArray = []; // Array to store game titles
    const urlArray = []; // Array to store game titles
    const priceLabelArray = []; // Array to store game titles
    const imageUrlArray = []; // Array to store game titles
    const esrbValueArray = []; // Array to store game titles

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const lines = data.split('\n');

        lines.forEach(line => {
            try {
                const jsonObj = JSON.parse(line);
                const title = jsonObj.title;
                const url = jsonObj.url;
                const priceLabel = jsonObj.priceLabel;
                const imageUrl = jsonObj.imageUrl;
                const esrbValue = jsonObj.esrbValue;
                titleArray.push(title); // Add 'title' value to the array
                urlArray.push(url); // Add 'url' value to the array
                priceLabelArray.push(priceLabel); // Add 'url' value to the array
                imageUrlArray.push(imageUrl); // Add 'imageUrl' value to the array
                esrbValueArray.push(esrbValue); // Add 'esrbValue' value to the array
            } catch (error) {
                console.error('Invalid JSON format:', error);
            }
        });

        console.log(titleArray[0]); // Output the array of game titles
        console.log(urlArray[0]); // Output the array of game url
        console.log(priceLabelArray[0]); // Output the array of game price
        console.log(imageUrlArray[0]); // Output the array of game image
        console.log(esrbValueArray[0]); // Output the array of game esrbValue
       let gameName=titleArray[0]
       let gameUrl=urlArray[0]
       let gamePrice=priceLabelArray[0]
        let gameImage=imageUrlArray[0]
        let gameEsrb=esrbValueArray[0]


    });
}


