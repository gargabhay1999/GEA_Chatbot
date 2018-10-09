<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/feedback.php?feedback=someFeedback&tracking_num=124563";

if( $_GET["feedback"] &&  $_GET["tracking_num"]) {
    $feedback = $_GET["feedback"];
    $tracking_num = $_GET["tracking_num"];

    $sql = "UPDATE appointment_slots SET feedback = '$feedback' WHERE tracking_num = $tracking_num";
    // echo $sql;
    $result = mysqli_query($connection, $sql);
    exit();
}
//AEE24DT ACZN9002 AC is not working  Abhay gargabhay1999@gmail.com 9790726927 600127
?> 
