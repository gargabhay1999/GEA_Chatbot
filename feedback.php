<?php 
include_once 'config/database.php';

if( $_GET["feedback"] &&  $_GET["tracking_num"]) {
    $feedback = $_GET["feedback"];
    $tracking_num = $_GET["tracking_num"];

    $sql = "UPDATE appointment_slots SET feedback = '$feedback' WHERE tracking_num = $tracking_num";
    // echo $sql;
    $result = mysqli_query($connection, $sql);
    exit();
}
?> 
