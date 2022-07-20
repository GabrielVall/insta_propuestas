window.onload = function() {
    
    var button_next = document.getElementsByClassName('btn_next')[0];
    // on click
    button_next.onclick = function(e) {
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
    }
}