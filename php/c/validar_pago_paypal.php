<?php

// Obtenemos los datos del servidor
session_start();
include_once("funciones.php");
$sql = new SQLConexion();
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");

// Urls de la Api de Paypal
$sandbox = 'https://api-m.sandbox.paypal.com/'; // Api Sandbox URL
$live = 'https://api.paypal.com/'; // Api Live URL
$paypal_url = $sandbox;


// Obtener el access token de PayPal

// Declaramos las credenciales de PayPal
$public = $select_keys[0]['valor_configuracion'];
$secret = $select_keys[1]['valor_configuracion'];

// Comenzamos el curl para el access token
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $paypal_url.'v1/oauth2/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
curl_setopt($ch, CURLOPT_USERPWD, $public . ':' . $secret);

$headers = array();
$headers[] = 'Content-Type: application/x-www-form-urlencoded';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
$result = json_decode($result, true);
$access_token =  $result['access_token'];



// Obtenemos los detalles de la orden
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $paypal_url.'v2/checkout/orders/'.$_GET['paypal_orderid']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


$headers = array();
$headers[] = 'Content-Type: application/json';
$headers[] = 'Authorization: Bearer '.$access_token;
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
$result = json_decode($result, true);
if($result['status'] == 'COMPLETED'){
  // Seleccionamos el ID de la tarjeta SIM por el telefono
  $rpta = $sql->obtenerResultado("SELECT fn_select_id_estado_sim('".$_GET['phone']."',1,3)");
  $SIM = $rpta[0][0];
  
  // Sleccionamos la linea telefonica por el ID de la SIM
  $id_linea = $sql->obtenerResultado("SELECT fn_select_linea_telefonica('".$SIM."')");
  $pagar = $sql->obtenerResultadoSimple("CALL sp_insert_contratos_lineas_telefonicas1('".$id_linea[0][0]."',2,'".$_GET['offerid']."')");
  // echo terminar_pago_api($_GET['offerid'],$id_linea[0][0]);
  json_encode(
    array(
        'status' => 'success',
    )
  );
}else{
  echo json_encode(
      array(
          'status' => 'error',
      )
  );
}