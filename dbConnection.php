<?php

$hostname = "localhost";
$username = "root";
$psw = "";
$dbname = "todomysql";
$charset = "utf8mb4";

$dsn = "mysql:host=$hostname;dbname=$dbname;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $username, $psw, $options);
} catch(PDOException $e) {
    die($e->getMessage());
}

?>