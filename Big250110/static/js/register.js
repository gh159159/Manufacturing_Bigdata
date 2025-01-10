$(document).ready(function() {
    
    $('#address').on('click', function() {
        new daum.Postcode({
        oncomplete: function(data) {
            $('#address').val(data.address);
        }
    }).open();
    });
    
    $('#signupForm').submit(function(event) {
        event.preventDefault();

        var formData = {
            id: $('#id').val(),
            pw: $('#pw').val(),
            pw_confirm: $('#pw_confirm').val(),
            nick: $('#nick').val(),
            address: $('#address').val(),
            type: $('#type').val()
        };

        if (formData.pw !== formData.pw_confirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        $.ajax({
            url: '/api/user/add-user',
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.error) {
                    alert(response.error);
                } else {
                    alert('회원가입이 완료되었습니다.');
                    window.location.href = '/';
                }
            }
        });
    });
});