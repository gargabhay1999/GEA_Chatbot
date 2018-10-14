<?php 
header('Access-Control-Allow-Origin: *');  
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';

$url = "https://presecure1.000webhostapp.com/technicians.php/markStatusFinished.php?tracking_num='+tracking_num";

if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];
    
    $sql = "UPDATE appointment_slots SET status='Finished' WHERE tracking_num=$tracking_num";
    $result = mysqli_query($connection, $sql);
    echo 200;
    exit();
}
//PVM9179SKSS MOOP6664

?>
