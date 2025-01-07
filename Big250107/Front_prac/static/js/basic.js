$(document).ready(function(){

    var isHello = true;

    $('#testButton').on('click', function(){
        if (isHello) {
            $('#txt').html('Hello');
            isHello = false;
        } else {
            $('#txt').html('안녕');
            isHello = true;
        }
    });

    let isChanging = false;
    let colorInterval;
    let currentColorIndex = 0;
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    
    $('#testButton2').on('click', function(){
        if (!isChanging) {
            colorInterval = setInterval(function() {
                $('#txt').css('color', colors[currentColorIndex]);
                currentColorIndex = (currentColorIndex + 1) % colors.length;
            }, 100);
            isChanging = true;
        } else {
            clearInterval(colorInterval);
            isChanging = false;
        }
    });

    $('#testButton3').on('click', function(){
        $('#txt').html($('#testInput').val());
    });

    $('#testButton4').on('click', function(){
        let currentFontSize = parseInt($('#txt').css('font-size'));
        $('#txt').css('font-size', (currentFontSize + 10) + 'px');
    });

    $('#testButton5').on('click', function(){
        let currentFontSize = parseInt($('#txt').css('font-size'));
        $('#txt').css('font-size', (currentFontSize - 10) + 'px');
    });

    $('#testButton6').on('click', function(){
        $('#txt').toggle();
    });

    $('#testButton7').on('click', function(){
        if (!isChanging) {
            colorInterval = setInterval(function() {
                $('body').css('background', colors[currentColorIndex]);
                currentColorIndex = (currentColorIndex + 1) % colors.length;
            }, 500);
            isChanging = true;
        } else {
            clearInterval(colorInterval);
            isChanging = false;
        }
    });

    $('#testButton8').on('click', function(){
        let stone = $('<div></div>').css({
            width: '50px',
            height: '50px',
            background: 'gray',
            position: 'absolute',
            top: '0',
            left: '0',
            borderRadius: '50%'
        }).appendTo('body');

        stone.animate({ left: '100%' }, 2000, function() {
            stone.remove();
        });
    });
});