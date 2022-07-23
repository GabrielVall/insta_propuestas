$(document).ready(function() {
    var contenedor = document.getElementsByClassName("bottom_card")[0];
    var button_next = document.getElementsByClassName('btn_next')[0];
    // on click
    $(document).on('click', '#btn_next', function(e) {
        var cel = document.getElementById('celular').value;
        var cbx = document.getElementById('cbx');
        button_next.innerHTML = '<div class="loader"></div>';
        button_next.classList.add('disabled');
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
                    contenedor.classList.add('full');
                    }else{
                        alert(data.status);
                    }
                }
            });
            
            if(cbx.checked) {
                // localStorage.setItem('celular', cel);
            }
            
        }else{
            alert('Tu número de celular no es válido, por favor verifica que sea correcto');
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
        console.log(text.length);
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
        $('.cerdit_card')[0].classList.add('hidden');
        $('.cerdit_card')[1].classList.remove('hidden');
    });
    // on blur input
    $(document).on('blur', '#cvv', function(e) {
        $('.cerdit_card')[1].classList.add('hidden');
        $('.cerdit_card')[0].classList.remove('hidden');
    });
    $(document).on('click', '.square', function(e) {
        $('.square').removeClass('selected');
        $(this).addClass('selected');
    });
    $(document).on('click', '#confirm_button', function(e) {
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
                  console.log('success');
              }else{
                    console.log('error');
              }
            });
        });
    });
});