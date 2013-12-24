var spinner = {};
$(function() {
    function viewFix() {
        $('.content').height($(window).height() - 100 )
    };
    $(window).resize(function(){
        viewFix()
    })

    $('.popap').click(function(e) {
        e.stopImmediatePropagation()
        e.preventDefault();
    })
    // LOGIN
    var login = function() {
        var loginButton = $('.register .login.item')
        var loginForm =  loginButton.find('.login.form')
        var loginSubmitButton = loginForm.find('.force_submit')
        var loginFormReqRes = $('.login.popap #req_res')
        loginButton.click(function(e) {
            e.stopImmediatePropagation()
            e.preventDefault();
            $(this).toggleClass('active').siblings().removeClass('active')

            return false
        })
        loginSubmitButton.click(function(e) {
            loginForm.submit();
        })
        loginForm.submit(function(e) {
            e.preventDefault()
            console.log('loginForm submit')
            var data = loginForm.serialize()
            $.ajax({
                url: '/login',
                type: 'POST',
                data: loginForm.serialize(),
            })
            .done(function(res_data) {
                console.log("req data :", this.data);
                console.log('res data:', res_data)
                if (!res_data.success) {
                    if (res_data.err.code) {
                        switch (res_data.err.code) {
                            case 11000 :
                            loginFormReqRes.removeClass().addClass('error').html('Такой пользователь уже зарегистрирован!')
                            break
                        }
                    }
                } else {
                    loginFormReqRes.removeClass().addClass('success').html('Регистрация прошла успешно!')
                }

            })
            .fail(function(err) {
                console.log('error')
                console.log(err);
            })
            .always(function() {
                console.log("complete");
            });   
        })
};
login();
    // END LOGIN

    // SIGNIN
    var signin = function() {
        var signinButton = $('.signin.item', '.register')
        var signinForm = signinButton.find('.signin.form') 
        var signinSubmitButton = signinForm.find('.force_submit')
        var signinFormReqRes = $('.signin.popap #req_res')
        signinButton.click(function(e) {
            e.stopImmediatePropagation()
            e.preventDefault();
            $(this).toggleClass('active').siblings().removeClass('active')

            return false
        })
        signinSubmitButton.click(function(e) {
            signinForm.submit();
        })
        signinForm.submit(function(e) {
            e.preventDefault()
            console.log('signinForm submit')
            $.ajax({
                url: '/signin',
                type: 'POST',
                data: signinForm.serialize(),
            })
            .done(function(res_data) {
                console.log("req data :", this.data);
                console.log('res data:', res_data)
                if (!res_data.success) {
                    if (res_data.err.code) {
                        switch (res_data.err.code) {
                            case 11000 :
                            signinFormReqRes.removeClass().addClass('error').html('Такой пользователь уже зарегистрирован!')
                            break
                        }
                    }
                } else {
                    signinFormReqRes.removeClass().addClass('success').html('Успешный вход!')
                }

            })
            .fail(function(err) {
                console.log('error')
                console.log(err);
            })
            .always(function() {
                console.log("complete");
            });  
        })
};
signin();
    // END SIGNIN

    viewFix()
    
    var opts = {
        lines: 17, // The number of lines to draw
        length: 11, // The length of each line
        width: 30, // The line thickness
        radius: 16, // The radius of the inner circle
        corners: 0.6, // Corner roundness (0..1)
        rotate: 66, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: 'lightblue', // #rgb or #rrggbb or array of colors
        speed: 2.1, // Rounds per second
        trail: 69, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementsByClassName('content')[0];
    spinner = new Spinner(opts).spin(target);   
})