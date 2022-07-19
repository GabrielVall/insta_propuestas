<?php
session_start();
include_once("../SQLConexion.php");
$sql = new SQLConexion();
// $telefono = $sql->obtenerResultado("CALL sp_select_telefono_existente('".$_POST['numero']."')");
// if success return json
if (0 == 0) {
    echo json_encode(array('status' => true));
}