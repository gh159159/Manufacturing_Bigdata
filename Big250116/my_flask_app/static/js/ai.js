var currentStartIndex = 0;
var rowsPerPage = 3; // Changed to 3 rows per page

function uploadFile() {
    var formData = new FormData($('#uploadForm')[0]);
    $.ajax({
        url: '/api/ai/upload_pkl',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            window.tableData = response.data;
            window.columns = response.columns;
            renderTable();
        },
        error: function(response) {
            var errorMessage = response.responseJSON && response.responseJSON.error ? response.responseJSON.error : 'An unknown error occurred';
            alert('Error: ' + errorMessage);
        }
    });
}

function renderTable() {
    var columnsToShow = ['lotName', 'waferIndex', 'prediction'];
    var tableHtml = '<table class="table table-bordered"><thead><tr>';
    columnsToShow.forEach(function(column) {
        tableHtml += '<th>' + column + '</th>';
    });
    tableHtml += '<th>Actions</th></tr></thead><tbody>';
    var endIndex = Math.min(currentStartIndex + rowsPerPage, window.tableData.length);
    for (var i = currentStartIndex; i < endIndex; i++) {
        var row = window.tableData[i];
        tableHtml += '<tr>';
        columnsToShow.forEach(function(column) {
            tableHtml += '<td>' + (row[column] || '') + '</td>';
        });
        tableHtml += '<td><button onclick="showWaferMap(' + i + ')" class="btn btn-success">Show Wafer Map</button></td></tr>';
    }
    tableHtml += '</tbody></table>';
    $('#fileContents').html(tableHtml);
    $('#navigationButtons').html(
        '<button onclick="prevPage()" class="styled-prev-button" ' + (currentStartIndex === 0 ? 'disabled' : '') + '>Previous</button>' +
        '<button onclick="nextPage()" class="styled-next-button" ' + (endIndex >= window.tableData.length ? 'disabled' : '') + '>Next</button>'
    );
}

function prevPage() {
    if (currentStartIndex > 0) {
        currentStartIndex -= rowsPerPage;
        renderTable();
    }
}

function nextPage() {
    if (currentStartIndex + rowsPerPage < window.tableData.length) {
        currentStartIndex += rowsPerPage;
        renderTable();
    }
}

function showWaferMap(index) {
    var waferMap = window.tableData[index].waferMap;
    $.ajax({
        url: '/api/ai/wafer_map',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ waferMap: waferMap }),
        success: function(response) {
            var imgHtml = '<img src="data:image/png;base64,' + response.image + '" style="max-width: 100%; height: auto;" />';
            $('#waferMapContainer').html(imgHtml);
        },
        error: function(response) {
            var errorMessage = response.responseJSON && response.responseJSON.error ? response.responseJSON.error : 'An unknown error occurred';
            alert('Error: ' + errorMessage);
        }
    });
}

function predictPattern() {
    var waferMaps = window.tableData.map(row => row.waferMap);
    $.ajax({
        url: '/api/ai/predict',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ waferMaps: waferMaps }),
        success: function(response) {
            response.predictions.forEach(function(prediction, index) {
                window.tableData[index].prediction = prediction;
            });
            renderTable();
        },
        error: function(response) {
            var errorMessage = response.responseJSON && response.responseJSON.error ? response.responseJSON.error : 'An unknown error occurred';
            alert('Error: ' + errorMessage);
        }
    });
}