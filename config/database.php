<?php
    // specify your own database credentials
    // $DB_SERVER="localhost";
    // $DB_USER="root";
    // $DB_PASS="";
    // $DB_NAME="id5307714_presecure";

    //on 000webhost
    $DB_SERVER="localhost";
    $DB_USER="id5360241_gea_abhay";
    $DB_PASS="TYPE_YOUR_PASSWORD_HERE";
    $DB_NAME="id5360241_gea";

    //Create a database connection
    $connection = mysqli_connect($DB_SERVER,$DB_USER,$DB_PASS,$DB_NAME);
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to Teeka: " . mysqli_connect_error();
    }
?>
