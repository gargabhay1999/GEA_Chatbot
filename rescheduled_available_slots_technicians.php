<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/available_slots_technicians.php?tracking_num='+tracking_num";

if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];
    $sql = "SELECT cancelled, tracking_num FROM  appointment_slots WHERE tracking_num=$tracking_num";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            $cancelled = $row['cancelled'];
        }
        if($cancelled==0){
            $sql = "SELECT F.* FROM technicians F join (SELECT D.day, D.start_time, D.end_time, C.* FROM appointment_slots D join(SELECT B.zipcode FROM appointment B join (SELECT serial_num FROM appointment_slots WHERE tracking_num=$tracking_num)A on A.serial_num=B.serial_num)C on D.tracking_num = $tracking_num)E on F.zipcode = E.zipcode AND E.day<>F.day";
            $result = mysqli_query($connection, $sql);
            if(mysqli_num_rows($result)>0){
                $technician_details[] = array('valid' => 1, 'cancelled' => 0, 'technicians_available' => mysqli_num_rows($result));
                while($row = mysqli_fetch_assoc($result)){
                    $technician_info[] = array('technician_id' => $row['technician_id'], 'technician_name'=> $row['technician_name'], 'zipcode'=> $row['zipcode'], 'mobile_num'=> $row['mobile_num'], 'day'=> $row['day'], 'start_time'=> $row['start_time'], 'end_time'=> $row['end_time']);
                }
                array_push($technician_details, $technician_info);
            }
            else{
                $technician_details[] = array('valid' => 1, 'cancelled' => 0, 'technicians_available' => 0);
            }
        }
        else if ($cancelled==1){
            $technician_details[] = array('valid' => 1, 'cancelled' => 1);
        }
    }
    else{
        $technician_details[] = array('valid' => 0);
    }
    echo $jsonformat=json_encode($technician_details);
    exit();
}
//PVM9179SKSS MOOP6664

?>
