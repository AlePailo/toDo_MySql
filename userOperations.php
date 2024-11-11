<?php

//DB CONNECTION SETUP
require_once("dbConnection.php");


//LOGOUT REQUEST
if(isset($_GET["action"]) && $_GET["action"] == "logout") {
    setcookie("username",  "", time() - 3600);
}


//CHECK IF USER IS LOGGED IN
if(isset($_POST["GetSessionVariables"])) {
    checkLoginCookie();
}


//CHECK IF USERNAME OR EMAIL ALREADY EXISTS WHEN USER TRY TO REGISTER
if(isset($_POST["regAttemptUsername"])) {
    checkRegistrationValidity($pdo, $_POST["regAttemptUsername"], $_POST["regAttemptEmail"], $_POST["regAttemptPsw"]);
}


//USER REGISTRATION REQUEST
if(isset($_POST["registrationEmail"])) {
    registerUser($_POST["registrationUsername"], $_POST["registrationEmail"], $_POST["registrationPsw"], $pdo);
}


//LOGIN REQUEST
if(isset($_POST["loginAttemptEmail"])) {
    if(checkLoginFormValidity($pdo, $_POST["loginAttemptEmail"], $_POST["loginAttemptPsw"]) != "valid") {
        echo json_encode("BOBBY");
        return;
    }
    login($pdo, $_POST["loginAttemptEmail"], $_POST["loginAttemptPsw"]);
}


//CHECK IF USER COOKIE IS SET
function checkLoginCookie() {
    echo json_encode(isset($_COOKIE["username"]));
}



//TRY TO LOGIN AND SET COOKIES TO KEEP USER LOGGED IN
function login($pdo, $email, $psw) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND psw = ?');
    $stmt->execute([$email, $psw]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(!count($res)) {
        echo json_encode("Credenziali errate");
        return;
    }
    setLoginCookie($res[0]["username"], $email);
    echo json_encode("Logged in successfully");
}

function setLoginCookie($username, $email) {
    setcookie("username", $username, time() + 60 * 60 * 24 * 365);
    setcookie("email", $email, time() + 60 * 60 * 24 * 365);
}



//CHECK IN DATABASE IF USERNAME OR EMAIL ARE ALREADY REGISTERED
function checkIfAlreadyExists($pdo, $fieldname, $fieldvalue) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE ' . $fieldname . '= ?');
    $stmt->execute([$fieldvalue]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res)) {
        return true;
    }
    return false;
}

//REGISTRATION QUERY
function registerUser($username, $email, $psw, $pdo) {
    $stmt = $pdo->prepare('INSERT INTO users(email, username, psw) VALUES (?,?,?)');
    $stmt->execute([$email, $username, $psw]);
    setLoginCookie($username, $email);
}



//FORMS VALIDATION
function checkRegistrationValidity($pdo, $username, $email, $psw) {
    if(empty($username) || empty($email) || empty($psw)) {
        echo json_encode("Compilare tutti i campi");
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode("Formato email non valido");
        return;
    }

    if(checkIfAlreadyExists($pdo, "email" , $email) === true) {
        echo json_encode("Email in uso");
        return;
    }

    if(checkIfAlreadyExists($pdo, "username" , $username) === true) {
        echo json_encode("Username in uso");
        return;
    }

    echo json_encode("Valid");
}


function checkLoginFormValidity($pdo, $email, $psw) {
    if(empty($email) || empty($psw)) {
        return "Compilare tutti i campi";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return "Formato email non valido";
    }

    return "valid";
}

?>