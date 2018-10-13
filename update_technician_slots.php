<?php 
include_once '../config/database.php';

if( $_GET["dayID"] && $_GET["shiftId"] && $_GET["status"] && $_GET["technician_id"]) {
    $dayID = $_GET["dayID"];
    $shiftId = $_GET["shiftId"];
    $status = $_GET["status"];
    $technician_id = $_GET["technician_id"];
    switch ($dayId) {
        case 0:
            $day = 'Monday';
            break;
        case 1:
            $day = 'Tuesday';
            break;
        case 2:
            $day = 'Wednesday';
            break;
        case 3:
            $day = 'Thursday';
            break;
        case 4:
            $day = 'Friday';
            break;
        default:
            # code...
            break;
    }

    switch ($shiftId) {
        case 0:
            $start_time = '8 AM';
            $end_time = '9:30 AM';
            break;
        case 1:
            $start_time = '8 AM';
            $end_time = '9:30 AM';
            break;
        case 2:
            $start_time = '8 AM';
            $end_time = '9:30 AM';
            break;
        case 3:
            $start_time = '8 AM';
            $end_time = '9:30 AM';
            break;
        default:
            # code...
            break;
    }

    echo $day." ".$start_time." ".$end_time;
    exit();
    $zipcode_arr = array();
    $sql = "SELECT DISTINCT(zipcode) AS A FROM technicians WHERE technician_id = $technician_id";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            array_push($zipcode_arr, $row['A']);
        }
    }

    $sql = "SELECT * FROM technicians WHERE technician_id = $technician_id";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){
            $mobile_num = $row['mobile_num'];
            $technician_name = $row['technician_name'];
        }
    }

    if($status == true){
        for($i=0;$i<sizeof($zipcode_arr);$i=$i+1){
            $sql = "INSERT INTO $technicians (`technician_id`, `technician_name`, `zipcode`, `mobile_num`, `day`, `start_time`, `end_time`) VALUES('$technician_id', '$technician_name', '$zipcode_arr[$i]', '$mobile_num', '$day', '$start_time', '$end_time') ON DUPLICATE KEY UPDATE technician_id = '$technician_id', technician_name = '$technician_name', zipcode = '$zipcode_arr[$i]', mobile_num = '$mobile_num', day = '$day', start_time = '$start_time', end_time = '$end_time'";
            //echo $sql."\n\n";
            $result = mysqli_query($connection, $sql);
        }
    }
    
    if($status == false){
        for($i=0;$i<sizeof($zipcode_arr);$i=$i+1){
            $sql = "DELETE FROM technicians WHERE technician_id = '$technician_id' AND day = '$day' AND start_time = '$start_time'AND end_time = '$end_time'";
            //echo $sql."\n\n";
            $result = mysqli_query($connection, $sql);
        }
    }
    exit();
}
?>
