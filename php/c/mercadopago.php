<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();
$rpta = $sql->obtenerResultado("CALL sp_select_paquete_offerid({$_GET['offerid']})");
$_SESSION['offer_id'] = $_GET['offerid'];

// Obtener la Secret Key de MercadoPago
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");
$secret_mp = $select_keys[3]['valor_configuracion'];

// SDK de Mercado Pago
require  '../../mercado/vendor/autoload.php';

// Agrega credenciales
MercadoPago\SDK::setAccessToken($secret_mp);


// Crea un objeto de preferencia
$preference = new MercadoPago\Preference();
$YOUR_DOMAIN = 'http://localhost/recargas/pago.php';
// Crea un 赤tem en la preferencia
$item = new MercadoPago\Item();
$item->title = 'Paquete instacel: '.$rpta[0]['nombre_paquete']; 
$item->quantity = 1;
$item->unit_price = $rpta[0]['precio_paquete'];
$preference->items = array($item);
$preference->binary_mode = true;
    $filters = array(
    "binary_mode" => "true"
    );
$preference->back_urls = array(
    "success" => $YOUR_DOMAIN . '?pending_mercadopago=1&offerid='.$_GET['offerid'].'&cel='.$_GET['cel'],
    "failure" => $YOUR_DOMAIN . '?error=1&offerid='.$_GET['offerid'].'&cel='.$_GET['cel'],
);
$preference->auto_return = "approved";
$preference->save();
echo $preference->init_point;
?>