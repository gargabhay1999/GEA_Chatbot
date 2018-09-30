<?php 
header('Access-Control-Allow-Origin: *');  
// function to geocode address, it will return false if unable to geocode address
include_once '../config/database.php';

$url = "https://presecure1.000webhostapp.com/technicians/getAllProducts.php";

$sql = "SELECT * FROM Appliances";
$result = mysqli_query($connection, $sql);
if(mysqli_num_rows($result)>0){
    while($row = mysqli_fetch_assoc($result)){
        $product_json[] = array('SerialNo' => $row['serial_num'], 'ModelNo' => $row['model_num'], 'ProductName' => $row['product_line']);
    }
}
echo json_encode($product_json);
//PVM9179SKSS MOOP6664

?>
