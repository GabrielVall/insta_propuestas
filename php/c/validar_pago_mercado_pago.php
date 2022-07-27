<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();
// Obtener la Secret Key de MercadoPago
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");
$secret_mp = $select_keys[3]['valor_configuracion'];

$ACCESS_TOKEN = $secret_mp; //aqui cargamos el token
$curl = curl_init(); //iniciamos la funcion curl

curl_setopt_array($curl, array(
//ahora vamos a definir las opciones de conexion de curl
  CURLOPT_URL => "https://api.mercadopago.com/v1/payments/".$_POST['payment_id'], //aqui iria el id de tu pago
  CURLOPT_CUSTOMREQUEST => "GET", // el metodo a usar, si mercadopago dice que es post, se cambia GET por POST.
  CURLOPT_RETURNTRANSFER => true, //esto es importante para que no imprima en pantalla y guarde el resultado en una variable
  CURLOPT_ENCODING => "",
  CURLOPT_TIMEOUT => 0, 
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_HTTPHEADER => array(
    'Authorization: Bearer '.$ACCESS_TOKEN
  ),
));



$response = curl_exec($curl); //ejecutar CURL
$json_data = json_decode($response, true); //a la respuesta obtenida de CURL la guardamos en una variable con formato json.


//ahora por ejemplo, queremos obtener el status de pago, hacemos esto:
$status=$json_data["status"];

if ($status == 'approved') {
  // Seleccionamos el ID de la tarjeta SIM por el telefono
  $rpta = $sql->obtenerResultado("SELECT fn_select_id_estado_sim('".$_POST['phone']."',1,3)");
  $SIM = $rpta[0][0];
  
  // Sleccionamos la linea telefonica por el ID de la SIM
  $id_linea = $sql->obtenerResultado("SELECT fn_select_linea_telefonica('".$SIM."')");
  $pagar = $sql->obtenerResultadoSimple("CALL sp_insert_contratos_lineas_telefonicas1('".$id_linea[0][0]."',4,'".$_SESSION['offer_id']."')");
  echo terminar_pago_api($_SESSION['offer_id'],$id_linea[0][0]);
}else{
  echo json_encode(
    array(
        'status' => 'error',
    )
);
}


//aqui se pueden ver todas las otras variables que obtenemos de un pago:
//https://www.mercadopago.com.ar/developers/es/guides/manage-account/account/retrieving-payments

// echo json_encode($json_data);