<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();

// Obtener la Secret Key de Stripe
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");
$secret_stripe = $select_keys[2]['valor_configuracion'];

require '../../stripe/vendor/autoload.php';
\Stripe\Stripe::setApiKey($secret_stripe);
$return = \Stripe\Checkout\Session::retrieve($_SESSION['stripe_session_id'],[]);

if($return['status'] == 'complete'){
    // Seleccionamos el ID de la tarjeta SIM por el telefono
    $rpta = $sql->obtenerResultado("SELECT fn_select_id_estado_sim('".$_GET['phone']."',1,3)");
    $SIM = $rpta[0][0];
    
    // Sleccionamos la linea telefonica por el ID de la SIM
    $id_linea = $sql->obtenerResultado("SELECT fn_select_linea_telefonica('".$SIM."')");
    $pagar = $sql->obtenerResultadoSimple("CALL sp_insert_contratos_lineas_telefonicas1('".$id_linea[0][0]."',3,'".$_SESSION['offer_id']."')");
    echo terminar_pago_api($_SESSION['offer_id'],$id_linea[0][0]);
}else{
    echo json_encode(
        array(
            'status' => 'error',
        )
    );
}