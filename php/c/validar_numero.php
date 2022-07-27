<?php
session_start();
include_once("funciones.php");
$sql = new SQLConexion();
$telefono = $sql->obtenerResultado("CALL sp_select_telefono_existente('".$_POST['cel']."')");
// if success return json
if (count($telefono) > 0) {
    echo json_encode(array('status' => true));
}else{
    echo json_encode(array('status' => false));
}