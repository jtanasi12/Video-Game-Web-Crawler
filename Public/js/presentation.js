


$(document).ready(function () {
    // Get the genre parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const genre = urlParams.get('genre');



    //document.body.style.backgroundImage = url(`Images/${backgroundImage}`);

    // Make an AJAX request to the server endpoint
    $.ajax({
        url: 'http://localhost:3000/loadTxtFile',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ genre }),

        // This comes from nodejs after the API is successful, it sends back a response 
        // of the contents from the file 
        success: function (response) {
            console.log(response);
            const resultsContainer = $('#results');

            // Clear previous results
            resultsContainer.empty();

            // Loop through each item in the parsed content and create HTML elements
            response.content.forEach(item => {
                const resultItem = $('<div class="card m-3 p-3 text-center shadow-rounded d-flex align-items-center"></div>');

                // Create an image element
                const imageElement = $('<img class="d-block img-fluid mx-auto mb-3">');
                imageElement.attr('src', item.imageUrl);
                imageElement.css('max-width', '500px'); // Set max-width to 500 pixels
                imageElement.css('max-height', '500px'); // Set max-height to 500 pixels
                resultItem.append(imageElement);

                // Create a div for text information
                const textDiv = $('<div class="ms-3 text-start"></div>');

                const titleElement = $('<h5 class="fs-1"></h5>');
                titleElement.text(item.title);
                textDiv.append(titleElement);

                const priceElement = $('<p class="fs-3"></p>');
                priceElement.text(`Price: ${item.priceLabel}`);
                textDiv.append(priceElement);

                const esrbElement = $('<p class="fs-3"></p>');
                esrbElement.text(`ESRB: ${item.esrbValue}`);
                textDiv.append(esrbElement);

                // Append the text div to the result item
                resultItem.append(textDiv);

                // Append the result item to the container
                resultsContainer.append(resultItem);
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
            $('#results').text('Error fetching data');
        }
    });
});

function returnToMain(){
    window.location.href = `opening-page.html`;
}