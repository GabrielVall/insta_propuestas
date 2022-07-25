$(document).ready(function() {
    // if search not has offerid
    if (window.location.search.indexOf('offerid') == -1) {
        alert('No se ha encontrado el identificador de la oferta');
        // window.location.href = 'https://instacel.mx/';
    }
    // if file is pago.php
    if (window.location.href.indexOf("pago.php") > -1) {
        
    }else{
        var num = localStorage.getItem('celular');
        // get offerid from search
        var offerid = window.location.search.split('=')[1];
        if(num){
            if(num.length == 10){
                window.location.href = "pago.php?cel="+num+"&offerid="+offerid;
            }
        }
    }
    $(document).on('click', '#back_button', function() {
        window.location.href = 'https://instacel.mx/';
    });
    var contenedor = document.getElementsByClassName("bottom_card")[0];
    var button_next = document.getElementsByClassName('btn_next')[0];
    // on click
    $(document).on('click', '#btn_next', function(e) {
        var cel = document.getElementById('celular').value;
        var cbx = document.getElementById('cbx');
        button_next.innerHTML = '<div class="loader"></div>';
        button_next.classList.add('disabled');
        $('.backdrop_modal').addClass('visible');
        // if cel is valid
        if (cel.length == 10) {

            $.ajax({
                url: 'php/c/validar_numero.php',
                type: 'POST',
                data: {
                    cel: cel
                },
                success: function(data) {
                    data = JSON.parse(data);
                    if(data.status){
                        if(cbx.checked) {
                            localStorage.setItem('celular', cel);
                        }
                        // get offerid from search
                        var offerid = window.location.search.split('=')[1];
                        window.location.href = 'pago.php?cel=' + cel + '&offerid=' + offerid;
                    }else{
                        alert('El número ingresado no fue encontrado, intente de nuevo');
                    }
                },
                complete: function() {
                    $('.backdrop_modal').removeClass('visible');
                    $('#btn_next').removeClass('disabled').html('SIGUIENTE');
                }
            });
            
        }else{
            button_next.classList.remove('disabled');
            button_next.innerHTML = 'SIGUIENTE';
        }
    });
    
    $(document).on('keyup', '#numero_tarjeta', function(e) {
        var selector = $('.group_numbers');
        var num = e.target.value.length;
        var split_value = e.target.value.split('');
        var group = 0;
        e.target.value = e.target.value.substring(0, 16);
        // for numbers increment 4 limit 16
        $(selector).html('');
        for (var i = 0; i < 16; i++) {
            if (i % 4 == 0 && i != 0) {
                group++;
            }
            if(split_value[i]){
                // append
                selector[group].innerHTML += split_value[i];;
            }else{
                selector[group].innerHTML += '*';
            }
            
        }
    });
    $(document).on('keyup', '#nombre', function(e) {
        var text = $(this).val();
        if(text.length == 0){
            $('.name_payer')[0].innerHTML = 'Nombre del titular';
        }else{
            $('.name_payer')[0].innerHTML = text;
        }
    });
    $(document).on('change','#mes_select', function(){
        var val = $(this).val();
        // if number is less than 10 add 0
        if(val.length == 1){
            val = '0'+val;
        }
        $('#mes_card').html(val);
    });
    $(document).on('change','#year_select', function(){
        var val = $(this).val();
        // if number is less than 10 add 0
        if(val.length == 1){
            val = '0'+val;
        }
        $('#year_card').html(val);
    });
    cargar_years_select();
    function cargar_years_select(){
        var year = new Date().getFullYear();
        // last 2 numbers
        var year_end = year.toString().substring(2, 4);
        var option = '<option disabled selected>Año</option>';
        // for 10 years
        for (var i = 0; i < 15; i++) {
            option += `<option value="${year_end}">${year_end}</option>`;
            year_end++;
        }
        $('#year_select').html(option);
    }
    $(document).on('keyup', '#cvv', function(e) {
        var text = $(this).val();
        if(text.length == 0){
            $('.cvv span')[0].innerHTML = '***';
        }else{
            // if length is more than 3
            if(text.length > 3){
                text = text.substring(0, 3);
                $(this).val(text);
            }else{
                $('.cvv span')[0].innerHTML = text;
            }
        }
    });
    // on focus input
    $(document).on('focus', '#cvv', function(e) {
        $('.credit_card')[0].classList.add('hidden');
        $('.credit_card')[1].classList.remove('hidden');
    });
    // on blur input
    $(document).on('blur', '#cvv', function(e) {
        $('.credit_card')[1].classList.add('hidden');
        $('.credit_card')[0].classList.remove('hidden');
    });
    $(document).on('click', '.square', function(e) {
        $('.square').removeClass('selected');
        $(this).addClass('selected');
    });
    // OPEN PAY
    // if exist id form_card
    if(document.getElementById('form_card')){
        OpenPay.setSandboxMode(true);
        OpenPay.setId('msrmt2amtq1l2fw1yp9z');
        OpenPay.setApiKey('pk_3a2472a9794f4b1e828e0cde7bffb4ba');
        var form = OpenPay.token.extractFormInfo('form_card', success_callbak, error_callbak);
        var success_callbak = function(response) {
        var token_id = response.data.id;
        console.log(token_id);
        };
        var error_callbak = function(response) {
        var desc = response.data.description != undefined ? response.data.description : response.message;
        alert("ERROR [" + response.status + "] " + desc);
        };
        $(document).on('click', '#confirm_button', function(e) {
            var boton = $(this);
            boton.addClass('disabled');
            $('.backdrop_modal').addClass('visible');
            boton.html('<div class="loader"></div>');
            OpenPay.token.extractFormAndCreate('form_card',function (response) {
                var token_id = response.data.id;
                var deviceSessionId = OpenPay.deviceData.setup("form_card", "deviceIdHiddenFieldName");
        
                var formData = new FormData;
                formData.append('id', token_id);
                formData.append('deviceSessionId', deviceSessionId);
                formData.append('offerid', 1);
                formData.append('phone', 1);

                fetch("php/c/openpay.php",{
                method: 'POST',
                body: formData
                }).then(response => response.text()).then(rpta => {
                var rpt = JSON.parse(rpta);
                if(rpt.status == 'success'){
                    $('.modal').html(`
                    <div class="success_alert">
                        <img src="img/success.gif">
                        <div class="text_success">
                            <h3>¡Pagado completado!</h3>
                            <p>Ahora podras disfrutar de todos los beneficios de tu nuevo plan</p>
                            <button class="button_hov" id="back_button">
                                <span>Volver a la pagina</span>
                            </button>
                        </div>
                    </div> 
                    `);
                }else{
                        console.log('error');
                }
                boton.html('PAGAR').removeClass('disabled');
                });
            });
        });
    }
    // OPEN PAY END
});