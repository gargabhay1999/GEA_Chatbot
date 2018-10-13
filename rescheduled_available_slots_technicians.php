<?php 
include_once 'config/database.php';

if( $_GET["tracking_num"]) {
    $tracking_num = $_GET["tracking_num"];
    $sql = "SELECT * FROM  appointment_slots WHERE tracking_num=$tracking_num";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            $cancelled = $row['cancelled'];
            $status = $row['status'];
        }
        if($status=='Finished'){
            $technician_details[] = array('valid' => 1, 'status' => 'Finished');
        }
        else if($cancelled==0){
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
                $technician_details[] = array('valid' => 1, 'status' => 'Pending', 'cancelled' => 0, 'technicians_available' => 0);
            }
        }
        else if ($cancelled==1){
            $technician_details[] = array('valid' => 1, 'status' => 'Cancel', 'cancelled' => 1);
        }
    }
    else{
        $technician_details[] = array('valid' => 0);
    }
    echo $jsonformat=json_encode($technician_details);
    exit();
}

?>
