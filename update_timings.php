<?php 
include_once 'config/database.php';

if( $_GET["serial_num"]  &&  $_GET["day"]  && $_GET["start_time"]  && $_GET["end_time"]  && $_GET["tracking_num"] ) {
    $serial_num = $_GET["serial_num"];
    $day = $_GET["day"];
    $start_time = $_GET["start_time"];
    $end_time = $_GET["end_time"];
    $tracking_num = $_GET["tracking_num"];


    $table_name = 'appointment_slots';
    $sql = "INSERT INTO $table_name (`tracking_num`, `serial_num`, `day`, `start_time`, `end_time`) VALUES('$tracking_num', '$serial_num', '$day', '$start_time', '$end_time') ON DUPLICATE KEY UPDATE tracking_num = '$tracking_num', serial_num = '$serial_num', day = '$day', start_time = '$start_time', end_time = '$end_time'";
    //echo $sql;
    //$sql = "SELECT * FROM $table_name WHERE `serial_num`='$serial_num' AND `model_num`='$model_num'";
    $result = mysqli_query($connection, $sql);
    // if(mysqli_num_rows($result)>0){
    //     while($row = mysqli_fetch_assoc($result)){
    //      $applianceDetails[] = array('serial_num'=> $row['serial_num'],'model_num'=> $row['model_num'], 'product_line' => $row['product_line']);
    //     }
    // }
    //echo $jsonformat=json_encode($applianceDetails);
    exit();
}

?> 
