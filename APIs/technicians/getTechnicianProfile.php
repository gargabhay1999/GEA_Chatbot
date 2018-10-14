<?php 
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';
header('Access-Control-Allow-Origin: *'); 
$url = "https://presecure1.000webhostapp.com/technician/update_technician_slots.php?dayID='+dayID+'&shiftId='+shiftId+'&status='+status+'&technician_id='+technician_id";

if(isset($_GET["technician_id"])) {
    $technician_id = $_GET["technician_id"];
    $sql = "SELECT * FROM technicians WHERE technician_id = $technician_id";
    $result = mysqli_query($connection, $sql);
    if(mysqli_num_rows($result)>0){
        while($row = mysqli_fetch_assoc($result)){

            $sql2 = "SELECT DISTINCT(zipcode) FROM technicians WHERE technician_id = $technician_id";
            $result2 = mysqli_query($connection, $sql2);
            $zipcodes = array();
            if(mysqli_num_rows($result2)>0){
                while($row2 = mysqli_fetch_assoc($result2)){
                    array_push($zipcodes, $row2['zipcode']);
                }
            }
            $final_result = array('name' => $row['technician_name'], 'id'=> $row['technician_id'], 'zipcodes' => $zipcodes, 'mobileNo' => $row['mobile_num']);
        }
    }

    echo json_encode($final_result);
    exit();
}
?>
