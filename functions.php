<?php

require_once("dbConnection.php");

/*if(isset($_POST["regAttemptUsername"])) {
    checkIfAlreadyExistsUser($pdo, $_POST["regAttemptUsername"]);
}

if(isset($_POST["regAttemptEmail"])) {
    checkIfAlreadyExistsEmail($pdo, $_POST["regAttemptEmail"]);
}

if(isset($_POST["registrationEmail"])) {
    registerUser($_POST["registrationUsername"], $_POST["registrationEmail"], $_POST["registrationPsw"], $pdo);
}

function checkIfAlreadyExistsUser($pdo, $field) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$field]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res) > 0) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
    //return json_encode($res);
}

function checkIfAlreadyExistsEmail($pdo, $field) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$field]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res) > 0) {
        echo json_encode(true);
    } else {
        echo json_encode(false);
    }
    //return json_encode($res);
}

function registerUser($username, $email, $psw, $pdo) {
    $stmt = $pdo->prepare('INSERT INTO users(email, username, psw) VALUES (?,?,?)');
    $stmt->execute([$email, $username, $psw]);
}
*/

if(isset($_GET["action"]) && $_GET["action"] == "logout") {
    setcookie("username",  "", time() - 3600);
}

if(isset($_POST["GetSessionVariables"])) {
    checkLoginCookie();
}

function checkLoginCookie() {
    echo json_encode(isset($_COOKIE["username"]));
}

if(isset($_POST["regAttemptUsername"])) {
    checkValidity($pdo, $_POST["regAttemptUsername"], $_POST["regAttemptEmail"], $_POST["regAttemptPsw"]);
}

if(isset($_POST["registrationEmail"])) {
    registerUser($_POST["registrationUsername"], $_POST["registrationEmail"], $_POST["registrationPsw"], $pdo);
}

if(isset($_POST["loginAttemptEmail"])) {
    if(checkLoginFormValidity($pdo, $_POST["loginAttemptEmail"], $_POST["loginAttemptPsw"]) != "valid") {
        echo json_encode("BOBBY");
        return;
    }
    login($pdo, $_POST["loginAttemptEmail"], $_POST["loginAttemptPsw"]);
}


function checkValidity($pdo, $username, $email, $psw) {
    if(empty($username) || empty($email) || empty($psw)) {
        echo json_encode("Compilare tutti i campi");
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode("Formato email non valido");
        return;
    }

    if(checkIfAlreadyExistsEmail($pdo, $email) === true) {
        echo json_encode("Email in uso");
        return;
    }

    if(checkIfAlreadyExistsUser($pdo, $username) === true) {
        echo json_encode("Username in uso");
        return;
    }

    echo json_encode("Valid");
}


function checkIfAlreadyExistsEmail($pdo, $email) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res) > 0) {
        return true;
    } else {
        return false;
    }
}

function checkIfAlreadyExistsUser($pdo, $username) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res) > 0) {
        return true;
    } else {
        return false;
    }
}

function registerUser($username, $email, $psw, $pdo) {
    $stmt = $pdo->prepare('INSERT INTO users(email, username, psw) VALUES (?,?,?)');
    $stmt->execute([$email, $username, $psw]);
    setLoginCookie($username, $email);
}

function setLoginCookie($username, $email) {
    setcookie("username", $username, time() + 60 * 60 * 24 * 365);
    setcookie("email", $email, time() + 60 * 60 * 24 * 365);
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

function login($pdo, $email, $psw) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND psw = ?');
    $stmt->execute([$email, $psw]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(!count($res) > 0) {
        echo json_encode("Credenziali errate");
        return;
    }
    setLoginCookie($res[0]["username"], $email);
    echo json_encode("Logged in successfully");
    //echo "Hi " . $_COOKIE["username"] . " your email is " . $_COOKIE["email"];
}

?>