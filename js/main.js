window.onload = function() {
    var button_next = document.getElementsByClassName('btn_next')[0];
    // on click
    button_next.onclick = function(e) {
        var cel = document.getElementById('celular').value;
        button_next.innerHTML = '<div class="loader"></div>';
        button_next.classList.add('disabled');
        // if cel is valid
        if (cel.length == 10) {

        }
    }
}