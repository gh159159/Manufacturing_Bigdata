$(document).ready(function(){

    $('#testButton').on('click', function(){
        $('#txt').html($('#txt').html() === 'Hello' ? '안녕' : 'Hello');
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
    
    $('#address').on('click', function() {
        new daum.Postcode({
        oncomplete: function(data) {
            $('#address').val(data.address);
        }
    }).open();
    });

    $('#savebtn').on('click', function() {
        var name = $('#name').val();
        var age = $('#age').val();
        var address = $('#address').val();

        if (name && age && address) {
            var tableBody = $('#tableBody');
            var newRow = $('<tr></tr>');

            var nameCell = $('<td></td>').text(name);
            var ageCell = $('<td></td>').text(age);
            var addressCell = $('<td></td>').text(address);

            newRow.append(nameCell, ageCell, addressCell);
            tableBody.append(newRow);

            var geocoder = new daum.maps.services.Geocoder();
            geocoder.addressSearch(address, function(result, status) {
                if (status === daum.maps.services.Status.OK) {
                    var coords = new daum.maps.LatLng(result[0].y, result[0].x);
                    var mapContainer = $('#map')[0], 
                        mapOption = { 
                            center: coords, 
                            level: 3 
                        };
                    var map = new daum.maps.Map(mapContainer, mapOption);
                    var marker = new daum.maps.Marker({
                        map: map,
                        position: coords
                    });
                } else {
                    alert('주소를 찾을 수 없습니다.');
                }
            });

            $('#name').val('');
            $('#age').val('');
            $('#address').val('');

        } else {
            alert('모든 필드를 입력해주세요.');
        }
    });

    $('#tableBody').on('click', 'tr', function() {
        if (confirm('정말 삭제하시겠습니까?')) {
            $(this).remove();
        }
    });

    $('#study-btn').click(function(){
        $.ajax({
            url:'http://127.0.0.1:5000/study',
            type:'get',
            success:function(data){
                console.log(data);
            }
        });
    });

    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting via the browser

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            url: '/login',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                if (response.includes('Invalid Credentials')) {
                    $('#error').text('Invalid Credentials. Please try again.');
                } else {
                    window.location.href = '/';
                    alert('로그인 성공');
                }
            }
        });
    });

    fetchTodos();
});

function fetchTodos() {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/todos',
        type: 'GET',
        data: {},
        success: function(todos) {
            var tableBody = $('#todo-list');
            todos.forEach(function(todo) {
                var newRow = $('<tr></tr>');
                var idCell = $('<td></td>').text(todo.id);
                var userIdCell = $('<td></td>').text(todo.userId);
                var titleCell = $('<td></td>').text(todo.title);
                var completedCell = $('<td></td>').text(todo.completed ? '성공' : '실패');
    
                newRow.append(idCell, userIdCell, titleCell, completedCell);
                newRow.data('id', todo.id);
                newRow.data('userid', todo.userId);
                newRow.data('title', todo.title);
                newRow.data('completed', todo.completed ? '성공' : '실패');

                tableBody.append(newRow);
            });

            $('#todo-list').on('click', 'tr', function() {
                var id = $(this).data('id');
                var userid = $(this).data('userid');
                var title = $(this).data('title');
                var completed = $(this).data('completed');

                location.href = `/todo-detail?id=${id}&userid=${userid}&title=${title}&completed=${completed}`;
            });
        },
        error: function(error) {
            console.error('Error fetching todos:', error);
        }
    });
};
