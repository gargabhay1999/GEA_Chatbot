<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/bookAppointment.php?model_num='+model_num+'serial_num='+serial_num+'&issue='+issue+'&name='+name+'&email='+email+'&phone='+phone+'&address='+address+'&zipcode='+zipcode+'&day='+day+'&start_time='+start_time+'&end_time='+end_time+'&tracking_num='+tracking_num";

if( $_GET["model_num"] && $_GET["serial_num"] && $_GET["issue"] && $_GET["name"] && $_GET["email"] && $_GET["phone"] && $_GET["address"] && $_GET["zipcode"] && $_GET["day"] && $_GET["start_time"] && $_GET["end_time"] && $_GET["tracking_num"] ) {
    $model_num = $_GET["model_num"];
    $serial_num = $_GET["serial_num"];
    $issue = $_GET["issue"];
    $name = $_GET["name"];
    $email = $_GET["email"];
    $phone = $_GET["phone"];
    $address = $_GET["address"];
    $day = $_GET["day"];
    $zipcode = $_GET["zipcode"];
    $start_time = $_GET["start_time"];
    $end_time = $_GET["end_time"];
    $tracking_num = $_GET["tracking_num"];

    $table_name = 'appointment';
    $sql = "INSERT INTO $table_name (`model_num`, `serial_num`, `issue`, `name`, `email`, `phone`, `address`, `zipcode`) VALUES('$model_num', '$serial_num', '$issue', '$name', '$email', '$phone', '$address', '$zipcode') ON DUPLICATE KEY UPDATE model_num = '$model_num', serial_num = '$serial_num', issue = '$issue', name = '$name', email = '$email', phone = '$phone', address = '$address', zipcode = '$zipcode'";
    $result = mysqli_query($connection, $sql);

    $table_name = 'appointment_slots';
    $sql = "INSERT INTO $table_name (`tracking_num`, `serial_num`, `day`, `start_time`, `end_time`) VALUES('$tracking_num', '$serial_num', '$day', '$start_time', '$end_time') ON DUPLICATE KEY UPDATE tracking_num = '$tracking_num', serial_num = '$serial_num', day = '$day', start_time = '$start_time', end_time = '$end_time'";
    $result = mysqli_query($connection, $sql);
    
    exit();
}

//AEE24DT ACZN9002 AC is not working  Abhay gargabhay1999@gmail.com 9790726927 600127
?> 
