<?php require_once("userOperations.php");
?>
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
            <div id="navOptions">
                <span id="backBtn"><img class="material-icons" src="media/icons/arrowBackIcon.svg" alt=""></span>
                <span id="deleteBtn"><img class="material-icons" src="media/icons/deleteIcon.svg" alt=""></span>
            </div>
            <div id="navProfile">
                <span id="profileBtn"><img class="material-icons" src="media/icons/profileIcon.svg" alt=""></span>
            </div>
            
            
            <!--<div id="navBackDiv">
                <span id="backBtn"><img class="material-icons" src="media/icons/arrowBackIcon.svg" alt=""></span>
            </div>
            <div id="navOptionsDiv">
                <span id="deleteBtn"><img class="material-icons" src="media/icons/deleteIcon.svg" alt=""></span>
                <span id="profileBtn"><img class="material-icons" src="media/icons/profileIcon.svg" alt=""></span>
            </div>-->
            <div id="profileInfos">
                <div>
                    <p></p>
                    <p></p>
                </div>
                <button id="btnLogOut">Esci</button>
            </div>
        </article>
        <div id="loadingCircleDiv" class="identification">
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
        <form class="identification loginForm" id="loginForm" method="POST">
            <div>
                <input type="email" name="loginEmail" id="loginEmail" required>
                <label for="loginEmail">E-mail :</label>
                <span><img class="material-icons" src="media/icons/emailIcon.svg" alt=""></span>
            </div>
            <div>
                <input type="password" name="loginPsw" id="loginPsw" required>
                <label for="loginPsw">Password :</label>
                <span><img class="material-icons" src="media/icons/pswHideIcon.svg" alt="" data-cover="cover"></span>
            </div>
            <div>
                <button id="btnLogin" type="button">LOGIN</button>
            </div>
            <p id="linkToRegistration">Non hai un account? Registrati</p>
        </form>
        <form class="identification registrationForm" id="registrationForm" method="POST">
            <div>
                <input type="text" name="registrationUsername" id="registrationUsername" required>
                <label for="registrationUsername">Nome Utente :</label>
                <span><img class="material-icons" src="media/icons/usernameIcon.svg" alt=""></span>
            </div>
            <div>
                <input type="email" name="registrationEmail" id="registrationEmail" required>
                <label for="registrationEmail">E-mail :</label>
                <span><img class="material-icons" src="media/icons/emailIcon.svg" alt=""></span>
            </div>
            <div>
                <input type="password" name="registrationPsw" id="registrationPsw" required>
                <label for="registrationPsw">Password :</label>
                <span><img class="material-icons" src="media/icons/pswHideIcon.svg" alt="" data-cover="cover"></span>
            </div>
            <div>
                <button id="btnRegistration" type="button">REGISTRATI</button>
            </div>
        </form>
        <article class="addedElements">
            <div id="userInputsDiv">
                <input placeholder="Scrivi" type="text" name="userInput" id="userInput">
                <span id="btnMic"><img class="material-icons" src="media/icons/micIcon.svg" alt=""></span>
                <span id="btnSend"><img class="material-icons" src="media/icons/sendIcon.svg" alt=""></span>
            </div>
        </article>
        <p id="formNotification"></p>
        <dialog id="confirmDeletion">
            <p>Eliminare le note selezionate ?</p>
            <p>
                <span>Annulla</span>
                <span>Conferma</span>
            </p>
        </dialog>
    </section>

    <script src="script.js"></script>
</body>
</html>