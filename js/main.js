$(document).ready(function() {
    // if search not has offerid
    // if page is index.html 
    if (window.location.search.indexOf('offerid') == -1) {
        alert('No se ha encontrado el identificador de la oferta');
        window.location.href = 'https://instacel.mx/';
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
        var cel2 = document.getElementById('celular2').value;
        
        if (cel.length == 10 && cel2.length == 10 && cel == cel2) {
        // if cel is valid
        if (cel.length == 10) {
            var cbx = document.getElementById('cbx');
            button_next.innerHTML = '<div class="loader"></div>';
            button_next.classList.add('disabled');
            $('.backdrop_modal').addClass('visible');
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
                        alertify.alert('¡ALERTA!', 'El número ingresado no fue encontrado, intente de nuevo').setting({
                            'label':'Aceptar'
                        });
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
    }else{
        alertify.alert('¡ALERTA!', 'Los números ingresados no coinciden.').setting({
            'label':'Aceptar'
        });
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
        var id = $(this).data('id');
        $('.method').removeClass('show');
        $('.method[data-id="'+id+'"]').addClass('show');
    });
    // mercadopago
    $(document).on('click', '#btn_mercadopago', function(e) {
        var price = $('body').data('price');
        var cel = $('body').data('cel');
        // get offerid from search
        var offerid = $('body').data('offerid');
        fetch("php/c/mercadopago.php?offerid="+offerid+"&cel=" + cel).then(response => response.text()).then(rpta => {
            window.location.href = rpta;
        });
    });
    if(window.location.search.indexOf('pending_mercadopago') != -1){
        var x = window.location.search;
        var y = x.substring(x.indexOf('?') + 1);
        var MercadoPago = URLToArray(y);
        var cel = $('body').data('cel');
        var formData = new FormData;
        formData.append('payment_id', MercadoPago.collection_id);
        formData.append('phone', cel);

        fetch("php/c/validar_pago_mercado_pago.php",{
            method: 'POST',
            body: formData
        }).then(response => response.text()).then(rpta => {
            var res = JSON.parse(rpta);
            // var data_return = JSON.parse(rpta);
            if(res.status == 'success'){
                $('.backdrop_modal').addClass('visible');
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
            }else if(res.status == 'pagado'){
                $('.backdrop_modal').addClass('visible');
                $('.top_modal').html('<img src="img/success.gif">');
                $('.modal_content').html('Este pago ya fue realizado anteriormente.');
                setTimeout(function(){
                    $('.backdrop_modal').removeClass('visible');
                    $('.backdrop_modal').html(`
                    <div class="success_alert">
                        <img src="img/success.gif">
                        <div class="text_success">
                            <h3>Pago realizado anteriormente</h3>
                            <p>Este pago ya fue realizado</p>
                            <button class="button_hov" id="back_button">
                                <span>Volver a la pagina</span>
                            </button>
                        </div>
                    </div>
                    `);
                },5000);
            }
            else{
                $('.backdrop_modal').addClass('visible');
                $('.top_modal').html('<img src="img/error.png">');
                $('.modal_content').html('Error, intenta más tarde');
                setTimeout(function(){
                    $('.backdrop_modal').removeClass('visible');
                    $('.backdrop_modal').html(`
                    <div class="modal">
                        <div class="top_modal">
                            <div class="loader green_load"></div>
                        </div>
                        <div class="modal_content">
                            Procesando pago...
                        </div>
                    </div>
                    `);
                },5000);
            }
        });
    }
    function URLToArray(url) {
        var request = {};
        var pairs = url.substring(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
            if(!pairs[i])
                continue;
            var pair = pairs[i].split('=');
            request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
         }
         return request;
      }      
    // end mercadopago
    // STRIPE
    // if search has pending
    if(window.location.search.indexOf('pending_stripe') != -1){
        var phone = $('body').data('cel');
        $('.backdrop_modal').addClass('visible');
        fetch("php/c/validar_pago_stripe.php?phone="+phone).then(response => response.text()).then(rpta => {
            var res = JSON.parse(rpta);
            if(res.status =='success'){
                $('.backdrop_modal').addClass('visible');
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
            }else if(res.status == 'pagado'){
                $('.backdrop_modal').addClass('visible');
                $('.top_modal').html('<img src="img/success.gif">');
                $('.modal_content').html('Este pago ya fue realizado anteriormente.');
                setTimeout(function(){
                    $('.backdrop_modal').removeClass('visible');
                    $('.backdrop_modal').html(`
                    <div class="success_alert">
                        <img src="img/success.gif">
                        <div class="text_success">
                            <h3>Pago realizado anteriormente</h3>
                            <p>Este pago ya fue realizado</p>
                            <button class="button_hov" id="back_button">
                                <span>Volver a la pagina</span>
                            </button>
                        </div>
                    </div>
                    `);
                },5000);
            }else{
                $('.top_modal').html('<img src="img/error.png">');
                $('.modal_content').html('Error, intenta más tarde');
                setTimeout(function(){
                    $('.backdrop_modal').removeClass('visible');
                    $('.backdrop_modal').html(`
                    <div class="modal">
                        <div class="top_modal">
                            <div class="loader green_load"></div>
                        </div>
                        <div class="modal_content">
                            Procesando pago...
                        </div>
                    </div>
                    `);
                },5000);
            }
        });
    }   
    // if search has error
    if(window.location.search.indexOf('error') != -1){
        $('.backdrop_modal').addClass('visible');
        $('.top_modal').html('<img src="img/error.png">');
        $('.modal_content').html('Error, intenta más tarde');
        setTimeout(function(){
            $('.backdrop_modal').removeClass('visible');
            $('.backdrop_modal').html(`
            <div class="modal">
                <div class="top_modal">
                    <div class="loader green_load"></div>
                </div>
                <div class="modal_content">
                    Procesando pago...
                </div>
            </div>
            `);
        },5000);
    } 
    // END STRIPE
    // PAYPAL
    var price = $('body').data('price');
    var cel = $('body').data('cel');
    // get offerid from search
    var offerid = $('body').data('offerid');
    paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: price
              }
            }]
          });
        },onApprove: (data, actions) => {
          return actions.order.capture().then(function(orderData) {
              // const transaction = orderData.purchase_units[0].payments.captures[0];
              fetch("php/c/validar_pago_paypal.php?paypal_orderid="+orderData.id+"&offerid="+offerid+"&phone="+cel).then(response => response.text()).then(rpta => {
                var res = JSON.parse(rpta);
                $('.backdrop_modal').addClass('visible');
                if(res.status == 'success'){
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
                    $('.top_modal').html('<img src="img/error.png">');
                    $('.modal_content').html('Error, intenta más tarde');
                    setTimeout(function(){
                        $('.backdrop_modal').removeClass('visible');
                        $('.backdrop_modal').html(`
                        <div class="modal">
                            <div class="top_modal">
                                <div class="loader green_load"></div>
                            </div>
                            <div class="modal_content">
                                Procesando pago...
                            </div>
                        </div>
                        `);
                    },5000);
                }
              });
          });
        }
      }).render('#paypal'); 
    // END PAYPAL
    // OPEN PAY
    // if exist id form_card
    if(document.getElementById('form_card')){
        var id_openpay = $('#script_openpay').data('id');
        var key_openpay = $('#script_openpay').data('key');
        OpenPay.setSandboxMode(true);
        OpenPay.setId(id_openpay);
        OpenPay.setApiKey(key_openpay);
        var form = OpenPay.token.extractFormInfo('form_card', success_callbak, error_callbak);
        var success_callbak = function(response) {
            var token_id = response.data.id;
        };
        var error_callbak = function(response) {
        var desc = response.data.description != undefined ? response.data.description : response.message;
        alert("ERROR [" + response.status + "] " + desc);
        };
        $(document).on('click', '#confirm_button', function(e) {
            var boton = $(this);
            // get cel from search
            var cel = $('body').data('cel');
            // get offerid from search
            var offerid = $('body').data('offerid');
            boton.addClass('disabled');
            $('.backdrop_modal').addClass('visible');
            boton.html('<div class="loader"></div>');
            OpenPay.token.extractFormAndCreate('form_card',function (response) {
                var token_id = response.data.id;
                var deviceSessionId = OpenPay.deviceData.setup("form_card", "deviceIdHiddenFieldName");
        
                var formData = new FormData;
                formData.append('id', token_id);
                formData.append('deviceSessionId', deviceSessionId);
                formData.append('offerid', offerid);
                formData.append('phone', cel);

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
                        $('.top_modal').html('<img src="img/error.png">');
                        $('.modal_content').html('Error, intenta más tarde');
                        setTimeout(function(){
                            $('.backdrop_modal').removeClass('visible');
                            $('.backdrop_modal').html(`
                            <div class="modal">
                                <div class="top_modal">
                                    <div class="loader green_load"></div>
                                </div>
                                <div class="modal_content">
                                    Procesando pago...
                                </div>
                            </div>
                            `);
                        },5000);
                }
                boton.html('PAGAR').removeClass('disabled');
                });
            });
        });
    }
    // OPEN PAY END
});