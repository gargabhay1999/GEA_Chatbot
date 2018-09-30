<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/validate_model_serial_num.php?model_num=AEE24DT&serial_num=ACZN9002";

if( $_GET["model_num"] && $_GET["serial_num"] ) {
    $serial_num = $_GET["serial_num"];
    $model_num = $_GET["model_num"]; 

    $table_name = 'Appliances';
    $sql = "SELECT * FROM $table_name WHERE `serial_num`='$serial_num' AND `model_num`='$model_num'";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
        	$applianceDetails[] = array('valid' => 1, 'serial_num'=> $row['serial_num'],'model_num'=> $row['model_num'], 'product_line' => $row['product_line']);
        }
    }
    else{
    	$applianceDetails[] = array('valid' => 0);
    }
    echo $jsonformat=json_encode($applianceDetails);
    exit();
}
?>