<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();

// Info del paquete
$rpta = $sql->obtenerResultado("CALL sp_select_paquete_id({$_POST['offerid']})");

// Obtener las keys de Openpay
$select_keys = $sql->obtenerResultado("CALL sp_select_keys()");
$id_openpay = $select_keys[4]['valor_configuracion'];
$sk_openpay = $select_keys[6]['valor_configuracion'];

// Usamos la libreria de Openpay, si no existe se puede agregar utilizando el comando "composer require openpay/sdk"
require_once '../../openpay/vendor/autoload.php';
use Openpay\Data\Openpay;

// Llamamos al SDK de Openpay con las credenciales de acceso
$openpay = Openpay::getInstance($id_openpay,$sk_openpay,'MX');

// Creamos un id unico en base a la fecha y hora actual
$id_date = uniqid(time(), true);

// Creamos un objeto de cliente para la tarjeta de credito
$customer = array(
     'name' => 'Cliente',
     'last_name' => 'Instacel',
     'phone_number' => $_POST['phone'],
     'email' => 'nomail@instacel.com.mx'
);

// Creamos un objeto de tarjeta de credito
$chargeRequest = array(
    'method' => 'card',
    'source_id' => $_POST['id'],
    // 'amount' => $rpta[0]['precio_paquete'],
    'amount' => 10,
    'currency' => 'MXN',
    // 'description' => $rpta[0]['nombre_paquete'],
    'description' => 'Paquete de prueba',
    'order_id' => $id_date,
    'device_session_id' => $_POST['deviceSessionId'],
    'customer' => $customer
);

// Realizamos la transaccion
$charge = $openpay->charges->create($chargeRequest);

// Validamos que la transaccion se haya realizado correctamente
$findDataRequest = array(
    'order_id' => $id_date
);

// Buscamos la transaccion
$chargeList = $openpay->charges->getList($findDataRequest);

// Validamos que la transaccion se haya realizado correctamente
$payment_status = $chargeList[0]->status;

// Si la transaccion se realizo correctamente
if ($payment_status == 'completed') {
    // Seleccionamos el ID de la tarjeta SIM por el telefono
    $sm_tel = $sql->obtenerResultado("SELECT fn_select_id_estado_sim('".$_POST['phone']."',1,3)");
    $SIM = $sm_tel[0][0];

    // Sleccionamos la linea telefonica por el ID de la SIM
    $id_linea = $sql->obtenerResultado("SELECT fn_select_linea_telefonica('".$SIM."')");

    // Guardamos la informacion de la transaccion en la base de datos
    $pagar = $sql->obtenerResultadoSimple("CALL sp_insert_contratos_lineas_telefonicas1('".$id_linea[0][0]."',5,'".$_POST['offerid']."')");

    echo terminar_pago_api($_POST['offerid'],$id_linea[0][0]);

}else{
    echo json_encode(array('status' => 'error'));
}