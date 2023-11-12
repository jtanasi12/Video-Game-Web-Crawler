const PORT = 8000;

// Requirements
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');


// This is considered polite so that we don't get mistake as a Denial of Service Attack
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// This is considered to be polite to include our scraper name
const axiosConfig = {
    headers: {
        'User-Agent': 'CS 560 Gamespot Web Scraper',
    },
};
// Url with the top rating 
const gamespotTopRating = 'https://www.gamespot.com/games/reviews/?sort=gs_score_desc';

// Grabs the user filter and will apphend it so that the user can choose what genre they want to scrap
// This is an example using action 
const userFilter = '&review_filter_type%5Bplatform%5D=&review_filter_type%5Bgenre%5D=4&review_filter_type%5BtimeFrame%5D=&review_filter_type%5BstartDate%5D=&review_filter_type%5BendDate%5D=&review_filter_type%5BminRating%5D=&review_filter_type%5Btheme%5D=&review_filter_type%5Bregion%5D=&___review_filter_type%5Bpublishers%5D=&___review_filter_type%5Bdevelopers%5D=&review_filter_type%5Bletter%5D=';


// Base URL
const gamespotBase = 'https://www.gamespot.com';

const numberOfPages = 5; // The number of pages we want to traverse in GameSpot

// Store the items into an array
// This will hold objects with two attributes: title & url
const gameList = [];

// Middleware
const app = express();

// ***** SCRAP THE VIDEOGAMES GATHERING LINKS FROM THE PAGES *****

const scrapPages = async (pageNumber) => {
    try {
        // Perform an HTTP get request and dynamically append the page number
        const response = await axios.get(`${gamespotTopRating + userFilter}&page=${pageNumber}`);

        // Axios automatically converts the data into JSON
        const html = response.data;

        // Allows us to easily parse through the data
        const cheerioParse = cheerio.load(html);

        // Search for .card-item__link classes and grab the text and URL
        cheerioParse('.card-item__link').each((index, element) => {
            const title = cheerioParse(element).text();
            const url = cheerioParse(element).attr('href');

            gameList.push({ title, url });
        });

        // Tell us what page we are scraping from
        console.log(`Data scraped from page ${pageNumber}`);

        // ****** VERY IMPORTANT ******
        // This ensures for one page to finish scrapping, before we advanced to the next page 
        // Then once its done, we advance the page number and continue to the next page/calling the function over
        if (pageNumber < numberOfPages) {
            await delay(1000); // Introduce a 1-second delay
            await scrapPages(pageNumber + 1);
        }
    } catch (error) {
        console.error(`Error scraping page ${pageNumber}:`, error);
    }
};

// ***** SCRAPING RATINGS AFTER THE LIST HAS BEEN CREATED *****
// Above we created a list of urls from the homepage, now we individually go to each link and grab the rating
const scrapRating = async (videoGame) => {
    try {
        const response = await axios(gamespotBase + videoGame.url);
        const html = response.data;
        const cheerioParse = cheerio.load(html);

        const rating = cheerioParse('.review-ring-score__score').text();

        console.log(`Rating for ${videoGame.title}: ${rating}`);

        await delay(1000); // Introduce a 1-second delay
    } catch (error) {
        console.error(`Error scraping rating for ${videoGame.title}:`, error);
    }
};

scrapPages(1)
    .then(async () => {
        console.log(`Number of games: ${gameList.length}`);
        
        // By awaiting we ensure that we scrap the games in order! 
        for (let gameIndex = 0; gameIndex < gameList.length; ++gameIndex) {
            await scrapRating(gameList[gameIndex]);
        }

        // Listen to port which is hardcoded to 8000
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    });
