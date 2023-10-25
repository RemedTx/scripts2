// Initialize the Google Sheets API
function initClient() {
    gapi.client.init({
        'apiKey': 'f551982d0a0f3583f227d2592c8b833d60cc7c72',
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        // Use the Google Sheets API
        storeDataToSheets();
    });
}

// Store the data to the Google Sheets document
function storeDataToSheets() {
    // Define your spreadsheet ID and range
    const spreadsheetId = '1y2sY1CB73DVu-cxcvnYy4S5XG7Z8RLNdOKk70FqWzNg';
    let range = 'Sheet1!A1:C1'; // Adjust the range as needed

    // Collect data from each slide
    let allData = [];
    for (let i = 0; i < slides.length; i++) {
        let dataFromSlide = [];
        // Example: Collecting data from radio inputs
        const radioInputs = slides[i].querySelectorAll('input[type="radio"]:checked');
        radioInputs.forEach((input) => {
            dataFromSlide.push(input.value);
        });
        // Push the data from each slide to the overall data array
        allData.push(dataFromSlide);
    }

    // Call the Google Sheets API to append the data
    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
            values: allData
        }
    }).then((response) => {
        console.log('Data appended successfully:', response.result);
    }, (reason) => {
        console.error('Error appending data:', reason.result.error.message);
    });
}

// Call the initClient function
initClient();
