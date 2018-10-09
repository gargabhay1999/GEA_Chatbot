<?php 
header('Access-Control-Allow-Origin: *');  
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/validate_tracking_num.php?tracking_num='+tracking_num";

if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];

    $sql = "SELECT * FROM appointment_slots WHERE tracking_num = $tracking_num";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){

            $cancelled = $row['cancelled'];
            if($cancelled == 1){
                $cancel_flag=1;
            }
            else{
                $cancel_flag=0;
            }

            $finished = $row['status'];
            if($finished == "Finished"){
                $finish_flag=1;
            }
            else{
                $finish_flag=0;
            }

            $valid_tracking_json = array('valid' => 1, 'cancelled' => $cancel_flag, 'finished' => $finish_flag);
        }
    }
    else{
        $valid_tracking_json = array('valid' => 0);
    }
    echo $jsonformat=json_encode($valid_tracking_json);
    exit();
}
else{
    echo 0;
}
?>
