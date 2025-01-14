$(document).ready(function () {
    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData();
        const file = $('#imageInput')[0].files[0];

        if (!file) {
            alert("Please select an image file.");
            return;
        }

        formData.append('image', file);

        // AJAX 요청
        $.ajax({
            url: '/api/ai/predict-cat-dog',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.label) {
                    $('#result').html(`Prediction: ${response.label}<br>Confidence: ${response.confidence.toFixed(2)}`);
                } else {
                    $('#result').text('Unexpected error occurred.');
                }
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON?.error || 'An error occurred while processing the request.';
                $('#result').text(`Error: ${errorMsg}`);
            }
        });
    });

    $('#imageInput').on('change', function(event) {
        const preview = $('#preview');
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.attr('src', e.target.result);
            preview.show();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.attr('src', '#');
            preview.hide();
        }
    });
});