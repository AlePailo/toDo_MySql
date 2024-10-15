<?php

require_once("dbConnection.php");

if(isset($_POST["deletionArr"])) {
    deleteMemo($pdo, $_POST["deletionArr"]);
}

if(isset($_GET["action"]) && $_GET["action"] == "loadContent") {
    populateApp($pdo);
}

if(isset($_POST["newMemoText"])) {
    updateMemo($pdo, $_POST["newMemoText"], $_POST["changedMemoID"]);
}

if(isset($_POST["text"])) {
    postMemo($pdo, $_POST["text"]);
}

function postMemo($pdo, $text) {
    $userEmail = $_COOKIE["email"];
    $stmt = $pdo->prepare("INSERT INTO todos(user_email, content, pub_date) VALUES (?,?,NOW())");
    $stmt->execute([$userEmail, $text]);
}

function populateApp($pdo) {
    $userEmail = $_COOKIE["email"];
    $stmt = $pdo->prepare("SELECT content, id FROM todos WHERE user_email = ? ORDER BY pub_date");
    $stmt->execute([$userEmail]);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if(count($res) > 0) {
        echo json_encode($res);
        return;
    }
    echo json_encode("No results");
}

function deleteMemo($pdo, $deletionArr) {
    $parameters = str_repeat('?,', count($deletionArr) - 1) . '?';
    $stmt = $pdo->prepare("DELETE FROM todos WHERE id IN ($parameters)");
    $stmt->execute($deletionArr);
}

function updateMemo($pdo, $newText, $id) {
    $stmt = $pdo->prepare("UPDATE todos SET content = ? WHERE id = ?");
    $stmt->execute([$newText, $id]);
}

?>