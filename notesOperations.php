<?php

//DB CONNECTION SETUP
require_once("dbConnection.php");


//MEMO CREATION REQUEST
if(isset($_POST["text"])) {
    postMemo($pdo, $_POST["text"]);
}


//MEMO CONTENT UPDATE REQUEST
if(isset($_POST["newMemoText"])) {
    updateMemo($pdo, $_POST["newMemoText"], $_POST["changedMemoID"]);
}


//MEMOS DELETION REQUEST
if(isset($_POST["deletionArr"])) {
    deleteMemo($pdo, $_POST["deletionArr"]);
}


//LOAD USER MEMOS REQUEST
if(isset($_GET["action"]) && $_GET["action"] == "loadContent") {
    populateApp($pdo);
}



//MEMO OPERATIONS
function deleteMemo($pdo, $deletionArr) {
    $parameters = str_repeat('?,', count($deletionArr) - 1) . '?';
    $stmt = $pdo->prepare("DELETE FROM todos WHERE id IN ($parameters)");
    $stmt->execute($deletionArr);
}

function updateMemo($pdo, $newText, $id) {
    $stmt = $pdo->prepare("UPDATE todos SET content = ? WHERE id = ?");
    $stmt->execute([$newText, $id]);
}

function postMemo($pdo, $text) {
    $userEmail = $_COOKIE["email"];
    $stmt = $pdo->prepare("INSERT INTO todos(user_email, content, pub_date) VALUES (?,?,NOW())");
    $stmt->execute([$userEmail, $text]);
    checkLastId($pdo);
}

function checkLastId($pdo) {
    $stmt = $pdo->prepare("SELECT id FROM todos ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($res);
}


//FILL PAGE WITH USERS MEMO
function populateApp($pdo) {
    $userEmail = $_COOKIE["email"];
    $stmt = $pdo->prepare("SELECT content, id FROM todos WHERE user_email = ? ORDER BY pub_date");
    $stmt->execute([$userEmail]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res)) {
        echo json_encode($res);
        return;
    }
    echo json_encode("No results");
}

?>