<?php
class SQLConexion{

	private $server='localhost';
    private $usuario='admininstacel_instacel_root';
    private $clave='q.)gtc}SQ;F}';
    private $bd='admininstacel_instacel';
	
	public function conectar(){
		$this->conexion=@new mysqli($this->server,$this->usuario,$this->clave,$this->bd);
        if ($this->conexion->connect_error)
            die('Error de Conexion :(');
        else
            $this->conexion->set_charset("utf8mb4");
    }    
    
    public function desconectar(){
		$this->conexion->close();
    }
	
	public function obtenerResultado($QueryString){
		$this->conectar();
		$Resultado=$this->conexion->query($QueryString);
		$Datos=array();
		$i=0;
		
		while($fila=$Resultado->fetch_array()){
			$Datos[$i]=$fila;
			$i++;
		}
		$this->desconectar();	
		return $Datos;	
	}
	
	public function obtenerResultadoSimple($QueryString){
		$this->conectar();
			$Resultado=$this->conexion->query($QueryString);
			$this->desconectar();
		Return $Resultado;
	}
	
	public function obtenerResultadoID($QueryString1){
		$this->conectar();
		$Resultado1=$this->conexion->query($QueryString1);
		$Resultado2=$this->conexion->query("SELECT @_ID as _ID;");
		$Datos=array();
		$i=0;
		
		while($fila=$Resultado2->fetch_array()){
			$Datos[$i]=$fila;
			$i++;
		}
		$this->desconectar();	
		return $Datos;				
	}
	
	public function escapar($string){
		$this->conectar();
		if(is_array($string)){
			$funcion = array($this->conexion,"real_escape_string");
			$escapedArray = array_map($funcion,$string);
			return $escapedArray;
		}
		
		$escapedString = $this->conexion->real_escape_string($string);
		$this->desconectar();
		return $escapedString;
	}	
	
}
function function_api_altan_1($url, $method, $authorization, $data=''){

	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_POST, $method=='POST' ?  true : false);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  
	
	$headers = array(
		'Authorization: '.$authorization,
		"Content-Type: application/json",
	);
	
	// $data = '{"offeringId": "1879901143","msisdnPorted": "","idPos": ""}';
	if($data!=''){
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	}
	else{
		array_push($headers,"Content-Length: 0");
	}
	
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	//for debug only!
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
  
	$response = curl_exec($curl);
	curl_close($curl);
	return json_decode($response, true);
  
  }
  function terminar_pago_api($id_oferta,$id_linea){
  global $sql;
	// Enviamos la solicitud a altan
  $token = function_api_altan_1('https://altanredes-prod.apigee.net/v1/oauth/accesstoken?grant-type=client_credentials','POST','Basic NlRZNkhhdzVsY3R3THlTeFdYNk9OT1N1MHE4dHA4R3I6RFJxQVNFb2h2dHpkWG81RA==');
  var_dump($offerid[0][0]);
  $offerid=$sql->obtenerResultado("SELECT fn_select_offerid('".$id_oferta."')");
  $msisdn=$sql->obtenerResultado("SELECT fn_select_msisdn('".$id_linea."')");
  // ACTIVACIÓN DE SIMCARD EN LA API
//   $data_json = array("msisdn"=>$msisdn[0][0], "offerings"=>[$offerid[0][0]]);
  //$rpta_activacion=function_api_altan_1('https://altanredes-prod.apigee.net/cm/v1/products/purchase','POST','Bearer '. $token["accessToken"],json_encode($data_json));
  if (array_key_exists('effectiveDate', $rpta_activacion)){
    // Retornamos el estado del pago
    return json_encode(
      array(
          'status' => 'success',
      )
    );
  }else{
	return json_encode(
		array(
			'status' => 'error',
		)
	  );
  } 
  }
?>