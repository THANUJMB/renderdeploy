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

        if (!response.ok) {
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

        if (result.prediction !== undefined) {
            displayPrediction(result.prediction);
        } else if (result.error) {
            alert(`Error from server: ${result.error}`);
        } else {
            alert('Prediction returned undefined. Please try again.');
        }

        resetForm();  
        document.getElementById('Actor1').focus();  

    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred: ${error.message}`);
    }
}

function displayPrediction(prediction) {
    document.getElementById('predictionResult').innerText = prediction !== undefined ? `${prediction} INR` : 'undefined';
}

function resetForm() {
    // Clear all input fields for continuous prediction
    document.getElementById('Actor1').value = '';
    document.getElementById('Actor2').value = '';
    document.getElementById('Director').value = '';
    document.getElementById('Budget').value = '';
    document.getElementById('TheaterCount').value = '';
    document.getElementById('Popularity').value = '';
    document.getElementById('Duration').value = '';
}
