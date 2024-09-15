async function makePrediction() {
    const formData = {
        Actor1: document.getElementById('Actor1').value,
        Actor2: document.getElementById('Actor2').value,
        Director: document.getElementById('Director').value,
        Budget: parseFloat(document.getElementById('Budget').value),
        TheaterCount: parseInt(document.getElementById('TheaterCount').value),
        Popularity: parseFloat(document.getElementById('Popularity').value),
        Duration: parseFloat(document.getElementById('Duration').value)
    };
    

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Connection': 'close'
            },
            body: JSON.stringify(formData)
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            // Attempt to parse the error message from the server
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = `Error ${response.status}: ${errorData.error}`;
                }
            } catch (parseError) {
                console.error('Error parsing error response:', parseError);
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();

        // Check if the prediction is present in the response
        if (result.prediction !== undefined) {
            displayPrediction(result.prediction);
        } else if (result.error) {
            // Display server-side error message
            alert(`Error from server: ${result.error}`);
        } else {
            // Handle unexpected response format
            alert('Prediction returned undefined. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred: ${error.message}`);
    }
}

function displayPrediction(prediction) {
    document.getElementById('predictionResult').innerText = prediction !== undefined ? `${prediction}` : 'undefined';
}
