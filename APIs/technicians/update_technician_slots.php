<?php 
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';
header('Access-Control-Allow-Origin: *'); 
$url = "https://presecure1.000webhostapp.com/technician/update_technician_slots.php?dayID='+dayID+'&shiftID='+shiftID+'&status='+status+'&technician_id='+technician_id";

if( isset($_GET["dayID"]) && isset($_GET["shiftID"]) && isset($_GET["status"]) && isset($_GET["technician_id"])) {
    $dayID = $_GET["dayID"];
    $shiftID = $_GET["shiftID"];
    $status = $_GET["status"];
    $technician_id = $_GET["technician_id"];
    switch ($dayID) {
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

    switch ($shiftID) {
        case 0:
            $start_time = '8 AM';
            $end_time = '9:30 AM';
            break;
        case 1:
            $start_time = '10 AM';
            $end_time = '11:30 AM';
            break;
        case 2:
            $start_time = '1 PM';
            $end_time = '2:30 PM';
            break;
        case 3:
            $start_time = '2 PM';
            $end_time = '4:30 PM';
            break;
        default:
            # code...
            break;
    }

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

    if($status == 'true'){
        for($i=0;$i<sizeof($zipcode_arr);$i=$i+1){
            $sql = "INSERT INTO technicians (`technician_id`, `technician_name`, `zipcode`, `mobile_num`, `day`, `start_time`, `end_time`) VALUES('$technician_id', '$technician_name', '$zipcode_arr[$i]', '$mobile_num', '$day', '$start_time', '$end_time') ON DUPLICATE KEY UPDATE technician_id = '$technician_id', technician_name = '$technician_name', zipcode = '$zipcode_arr[$i]', mobile_num = '$mobile_num', day = '$day', start_time = '$start_time', end_time = '$end_time'";
            //echo $sql."\n\n";
            echo json_encode("updated");
            $result = mysqli_query($connection, $sql);
        }
    }
    
    if($status == 'false'){
        for($i=0;$i<sizeof($zipcode_arr);$i=$i+1){
            $sql = "DELETE FROM technicians WHERE technician_id = '$technician_id' AND day = '$day' AND start_time = '$start_time'AND end_time = '$end_time'";
            //echo $sql."\n\n";
            echo json_encode("deleted");
            $result = mysqli_query($connection, $sql);
        }
    }
    exit();
}
?>
