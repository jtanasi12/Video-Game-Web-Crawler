
let backgroundImage;

$(document).ready(function () {
    // Get the genre parameter from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const genre = urlParams.get('genre');



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
                $('#results').append(`
    <div class="card mb-3">
        <div class="row g-0 align-items-center">
            <div class="col-sm-4">
                <img src="${item.imageUrl}" alt="event_img" class="card-img rounded p-1 img-fluid" id="event-img">
            </div>
            <div class="col-sm-8">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-8">
                            <h3 class="card-title display-4" id="event-title">
                             ${item.title}
                            </h3>
                        </div>
                        <div class="col-sm-4">
                            <small class="fs-4 text-success fw-bold" id="date">
                                Price
                            </small><br>
                            <small class="fw-light fs-6 text-success" id="time">
                                ${item.priceLabel}
                            </small>
                        </div>

                       
                        <p class="card-text text-muted " id="address">ESRB RATING<br>${item.esrbValue}</p>
                        <div>
                            <div>
                                <div class="col-4-sm">
                                     <a class="btn btn-primary" href="${item.url}"  id="event-url" role="button" target="_blank">Get the Game</a>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>


        </div>


    </div>
`);

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