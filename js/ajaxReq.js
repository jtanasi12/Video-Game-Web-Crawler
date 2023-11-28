$(document).ready(function () {
    $.ajax({
        //declaring arrays to content records

        url: 'http://localhost:3000/rpg.txt', // Replace with your file name
        method: 'GET',
        success: function (response) {
            console.log(response);
            const lines = response.split('\n');


            lines.forEach(line => {
                try {


                    //parsing
                    const jsonObj = JSON.parse(line);
                    const title = jsonObj.title;
                    const url = jsonObj.url;
                    const priceLabel = jsonObj.priceLabel;
                    const imageUrl = jsonObj.imageUrl;
                    const esrbValue = jsonObj.esrbValue;
                    $('#results').append(` 
    <div class="card mb-3">
        <div class="row g-0 align-items-center">
            <div class="col-sm-4">
                <img src="${imageUrl}" alt="event_img" class="card-img rounded p-1 img-fluid" id="event-img">
            </div>
            <div class="col-sm-8">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-8">
                            <h3 class="card-title display-4" id="event-title">
                             ${title}
                            </h3>
                        </div>
                        <div class="col-sm-4">
                            <small class="fs-4 text-success fw-bold" id="date">
                               Price
                            </small><br>
                            <small class="fw-light fs-6 text-success" id="time">
                              ${priceLabel}  
                            </small>
                        </div>

                        
                        <p class="card-text text-muted " id="address">Esrb Rating:${esrbValue}<br></p>
                        <div>
                            <div>
                                <div class="col-4-sm">
                                     <a class="btn btn-primary" href="${url}"  id="event-url" role="button" target="_blank">Find Tickets</a>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>


        </div>


    </div>
`);
                } catch (error) {
                    console.error('Invalid JSON format:', error);
                }
            });


        },
        error: function (xhr, status, error) {
            console.error(error);
            $('#result').text('Error fetching data');
        }
    });
});
