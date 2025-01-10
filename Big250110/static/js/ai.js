$(document).ready(function() {
    $('#studyForm').submit(function(event) {
        event.preventDefault();

        var formData = {
            area: $('#area').val(),
            rooms: $('#rooms').val(),
            year_built: $('#year_built').val(),
            income: $('#income').val(),
            school_rating: $('#school_rating').val(),
            transit_score: $('#transit_score').val()
        };

        $.ajax({
            url: '/api/ai/predict-house-price',
            type: 'GET',
            data: formData,
            success: function(response) {
                if (response.message === "OK") {
                    $('#predictionResults').html(
                        `<div class="result">
                            <br>
                            <p>예상가격 - 선형회귀</p>
                            <p><strong style="font-size: larger;">$${response.price_by_lin.toFixed(2)}</strong></p>
                            <p>예상가격 - 랜덤포레스트</p>
                            <p><strong style="font-size: larger;">$${response.price_by_rf.toFixed(2)}</strong></p>
                        </div>`
                    );
                } else {
                    $('#predictionResults').html(`<p>Error: ${response.error}</p>`);
                }
            }
        });
    });
});
