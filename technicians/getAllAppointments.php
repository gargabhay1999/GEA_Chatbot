<?php 
header('Access-Control-Allow-Origin: *');  
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';

$url = "https://presecure1.000webhostapp.com/getAllAppointments.php?technician_id='+technician_id";

if( $_GET["technician_id"]) {
    $technician_id = $_GET["technician_id"];

    $sql = "SELECT A.*, B.* FROM appointment B join (SELECT * FROM `appointment_slots`where technician_id = $technician_id AND status = 'Pending')A on A.serial_num = B.serial_num";
    $result = mysqli_query($connection, $sql);
    $pending_status=0;
    $finished_status=0;
    if(mysqli_num_rows($result)>0){
        $pending_status=1;
        while($row = mysqli_fetch_assoc($result)){
            $serial_num = $row['serial_num'];
            $sql2 = "SELECT product_line FROM Appliances where serial_num='$serial_num'";
            $result2 = mysqli_query($connection, $sql2);
            if(mysqli_num_rows($result2)>0){
                while($row2 = mysqli_fetch_assoc($result2)){
                    $product_line = $row2['product_line'];
                }
            }

        	$slot = $row['day'].", ".$row['start_time']." - ".$row['end_time'];
            $pending[] = array('TrackingNo' => $row['tracking_num'], 'TechnicianId' => $row['technician_id'], 'SerialNo' => $row['serial_num'], 'ModelNo' => $row['model_num'], 'ProductName' => $product_line, 'Issue' => $row['issue'], 'ZipCode' => $row['zipcode'], 'Address' => $row['address'], 'Slot' => $slot);
        }

        // array_push($allAppointmentsDetails, $pending_arr);
    }

    $sql = "SELECT A.*, B.* FROM appointment B join (SELECT * FROM `appointment_slots`where technician_id = $technician_id AND status = 'Finished')A on A.serial_num = B.serial_num";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        $finished_status=1;
        while($row = mysqli_fetch_assoc($result)){
            $serial_num = $row['serial_num'];
            $sql2 = "SELECT product_line FROM Appliances where serial_num='$serial_num'";
            // echo $sql2;
            $result2 = mysqli_query($connection, $sql2);
            if(mysqli_num_rows($result2)>0){
                while($row2 = mysqli_fetch_assoc($result2)){
                    $product_line = $row2['product_line'];
                }
            }

        	$slot = $row['day'].", ".$row['start_time']." - ".$row['end_time'];
            $finished[] = array('TrackingNo' => $row['tracking_num'], 'TechnicianId' => $row['technician_id'], 'SerialNo' => $row['serial_num'], 'ModelNo' => $row['model_num'], 'ProductName' => $product_line, 'Issue' => $row['issue'], 'ZipCode' => $row['zipcode'], 'Address' => $row['address'], 'Slot' => $slot);
        }
        //$finished_arr = array('finished' => $finished);
    }
    if($pending_status==0){
        $pending = '';
    }
    if($finished_status==0){
        $finished = '';
    }
    $allAppointmentsDetails = array('pending' => $pending,'finished'=> $finished);
    echo $jsonformat=json_encode($allAppointmentsDetails);
    exit();
}
else{
    echo 0;
}
//PVM9179SKSS MOOP6664

?>
