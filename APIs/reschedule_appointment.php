<?php 
include_once 'config/database.php';

if( $_GET["tracking_num"]  &&  $_GET["day"]  && $_GET["start_time"]  && $_GET["end_time"]) {
    $tracking_num = $_GET["tracking_num"];
    $day = trim($_GET["day"]);
    $start_time = trim($_GET["start_time"]);
    $end_time = trim($_GET["end_time"]);

    $sql = "SELECT * FROM technicians WHERE day = '$day' AND start_time = '$start_time' AND end_time = '$end_time'";
    // echo $sql;
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            $technician_id = $row['technician_id'];
        }
    }

    $table_name = 'appointment_slots';
    $sql = "SELECT cancelled, status  FROM $table_name WHERE tracking_num='$tracking_num'";
    $result = mysqli_query($connection, $sql);
    $flag=0;
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            if($row['cancelled'] == '1'){
                $applianceDetails[] = array('status'=> $row['status']);
                $flag=1;
            }
            else{
                $flag=0;
            }
        }
    }

    if($flag==0){
        $sql = "UPDATE $table_name SET `technician_id` = $technician_id, `rescheduled_count`=rescheduled_count+1, day = '$day', start_time = '$start_time', end_time = '$end_time' WHERE tracking_num='$tracking_num'";
        //echo $sql."\n";
        $result = mysqli_query($connection, $sql);

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
    }
    echo $jsonformat=json_encode($applianceDetails);
    exit();
}
?> 
