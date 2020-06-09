$( document ).ready(function() {
    $('#zaymForm input[type="phone"]').mask('+7 (999) 999-99-99');

    $('.label__checkbox').click(function () {
       
       if ($(this).children('input').prop("checked")) {
            if ($(this).children('input').hasClass('hasMiddleName')) {
                $('#middle-name').addClass('disabled');
                $('#middle-name').removeClass('success');
                $('#middle-name').removeClass('error');
                $('#middle-name input').attr('disabled', true);
                $('#middle-name input').val('');
                if ($('input[name="lastName"]').val() && $('input[name="firstName"]').val()) {
                    $('.form__gender').removeClass('hidden');
                }
            }
            if ($(this).hasClass('confirm')) {
                $('.none-confirmed').removeClass('error');
            }
            $(this).addClass('checked');
       } else {
            if ($(this).children('input').hasClass('hasMiddleName')) {
                $('.form__gender').addClass('hidden');
                $('#middle-name').removeClass('disabled');
                $('#middle-name input').attr('disabled', false);
            }
            $(this).removeClass('checked');
       }
    });

    $('.gender__btn').click(function (e) {
        e.preventDefault();
        $('.gender__btn').each((i, el) => $(el).removeClass('active'));
        $(this).addClass('active');
    });

    $('#zaymForm .form__label input:not([type="checkbox"])').focus(function () {
        $(this).parent().parent().removeClass('error');
        if (!$(this).parent().parent().hasClass('m-24')) {
            $(this).next().addClass('float');
        }
    });
    $('#zaymForm .form__label input:not([type="checkbox"])').blur(function () {
        if ($(this).val()) {
            $(this).parent().parent().addClass('success');
            $(this).parent().parent().removeClass('error');
        } else {
            $(this).parent().parent().addClass('error');
            $(this).parent().parent().removeClass('success');
            $(this).next().removeClass('float');
        }

        if ($(this).attr('type') === 'phone') {
            return;
        }

        if (
            $('#zaymForm input[name="lastName"]').val() && 
            $('#zaymForm input[name="firstName"]').val() && 
            ($('#zaymForm input[name="middleName"]').val() || $('#zaymForm input[name="hasMiddleName"]').prop("checked"))
        ) {
            $('.form__gender').removeClass('hidden');
        }
    });

    $('.gender__btn').click(function () {
        $('.form__gender').removeClass('error');
    });

    $('.form__submit').click(function (e) {
        e.preventDefault();
        var data = {
            'Фамилия': '',
            'Имя': '',
            'Отчество': '',
            'Пол': '',
            'Телефон': '',
        }   
        if ($('#zaymForm input[name="lastName"]').val()) {
            data['Фамилия'] = $('#zaymForm input[name="lastName"]').val();
        } else {
            $('#zaymForm input[name="lastName"]').focus();
            return;
        }

        if ($('#zaymForm input[name="firstName"]').val()) {
            data['Имя'] = $('#zaymForm input[name="firstName"]').val();
        } else {
            $('#zaymForm input[name="firstName"]').focus();
            return;
        }

        if ($('#zaymForm input[name="middleName"]').val() || $('#zaymForm input[name="hasMiddleName"]').prop("checked")) {
            data['Отчество'] = $('#zaymForm input[name="middleName"]').val();
        } else {
            $('#zaymForm input[name="middleName"]').focus();
            return;
        }
        var genderEl = false;
        $('.gender__btn').each(function (i, el) {
            if ($(el).hasClass('active')) {
                genderEl = el;
            }
        });

        if (genderEl) {
            data['Пол'] = $(genderEl).text();
        } else {
            $('.form__gender').addClass('error');
            return;
        }

        if ($('#zaymForm input[name="phone"]').val()) {
            data['Телефон'] = $('#zaymForm input[name="phone"]').val();
        } else {
            $('#zaymForm input[name="phone"]').focus();
            return;
        }

        if (!$('#zaymForm input[name="confirmed"]').prop('checked')) {
            $('.none-confirmed').addClass('error');
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'mail.php',
            data: data
        }).done(function( msg ) {
            console.log(msg);
            $('#zaymForm')[0].reset();
            $('#zaymForm .gender__btn.active').removeClass('active');
            $('#zaymForm .form__gender').addClass('hidden');
            $('#zaymForm .input__wrap.success').each(function (i, el) {
                $(el).removeClass('success');
            });
            $('#middle-name').removeClass('disabled');
            $('#zaymForm input[type="checkbox"]').each(function (i, el) {
                $(el).prop('checked', false);
            });
            $('.form__float-prompt').each(function (i, el) {
                $(el).removeClass('float');
            });
            $('.label__checkbox').each(function (i, el) {
                $(el).removeClass('checked');
            });
        }).fail(function(jqXHR, textStatus) {
            console.log(textStatus);
        });
    });
});
