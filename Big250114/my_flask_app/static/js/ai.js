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
                            <p><strong style="font-size: larger;">${formatPrice(response.price_by_lin)}</strong></p>
                            <p>예상가격 - 랜덤포레스트</p>
                            <p><strong style="font-size: larger;">${formatPrice(response.price_by_rf)}</strong></p>
                        </div>`
                    );
                    
                    $.ajax({
                        url: '/api/ai/add-predict-house-price',
                        type: 'POST',
                        data: {
                            area: formData.area,
                            rooms: formData.rooms,
                            year_built: formData.year_built,
                            income: formData.income,
                            school_rating: formData.school_rating,
                            transit_score: formData.transit_score,
                            price_by_lin: response.price_by_lin,
                            price_by_rf: response.price_by_rf
                        },
                        success: function(saveResponse) {
                            if (saveResponse.message === "Predict house price added successfully") {
                                console.log("Predicted prices saved successfully");
                            } else {
                                console.log("Error saving predicted prices");
                            }
                        }
                    });
                } else {
                    $('#predictionResults').html(`<p>Error: ${response.error}</p>`);
                }
            }
        });
    });

    function formatPrice(price) {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
});
