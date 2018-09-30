<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/show_status.php?tracking_num=12345";

if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];

    $sql = "select D.*, E.issue, E.phone, E.address, E.zipcode FROM appointment E inner join (select model_num, product_line, B.* from Appliances C inner join (SELECT A.* from appointment_slots AS A WHERE tracking_num='$tracking_num')B on B.serial_num = C.serial_num)D on E.serial_num = D.serial_num";
    //echo $sql;
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
         $applianceDetails[] = array('valid' => 1, 'status'=> $row['status'], 'product_line'=> $row['product_line'], 'day'=> $row['day'], 'start_time'=> $row['start_time'], 'end_time'=> $row['end_time'], 'address'=> $row['address'], 'zipcode'=> $row['zipcode'], 'serial_num'=> $row['serial_num'], 'model_num' => $row['model_num'], 'issue' => $row['issue'], 'phone' => $row['phone']);
        }
    }
    else{
        $applianceDetails[] = array('valid' => 0);
    }
    echo $jsonformat=json_encode($applianceDetails);
    
    exit();
}

//AEE24DT ACZN9002 AC is not working  Abhay gargabhay1999@gmail.com 9790726927 600127
?> 

