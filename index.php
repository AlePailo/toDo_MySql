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
        <!-- NAV MENU -->
        <article class="container" id="navMenu">
            <div id="navOptions">
                <span id="backBtn"><img class="material-icons" src="media/icons/arrowBackIcon.svg" alt=""></span>
                <span id="deleteBtn"><img class="material-icons" src="media/icons/deleteIcon.svg" alt=""></span>
            </div>
            <div id="navProfile">
                <span id="helpBtn"><img class="material-icons" src="media/icons/helpIcon.svg" alt=""></span>
                <span id="profileBtn"><img class="material-icons" src="media/icons/profileIcon.svg" alt=""></span>
            </div>

            <!--Profile infos popup (position absolutely to the nav menu)-->
            <div id="profileInfos">
                <div>
                    <p></p>
                    <p></p>
                </div>
                <button id="btnLogOut">Esci</button>
            </div>
        </article>

        <!-- LOGIN FORM -->
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

        <!-- REGISTRATION FORM -->
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
        
        <!-- FORM ERRORS DISPLAY -->
        <p id="formNotification"></p>

        <!-- NOTES DISPLAY PAGE -->
        <article class="addedElements">
            <div class="container" id="userInputsDiv">
                <input placeholder="Scrivi" type="text" name="userInput" id="userInput" spellcheck="false">
                <span id="btnMic"><img class="material-icons" src="media/icons/micIcon.svg" alt=""></span>
                <span id="btnSend"><img class="material-icons" src="media/icons/sendIcon.svg" alt=""></span>
            </div>
        </article>

        <!-- DELETION CONFIRMATION POPUP -->
        <dialog id="askDeletionConfirmation">
            <p>Eliminare le note selezionate ?</p>
            <p>
                <span id="cancelDeletion">Annulla</span>
                <span id="confirmDeletion">Conferma</span>
            </p>
        </dialog>

        <!-- HELPBOX POPUP -->
        <dialog id="helpBox">
            <ul>
                <li>
                    <h3>MODIFICARE UNA NOTA</h3>
                    <p>Cliccare due volte sulla nota che si vuole modificare.<br>
                        Lasciare una nota vuota comporterà la cancellazione della stessa.
                    </p>
                </li>
                <li>
                    <h3>ELIMINARE UNA NOTA</h3>
                    <p>Tenere premuto sulla nota che si vuole eliminare e cliccare sull'apposita icona.<br>
                        Si possono selezionare ed eliminare più note alla volta.
                    </p>
                </li>
                <li>
                    <h3>AGGIUNGERE NOTA TRAMITE AUDIO</h3>
                    <p>Tenere premuto sull'icona del microfono per tutta la durata della registrazione.</p>
                </li>
            </ul>
            <button id="btnCloseHelpBox">CHIUDI</button>
        </dialog>

        <!-- LOADING CIRCLE -->
        <div id="loadingCircleDiv" class="identification">
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>