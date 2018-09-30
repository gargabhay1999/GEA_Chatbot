<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/validate_model_serial_num.php?zipcode=123456";

if( $_GET["zipcode"]) {
    $zipcode = $_GET["zipcode"];

    $table_name = 'technicians';
    $sql = "SELECT * FROM $table_name WHERE `zipcode`='$zipcode'";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        $validateZipcode[] = array('valid' => 1);
    }
    else{
    	$validateZipcode[] = array('valid' => 0);
    }
    echo $jsonformat=json_encode($validateZipcode);
    exit();
}
?>