<?php 
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';
header('Access-Control-Allow-Origin: *'); 
$url = "https://presecure1.000webhostapp.com/technician/update_technician_slots.php?dayID='+dayID+'&shiftId='+shiftId+'&status='+status+'&technician_id='+technician_id";

function getDayID($day){
    switch ($day) {
        case 'Monday':
            $dayID = 0;
            break;
        case 'Tuesday':
            $dayID = 1;
            break;
        case 'Wednesday':
            $dayID = 2;
            break;
        case 'Thursday':
            $dayID = 3;
            break;
        case 'Friday':
            $dayID = 4;
            break;
        default:
            # code...
            break;
    }
    return $dayID;
}

function getShiftId($start_time){
    switch ($start_time) {
        case '8 AM':
            $shiftId = 0;
            break;
        case '10 AM':
            $shiftId = 1;
            break;
        case '1 PM':
            $shiftId = 2;
            break;
        case '2 PM':
            $shiftId = 3;
            break;
        default:
            # code...
            break;
    }
    return $shiftId;
}
if(isset($_GET["technician_id"])) {
    $technician_id = $_GET["technician_id"];
    $shiftArr = array('8 AM', '10 AM', '1 PM', '3 PM');
    $shifts = array('8 AM - 9:30 AM', '10 AM - 11:30 AM', '1 PM - 2:30 PM', '3 PM - 4:30 PM');
    $final_result = array();
    for($j=0;$j<4;$j=$j+1){
        $sql = "SELECT DISTINCT(day) FROM technicians WHERE start_time = '$shiftArr[$j]' AND technician_id = $technician_id";
        $result = mysqli_query($connection, $sql);
        $dayID_arr[$j] = array();
        if(mysqli_num_rows($result)>0){
            while($row = mysqli_fetch_assoc($result)){
                array_push($dayID_arr[$j], getDayID($row['day']));
            }
        }
        $day_status_arr = array();
        for($i=0;$i<5;$i=$i+1){
            if(in_array($i, $dayID_arr[$j]) == 1){
                $obj = array('id' => $i, 'status' => true);
            }
            else{
                $obj = array('id' => $i, 'status' => false);
            }
            array_push($day_status_arr, $obj);
        }
        $json_obj = array('id' => $j, 'shift' => $shifts[$j], 'days' => $day_status_arr);
        $final_result[] = $json_obj;
    }
    echo json_encode($final_result);
    exit();
}
?>
