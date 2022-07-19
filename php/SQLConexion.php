<?php
class SQLConexion{
	//propiedades
	public $conexion;
	
	
	// private $server='localhost';
    // private $usuario='root';
    // private $clave='';
    // private $bd='domicilios';
	
	
    private $server='localhost';
    private $usuario='root';
    private $clave='';
    private $bd='instacel';
	
	/*
	private $server='localhost';
    private $usuario='bexpress_jbdelivery';
    private $clave='Jh2(!nnTs;tA';
    private $bd='bexpress_jbdelivery';
    */
    //Conectarse a la BD
	public function conectar(){
		$this->conexion=@new mysqli($this->server,$this->usuario,$this->clave,$this->bd);
        if ($this->conexion->connect_error)
            die('Error de Conexion :(');
        else
            $this->conexion->set_charset("utf8mb4");
    }    
    
    //desconectarse a la DB
    public function desconectar(){
		$this->conexion->close();
    }
	
      
	//Ejecuta un query y retorna el resultado en un Array
	//Solo utilizar cuando el resultado del Query provenga de un Select
	//Ya sea un Select Directo o dentro de un SP
	public function obtenerResultado($QueryString){
		$this->conectar();
		$Resultado=$this->conexion->query($QueryString); //Ejecucion del Query
		$Datos=array(); //Declaracion Array donde almacenaremos nuestros datos
		$i=0;
		
		while($fila=$Resultado->fetch_array()){
			$Datos[$i]=$fila;
			$i++;
		}
		$this->desconectar();	
		return $Datos;	
	}
	
	//Para obtener el resultado de ejecutar un query que no devuelve datos, como Insert,Delete,Update.
	//Resultado retorna TRUE si el query se ejecuto correctamente.
	public function obtenerResultadoSimple($QueryString){
		$this->conectar();
			$Resultado=$this->conexion->query($QueryString);
			$this->desconectar();
		Return $Resultado;
	}
	
	public function obtenerResultadoID($QueryString1){
		$this->conectar();
		$Resultado1=$this->conexion->query($QueryString1);
		$Resultado2=$this->conexion->query("SELECT @_ID as _ID;"); //Ejecucion del Query
		$Datos=array(); //Declaracion Array donde almacenaremos nuestros datos
		$i=0;
		
		while($fila=$Resultado2->fetch_array()){
			$Datos[$i]=$fila;
			$i++;
		}
		$this->desconectar();	
		return $Datos;				
	}
	
	//Escapa caracteres especiales en un string. Ayuda a prevenir inyecciones SQL

	public function escapar($string){
		$this->conectar();
		
		//Evalua si el argumento que se le pasa es un arreglo
		if(is_array($string)){
			$funcion = array($this->conexion,"real_escape_string"); // Si lo es, guarda en un arreglo el contexto y el nombre de la funci贸n real_escape_string
			$escapedArray = array_map($funcion,$string); // Le aplica dicha funci贸n a todo el arreglo
			return $escapedArray; // Retorna el arreglo ya escapado y sale de la funci贸n
		}
		// Si no es un arreglo, escapa el string y lo retorna
		$escapedString = $this->conexion->real_escape_string($string);
		$this->desconectar();
		return $escapedString;
	}	
	
}
function select_imagen($ruta,$id,$n_carpetas = 0,$n_carpetas_vista = 0,$numero = 0){
    $dir = '';
    for ($i=0; $i < $n_carpetas; $i++) { 
        $dir = $dir.'../';
    }
    $vista = '';
    for ($i=0; $i < $n_carpetas_vista; $i++) { 
        $vista = $vista.'../';
    }
    // Toma la ruta desde el controlador a la imagen
    $ruta_full = $dir.'img/'.$ruta.'/'.$id;
    // Toma la ruta desde el archivo a la imagen
    $ruta = $vista.'img/'.$ruta;
    // Si el directorio existe
    if(is_dir($ruta_full)){
        // Si existe más de un archivo (ignora '.','..')
        if(count(scandir($ruta_full)) > 2){
            $primer_archivo = scandir($ruta_full)[2 + $numero];
            // Regresa la ruta del archivo a mostrar en la vista
            return $ruta.'/'.$id.'/'.$primer_archivo;
        }else{
            // Solo aparece cuando existe carpeta pero no la imagen
            return 'img/logo.png';
        }
    }else{
        // Solo aparece si no existe la carpeta, muestra la imagen por defecto de la carpeta
        return 'img/logo.png';
    }
    return $ruta;
}
function crear_li_oferta($numero,$tipo = ' GB',$texto = ' para navegar'){
	if ($numero > 0) {
		return 
		"<li class='position-item'>
			<span class='count'>$numero $tipo </span>
			$texto
		</li>";
	}else{
		return false;
	}
}
?>