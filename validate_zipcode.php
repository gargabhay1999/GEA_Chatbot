<?php 
include_once 'config/database.php';

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
