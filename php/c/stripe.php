<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();

// Obtener la información del paquete
$rpta = $sql->obtenerResultado("CALL sp_select_paquete_offerid({$_GET['offerid']})");
$_SESSION['offer_id'] = $_GET['offerid'];
// Obtener la Secret Key de Stripe
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");
$secret_stripe = $select_keys[2]['valor_configuracion'];

require '../../stripe/vendor/autoload.php';
\Stripe\Stripe::setApiKey($secret_stripe);
header('Content-Type: application/json');
$YOUR_DOMAIN = 'http://localhost/recargas/cautivo';
$checkout_session = \Stripe\Checkout\Session::create([
    'line_items' => [[
        'price_data' => [
            'currency' => 'MXN',
            'product_data' => [
            'name' => $rpta[0]['nombre_paquete'],
            ],
            'unit_amount' => str_replace(".", "", $rpta[0]['precio_paquete']),
        ],
        'quantity' => 1,
    ]],
  'mode' => 'payment',
  'success_url' => $YOUR_DOMAIN . '#pending_stripe',
  'cancel_url' => $YOUR_DOMAIN . '#error',
]);
$_SESSION['stripe_session_id'] = $checkout_session['id'];
// $validar_pago = \Stripe\Checkout\Session::retrive([
//   'mode' => 'payment',
// ]);

header("HTTP/1.1 303 See Other");
header("Location: " . $checkout_session->url);