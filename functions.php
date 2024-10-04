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

if(isset($_POST["regAttemptUsername"])) {
    checkValidity($pdo, $_POST["regAttemptUsername"], $_POST["regAttemptEmail"], $_POST["regAttemptPsw"]);
}

if(isset($_POST["registrationEmail"])) {
    registerUser($_POST["registrationUsername"], $_POST["registrationEmail"], $_POST["registrationPsw"], $pdo);
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
    startSession($username, $email);
}

function startSession($username, $email) {
    session_start();
    $_SESSION["username"] = $username;
    $_SESSION["email"] = $email;
}

function checkLoginFormValidity($pdo, $email, $psw) {
    if(empty($email) || empty($psw)) {
        echo json_encode("Compilare tutti i campi");
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode("Formato email non valido");
        return;
    }
}

function login($pdo, $email, $psw) {
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? AND psw = ?');
    $stmt->execute([$email, $psw]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(!count($res) > 0) {
        echo json_encode("Credenziali errate");
        return;
    }
    echo json_encode("Logged in successfully");
    startSession($username, $email);
    echo "Hi " . $_SESSION["$username"] . " your email is " . $_SESSION["email"];
}


?>