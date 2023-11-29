
function genreSelected(genre){

    event.preventDefault(); // Prevent page from scrolling

   

        // Load the new window with the appropriate genre apphended into the URL 
        // We will then grab that genre and load the correct .txt file

        window.location.href = `presentation-page.html?genre=${genre}&imageUrl=${imageUrl}`;

}

/*
$(document).ready(function () {
    // Add click event to the image link
    $('#ajax-trigger').click(function (event) {
        event.preventDefault(); // Prevent the default behavior of the link
        // Your AJAX request code
        $.ajax({
            url: 'http://localhost:3000/rpg.txt',
            method: 'GET',
            success: function (response) {
                // Process and display the response as needed
                console.log(response);
                const lines = response.split('\n');
                lines.forEach(line => {
                    try {
                        const jsonObj = JSON.parse(line);
                        // ... (rest of your code)
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
});
*/
