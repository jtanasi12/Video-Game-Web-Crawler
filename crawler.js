
// Requirements
const puppeteer = require('puppeteer');
const express = require('express');
const fs = require('fs');


// ************ Variable Declarations ************ 
const baseUrl = 'https://www.gamestop.com/video-games';
const platform = '/xbox-one';
const genre = '/racing';
const filter = '?srule=price-high-to-low';
let   pageNumber = 1; // Default to 0
const userAgent = 'CS560 Gamestop Project'; // This is considered polite 
const PORT = 8000;
const gameList = []; // A list of videgame objects 
const gamesPerPage = 20;
const pagePositionTotal = 100; // The number of pages we want to traverse in GameSpot. 100 equals 5 pages with gamestops metrics

// This is considered polite so that we don't get mistaken as a Denial of Service Attack
// We can set delays while we scrap 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// ***********************************************

// Middleware
const app = express();

// ***** SCRAP THE VIDEOGAMES GATHERING LINKS FROM THE PAGES *****

const scrapPages = async (pagePosition) => {

    //concanate all the appropriate urls together 
   // https://www.gamestop.com/video-games/xbox-one?srule=price-high-to-low&start=0&sz=20

    const url = `${baseUrl}${platform}${genre}${filter}&start=${pagePosition}&sz=20`;

  //  console.log(`${baseUrl}${platform}${genre}${filter}&start=${pagePosition}&sz=20`);


    /*  - Puputeer is used because GameStop dynamically loads HTML via javascript meaning it's not static 
         It creates a new instance of the browser we are scraping, so that the browser is in a  clean slate with no previous cookies. */

    let browser; 
    
    try {
      https://www.gamestop.com/video-games/xbox-one/action?srule=price-high-to-low&start=0&sz=20

      browser = await puppeteer.launch({ headless: 'new' }); // Create a new instance of browser/non-visible
      const page = await browser.newPage(); // Loads the new browser 
      await page.setUserAgent(userAgent); // Considered polite 
      await page.goto(url); // Attach the new browswer instance with the url we want to scrap
    
   
      // An array or promises - which are used for async operations. Its an object that tells us
      // if the code operation is pending, succeeded, or failed. And we can build off of this. Example: 
      // Only do this code, if the previous code in the promise has succeeded. So when the promise resolves() the data object reference gets returned 
      const promises = [];

      // We iterate 20 times, the amount of games per page 
      for (let index = 0; index < gamesPerPage; index++) {

        // When page.evaluate() is called we create a new instance of our current browser to scrap 
        // We then attach the appropriate url. It is stored in a promise. The data array is send to 
        // the promise only if the page.evaluate() code succeeds 
          const promise = page.evaluate((currentIndex) => {

                // A nodelist of all the elements with this classname
              const videoGames = document.querySelectorAll('.product-tile-link');
              let data;
              
              // We will scrap one individual item at a time based on the index 
              const game = videoGames[currentIndex];
              const url = game.href; // URL to the invidiual game
              const title = game.getAttribute('title'); // The games title

              data = {url, title};// This a reference to an object holding title & url 

              return data; // Return the dataList because this data is stored into the new instance 
              // of the browser and we want to return it back to nodejs 

          }, index); // <--- We are passing in index to the new browser


          // Each promise object gets stored onto the promises array
          promises.push(promise);
        
          await delay(500); // This is polite to wait 1 second between each time we scrap 

          // Console log the current promise, keep this in the for loop so it displays with 1 second delay
          promise.then((result) => {
             console.log(result);
          });

      } // End of for loop 
      
      // When all the promises are resolved (after the for loop completes) we will pass into our gameList
      const browserScrapArray = await Promise.all(promises);

      // Pass the result of each promise into our gameList
      browserScrapArray.forEach((result) => {

        gameList.push({ title: `${result.title}`, url: `${result.url}`});
      });

     // Only for testing purposes ---> console.log(gameList);
    
    
     // Tell us what page we are scraping from
    console.log(`Data scraped from page ${pageNumber}`);


     pagePosition += 20; // Increase the position by 20, this will take us to the next page
     pageNumber++; // Advance the page Number in the form of - (1,2,3,4,5)

     if(pagePosition < pagePositionTotal){
        await browser.close(); // Close the browser after scraping a page
        await scrapPages(pagePosition); // Increase the page number until reach 5 pages 
        // to get to the next page we have to add 20
     }

} // End of Try statement
        catch (error) {
            console.error('Error during scraping:', error);
            throw error;
        } 
        finally {

            if (browser) {
            await browser.close();
            }
        }
}   // End of scrapPage function 


// ***** SCRAPING RATINGS AFTER THE LIST HAS BEEN CREATED *****
const scrapGameUrl = async (videoGame) => {


    let browser; 

    try {

        browser = await puppeteer.launch({ headless: 'new' }); // Create a new instance of browser/non-visible
        const page = await browser.newPage(); // Loads the new browser 
        await page.setUserAgent(userAgent); // Considered polite 
        await page.goto(videoGame.url); // Attach the new browswer instance with the url we want to scrap

        // **************************************************
     
        // $eval is a shorter version of page.evaluate(). We use it because we are grabbing one type of element per page
        // Example: In scrapPages we have an element .product-tile-link' and inside that HTML element we want to grab 
        // the title and url not just one element. page.evaluate() is used if you need to run a loop insde of it as well 

       
        try{
            await page.waitForSelector('.actual-price', { timeout: 5000 });

            const priceLabel = await page.$eval('.actual-price', (price) => {
                return price.innerText.trim();
              });

              console.log(priceLabel);
              videoGame.priceLabel = priceLabel;

        }
        catch{
            console.log(`ERROR SCRAPING COULDNT FIND PRICE`)
            videoGame.priceLabel = 'N/A';
        }

        try{

            await page.waitForSelector('.zoomImg', { timeout: 5000 });

            await page.waitForSelector('.zoomImg');
            const imageUrl = await page.$eval('.zoomImg', (img) => {
              return img.src;
            });

            console.log('Image URL:', imageUrl);
            videoGame.imageUrl = imageUrl;
    
        }
      catch{
        console.log(`ERROR SCRAPING COULDNT FIND IMAGE}`)
        videoGame.priceLabel = 'N/A';
      }
        
      try{
        await page.waitForSelector('.actual-price', { timeout: 5000 });
        
        const esrbValue = await page.$eval('.esrb-value', (span) => {
          return span.innerText.trim();
        });

        console.log('ESRB Value:', esrbValue);
        videoGame.esrbValue = esrbValue;

      }
      catch{
        console.log(`ERROR SCRAPING COULDNT FIND ESRB VALUE}`)
        videoGame.esrbValue = 'N/A';
      }

       // **************************************************

    }
    catch (error) {
        console.error('Error during scraping:', error);
        throw error;
    } finally {
        if (browser) {
          // Ensure that the browser is closed only after the promise is resolved
          await browser.close();
        }
      }
}  
  
// This is a recursive function, that will be called 5 times to load 5 pages
// Each page has 20 games that we will scrap 
// Scrap pages
scrapPages(0)
  .then(async () => {
    console.log(`Number of games: ${gameList.length}`);


    // Scrap individual game details
    for (let index = 0; index <  gameList.length; ++index) {

        await scrapGameUrl(gameList[index]);
    }

    saveArrayToFile(gameList);

     // <-- For testing purposes making sure the objects have - title, url, priceList, imageUrl, and esrbValue 
   // ********************************  iterateGameList(); ******************************** 
     // 
    // Start the server after scraping is completed
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  function iterateGameList(){
    for(let index = 0; index < gameList.length; index++){
        console.log(gameList[index]);
    }
  }



  async function saveArrayToFile(gameList) {
      
    // Convert the array to a string (you can use JSON.stringify for more complex objects)
    const dataString = gameList.map(obj => JSON.stringify(obj)).join('\n');

    // Specify the file path
    const filePath = 'genres/racing.txt';

    // Write the data to the file
    fs.writeFile(filePath, dataString, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      } else {
        console.log('File saved successfully.');
      }
    });
}


