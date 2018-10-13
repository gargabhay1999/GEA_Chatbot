<?php 
include_once 'config/database.php';

if( $_GET["model_num"] && $_GET["serial_num"] && $_GET["issue"] && $_GET["name"] && $_GET["email"] && $_GET["phone"] && $_GET["zipcode"]) {
    $model_num = $_GET["model_num"]; 
    $serial_num = $_GET["serial_num"];
    $issue = $_GET["issue"];
    $name = $_GET["name"];
    $email = $_GET["email"];
    $phone = $_GET["phone"];
    $address = $_GET["address"];
    $zipcode = $_GET["zipcode"];

    $table_name = 'appointment';
    $sql = "INSERT INTO $table_name (`model_num`, `serial_num`, `issue`, `name`, `email`, `phone`, `address`, `zipcode`) VALUES('$model_num', '$serial_num', '$issue', '$name', '$email', '$phone', '$address', '$zipcode') ON DUPLICATE KEY UPDATE model_num = '$model_num', serial_num = '$serial_num', issue = '$issue', name = '$name', email = '$email', phone = '$phone', address = '$address', zipcode = '$zipcode'";
    echo $sql;
    $result = mysqli_query($connection, $sql);
    // if(mysqli_num_rows($result)>0){
    //     while($row = mysqli_fetch_assoc($result)){
    //     	$applianceDetails[] = array('serial_num'=> $row['serial_num'],'model_num'=> $row['model_num'], 'product_line' => $row['product_line']);
    //     }
    // }
    //echo $jsonformat=json_encode($applianceDetails);
    exit();
}

?> 

