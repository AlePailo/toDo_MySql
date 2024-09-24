<?php

define("hostname", "localhost");
define("username", "root");
define("pass", "");
define("dbname", "todomysql");

function dbConnect() {
    $conn = new mysqli(hostname, username, pass, dbname);

    if($conn->connect_error) {
        die("Connection error" . $conn->connect_error);
    }

    return $conn;
}

function registerUser($username, $email, $psw) {
    $mysqli = dbConnect();
    $prepStm = $mysqli->prepare("INSERT INTO users(email, username, psw)");
    $prepStm->bind_param("sss", $email, $username, $psw);
    $prepStm->exeute();
    $mysqli->close();
}

function tryLogin() {}

function pushMemoToDb() {

}

?>