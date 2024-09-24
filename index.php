<?php require_once("functions.php"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <title>toDo Mysql</title>
</head>
<body>
    <section class="container">
        <article id="navMenu">
            <div id="navBackDiv">
                <span id="backBtn" class="material-symbols-outlined">arrow_back_ios</span>
            </div>
            <div id="navOptionsDiv">
                <span id="deleteBtn" class="material-symbols-outlined">delete</span>
                <span id="profileBtn" class="material-symbols-outlined">account_circle
                    <div>Esci</div>
                </span>
            </div>
        </article>
        <form class="identification loginForm" id="loginForm" action="#" method="POST">
            <div>
                <input type="email" name="loginEmail" id="loginEmail" required>
                <label for="loginEmail">E-mail :</label>
                <span class="material-symbols-outlined">mail</span>
            </div>
            <div>
                <input type="password" name="loginPsw" id="loginPsw" required>
                <label for="loginPsw">Password :</label>
                <span class="material-symbols-outlined">lock</span>
            </div>
            <div>
                <button id="btnLogin" type="submit">LOGIN</button>
            </div>
            <a href="#">Non hai un account? Registrati</a>
        </form>
        <form class="identification registrationForm" id="registrationForm" action="#" method="POST">
            <div>
                <input type="text" name="registrationUsername" id="registrationUsername" required>
                <label for="registrationUsername">Nome Utente :</label>
                <span class="material-symbols-outlined">person</span>
            </div>
            <div>
                <input type="email" name="registrationEmail" id="registrationEmail" required>
                <label for="registrationEmail">E-mail :</label>
                <span class="material-symbols-outlined">mail</span>
            </div>
            <div>
                <input type="password" name="registrationPsw" id="registrationPsw" required>
                <label for="registrationPsw">Password :</label>
                <span class="material-symbols-outlined">lock</span>
            </div>
            <div>
                <button id="btnRegistration" type="submit">REGISTRATI</button>
            </div>
        </form>
        <article class="addedElements">
            <div id="userInputsDiv">
                <input placeholder="Scrivi" type="text" name="userInput" id="userInput">
                <span id="btnMic" class="material-symbols-outlined">mic</span>
                <span id="btnSend" class="material-symbols-outlined">send</span>
            </div>
        </article>
    </section>

    <script src="script.js"></script>
</body>
</html>