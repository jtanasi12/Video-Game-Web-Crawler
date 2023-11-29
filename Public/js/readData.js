$(document).ready(function () {
    // Add click event to the image link
    $('#ajax-trigger').click(function (event) {
        event.preventDefault(); // Prevent the default behavior of the link
        // Your AJAX request code
        $.ajax({
            url: 'http://localhost:3000/loadTxtFile',
            method: 'POST', // Change to POST since your server endpoint is expecting a POST request
            contentType: 'application/json', // Specify content type for the request
            data: JSON.stringify({ genre: 'rpg.txt' }), // Send the genre as JSON data
            success: function (response) {
                // Process and display the response as needed
                console.log(response);
                const resultsContainer = $('#results'); // Assuming you have an element with id 'results' to display the results

                // Clear previous results
                resultsContainer.empty();

                // Loop through each item in the parsed content and append it to the container
                response.content.forEach(item => {
                    const resultItem = $('<div></div>');
                    resultItem.html(`<pre>${JSON.stringify(item, null, 2)}</pre>`);
                    resultsContainer.append(resultItem);
                });
            },
            error: function (xhr, status, error) {
                console.error(error);
                $('#results').text('Error fetching data');
            }
        });
    });
});
