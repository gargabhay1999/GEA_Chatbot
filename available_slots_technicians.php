<?php 
// function to geocode address, it will return false if unable to geocode address
include_once 'config/database.php';

$url = "https://presecure1.000webhostapp.com/available_slots_technicians.php?zipcode=600127";

if( $_GET["zipcode"]) {
    $zipcode = $_GET["zipcode"];
    $table_name = 'technicians';
    $sql = "SELECT * FROM $table_name WHERE zipcode='$zipcode'";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        $technician_details[] = array('technicians_available' => mysqli_num_rows($result));
        while($row = mysqli_fetch_assoc($result)){
        	$technician_info[] = array('technician_id' => $row['technician_id'], 'technician_name'=> $row['technician_name'], 'zipcode'=> $row['zipcode'], 'mobile_num'=> $row['mobile_num'], 'day'=> $row['day'], 'start_time'=> $row['start_time'], 'end_time'=> $row['end_time']);
        }
        array_push($technician_details, $technician_info);
    }
    else{
    	$technician_details[] = array('technicians_available' => 0);
    }
    echo $jsonformat=json_encode($technician_details);
    exit();
}
if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];
    $table_name = 'technicians';

    $sql = "SELECT serial_num, tracking_num from appointment_slots where tracking_num='$tracking_num'";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        $sql = "SELECT D.* FROM technicians D join (SELECT B.zipcode FROM appointment B join (SELECT serial_num, tracking_num from appointment_slots where tracking_num='$tracking_num')A on A.serial_num = B.serial_num)C on D.zipcode=C.zipcode";
        $result = mysqli_query($connection, $sql);
        if(mysqli_num_rows($result)>0){
            $technician_details[] = array('valid' => 1, 'technicians_available' => mysqli_num_rows($result));
            while($row = mysqli_fetch_assoc($result)){
                $technician_info[] = array('technician_id' => $row['technician_id'], 'technician_name'=> $row['technician_name'], 'zipcode'=> $row['zipcode'], 'mobile_num'=> $row['mobile_num'], 'day'=> $row['day'], 'start_time'=> $row['start_time'], 'end_time'=> $row['end_time']);
            }
            array_push($technician_details, $technician_info);
        }
        else{
            $technician_details[] = array('technicians_available' => 0);
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
