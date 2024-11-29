$(document).ready(function() {
    
    //CHECKING IF THE USER IS LOGGED IN
    displayBasedOnCookie()


    //NAVBAR EVENTS
    $(document).on("click", "#helpBtn", () => $("#helpBox")[0].showModal())
    $(document).on("click", "#btnCloseHelpBox", () => $("#helpBox")[0].close())
    $(document).on("click", "#profileBtn", toggleProfileInfos)
    $(document).on("click", "#btnLogOut", logOut)
    $(document).on("click", "#backBtn", handleBackBtnClick)
    $(document).on("click", "#deleteBtn", () => $("#askDeletionConfirmation")[0].showModal())

    //DELETION POPUP EVENTS
    $(document).on("click", "#askDeletionConfirmation", closeDialogOnBackdropClick)
    $(document).on("click", "#cancelDeletion", function() {
        $("#askDeletionConfirmation")[0].close()
        resetSelection()
    })
    $(document).on("click", "#confirmDeletion", performDeletion)

    //USER INPUTS BOTTOM BAR EVENTS
    $(document).on("mousedown touchstart", "#btnMic", recStart)
    $(document).on("click", "#btnSend", function() {
        createMemo($("#userInput").val())
        $("#userInput").val("")
    })

    //MEMO EVENTS
    $(document).on("pointerdown pointerup", ".memoNote", checkPointerType)
    $(document).on("click", ".memoNote", saveMemoValue)
    $(document).on("blur", ".memoNote", updateMemo)

    //FORMS EVENTS
    $(document).on("click", "#linkToRegistration", function() {
        showRegistrationForm()
        hideLoginForm()
    })
    $(document).on("click", ".identification input ~ span", focusSiblingInput)
    $(document).on("click", "#btnLogin", tryLogin)
    $(document).on("click", "#btnRegistration", tryRegistration)
    $(document).on("submit", "#registrationForm", () => {location.reload()})
    $(document).on("focus", "input", () => $("#formNotification").hide())

    //PROVARE !
    //const target = e.target.id ?? e.target.parentElement.id   -> gestisce solo null e undefined
    //const target = e.target.id || e.target.parentElement.id   -> dovrebbe gestire anche 0 e ""  



    //$(document).on("pointerup", ".memoNote", checkPointerType)


    //$("#profileBtn").click(toggleProfileInfos)

    /*

    //(?) icon press => open help box popup
    $("#helpBtn").click(() => $("#helpBox")[0].showModal())

    //close help box on its close button press
    $("#btnCloseHelpBox").click(() => $("#helpBox")[0].close())

    //profile icon press => toggle profile infos popup
    

    //profile infos popup button press => logout
    $("#btnLogOut").click(logOut)

    //back arrow icon events
    $("#backBtn").click(handleBackBtnClick)

    //deletion icon press => brings confirm deletion popup 
    $("#deleteBtn").click(() => $("#askDeletionConfirmation")[0].showModal())//$("#askDeletionConfirmation").css("display", "flex"))
    */


    

    //Mic icon press
    //$("#btnMic").on("mousedown touchstart", recStart)


    //send icon press => create memo with input text
    /*$("#btnSend").click(function() {
        createMemo($("#userInput").val())
        $("#userInput").val("")
    })*/

    



    

    //deletion popup left option press => cancel memo deletion
    /*$("#cancelDeletion").click(function() {
        $("#askDeletionConfirmation")[0].close()
        resetSelection()
    })*/
    

    //confirm deletion popup right option press => confirm memo deletion
    //$("#confirmDeletion").click(performDeletion)



    //NOTES DISPLAY ZONE EVENTS

    //single click on memo
    /*$(".addedElements").on("click", "p", saveMemoValue)*/
    
    //memo out of focus
    //$(".addedElements").on("blur", "p", updateMemo)



    //MEMO CLICK EVENTS BASED ON POINTER TYPE (mouse or touch)

    /*$(".addedElements").on("pointerdown", ".memoNote", checkPointerType)

    $(".addedElements").on("pointerup", ".memoNote", checkPointerType)*/

    
    //HIDE FORM ERRORS NOTIFICATIONS WHEN CLICKING ON AN INPUT FIELD
    /*$("input").focus(function() {
        $("#formNotification").hide()
    })*/

    //LINK FROM LOGIN FORM TO REGISTRATION FORM CLICK
    /*$("#linkToRegistration").click(function() {
        showRegistrationForm()
        hideLoginForm()
    })*/
    

    


    //INPUTS' ICONS CLICK EVENT 
    //$(".identification").find("input ~ span").click(focusSiblingInput)

    //LOGIN FORM BUTTON CLICK EVENT
    //$("#btnLogin").click(tryLogin)

    //REGISTRATION FORM BUTTON CLICK EVENT
    //$("#btnRegistration").click(tryRegistration)


    //REGISTRATION SUBMIT EVENT (triggered by #btnRegistration after successful validation)
    /*$("#registrationForm").submit(function() {
        location.reload()
    })*/

    //$("#askDeletionConfirmation").on('click', closeDialogOnBackdropClick)


})

//GLOBALLY ACCESSIBLE VARIABLES KEPT IN THIS OBJECT TO AVOID POSSIBLE NAME CONFLICTS AND GLOBAL NAMESPACE POLLUTION
const utilityVars = {
    timer : null,               //used to recognize a long press (held tap for more than 0.5s)
    itemsSelected : false,      //set to true if there's at least one memo selected
    longPress : false,          //set to true if the last click was a long press
    dblClickTime : 0,           //used to recognize a double click (two clicks on same memo in less than 0.75 sec)
    clickedMemoId : null,        //used to track last clicked memo (useful to recognize double click on same memo)
    recognitionObj : new (window.SpeechRecognition || window.webkitSpeechRecognition)(),
    recording : null,
    results : null,
    speech : "",
    lastMemoValue : ""          //used to check if memo's value has changed
}

utilityVars.recognitionObj.continuous = true;
utilityVars.recognitionObj.lang = "it-IT"



function closeDialogOnBackdropClick(e) {
    const dialog = $(this)[0]
    const bounds = dialog.getBoundingClientRect()
    const isClickInsideDialog = (bounds.top <= e.clientY && e.clientY <= bounds.top + bounds.height && bounds.left <= e.clientX && e.clientX <= bounds.left + bounds.width)
    if (!isClickInsideDialog) dialog.close()
}


function sendForm() {
    $("#registrationForm").submit()
}

function handleBackBtnClick() {
    //hide memo options menu and checkboxes if registration form hidden
    if($("#registrationForm").css("display") !== "flex") {
        resetSelection()
        return
    }
    //otherwise switch from registration to login form
    hideRegistrationForm()
    showLoginForm()
}


function performDeletion() {
    //get all selected notes' (data-selected=true) id
    const selectedIds = $("[data-selected=true]").map((_, el) => el.id).get()
    deleteMemo(selectedIds)
    resetSelection()
    $("#askDeletionConfirmation")[0].close()
}


function focusSiblingInput() {
    //focus sibling input
    const input = $(this).siblings("input")
    input.focus()
    
    let imgDataCover = $(this).find("img").attr("data-cover")


    //return if it's not the passowrd field (detected by not having an icon with the "data-cover" attribute)
    if(typeof imgDataCover === "undefined" || typeof imgDataCover === false) {
        return
    }

    //set caret after last input character and toggle show/hide password field value
    setCursorAtInputEnd(input[0])

    togglePswVisibility($(this))
}

function setCursorAtInputEnd(input) {
    let sel = window.getSelection();
    sel.selectAllChildren(input);
    sel.collapseToEnd();
}

function togglePswVisibility(span) {
    const eyeIcon = span.find("img")
    const pswInput = span.siblings("input")
    const isPswHidden = eyeIcon.attr("data-cover") === "cover"
    eyeIcon.attr({
        src: isPswHidden ? "media/icons/pswShowIcon.svg" : "media/icons/pswHideIcon.svg",
        "data-cover": isPswHidden ? "show" : "cover"
    })
    pswInput.attr("type", isPswHidden ? "text" : "password")
}


function toggleProfileInfos(e) {
    e.stopPropagation()
    const profileBtnIcon = $("#profileBtn").find("img")[0]
    const profileInfosContainer = $("#profileInfos")

    // Se clicchiamo sull'icona, alterniamo la visibilità
    if (e.target === profileBtnIcon) {
        const isContainerHidden = profileInfosContainer.css("display") === "none";
        setProfileInfosVisibility(isContainerHidden);
        return;
    }

    // Se clicchiamo fuori, chiudiamo il contenitore
    if (!profileInfosContainer.is(e.target) && profileInfosContainer.has(e.target).length === 0) {
        setProfileInfosVisibility(false);
    }
}

// Funzione per gestire la visibilità del contenitore
function setProfileInfosVisibility(isContainerHidden) {
    const profileInfosContainer = $("#profileInfos");

    if (isContainerHidden) {
        profileInfosContainer.css("display", "flex")
        //$(document).on("click", toggleProfileInfos);
    } else {
        profileInfosContainer.css("display", "none")
        //$(document).off("click", toggleProfileInfos);
    }
}



function checkPointerType(e) {
    e.stopPropagation();

    //possible events and their actions 
    const actions = {
        "pointerdown": tapStart,
        "pointerup": tapEnd
    };

    //if event exists in actions object call the handlePointerType function
    const action = actions[e.type];
    if (action) {
        handlePointerType(e, action, $(this));
    }
}

function handlePointerType(e, func, el) {
    //if the pointer type is valid execute the function and prevent calling it twice on touch
    if (["mouse", "touch"].includes(e.pointerType)) {
        func(el);
    }
}


// Funzione generica per il parsing sicuro di JSON
function safeParseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Invalid JSON response:", data);
        return null;
    }
}

// Funzione per mostrare notifiche
function showNotification(message, backgroundColor = "#BB0A21") {
    $("#formNotification").show().text(message).css("background", backgroundColor);
}

// Funzione per gestire login
function tryLogin() {
    const email = $("#loginEmail").val();
    const psw = $("#loginPsw").val();

    const userInfo = {
        loginAttemptEmail: email,
        loginAttemptPsw: psw
    };

    ajaxPostRequest("userOperations.php", userInfo, function(data) {
        const parsedData = safeParseJSON(data);
        if (!parsedData) {
            showNotification("An error occurred. Please try again.");
            return;
        }
        parsedData !== "Logged in successfully"
            ? showNotification(parsedData)
            : location.reload();
    });
}

// Funzione per gestire la registrazione
function tryRegistration() {
    const username = $("#registrationUsername").val();
    const email = $("#registrationEmail").val();
    const psw = $("#registrationPsw").val();

    const userInfo = {
        regAttemptUsername: username,
        regAttemptEmail: email,
        regAttemptPsw: psw
    };

    ajaxPostRequest("userOperations.php", userInfo, function(data) {
        const parsedData = safeParseJSON(data);
        if (!parsedData) {
            showNotification("An error occurred. Please try again.");
            return;
        }
        if (parsedData !== "Valid") {
            showNotification(parsedData);
        } else {
            sendForm();
        }
    });
}

// Funzione per creare un memo
function createMemo(memoText) {
    const memoObj = { text: memoText };

    ajaxPostRequest("notesOperations.php", memoObj, function(data) {
        const parsedData = safeParseJSON(data);
        if (!parsedData) {
            showNotification("Failed to create memo.");
            return;
        }
        buildMemoP(memoText, parsedData[0]?.id); // Usa optional chaining per gestire risultati nulli/undefined
    });
}

// Funzione per eliminare un memo
function deleteMemo(idsArr) {
    const idsObj = { deletionArr: idsArr };

    ajaxPostRequest("notesOperations.php", idsObj, function() {
        idsArr.forEach(id => $(`#${id}`).remove());
    });
}

// Funzione per aggiornare un memo
function updateMemo() {
    $(this).attr("contentEditable", false);

    const memoId = $(this).attr("id");
    const newText = $(this).text();

    if (checkMemoValueVariations($(this), newText)) {
        ajaxPostRequest("notesOperations.php", {
            changedMemoID: memoId,
            newMemoText: newText
        });
    }
}


function buildMemoP(text, id) {
    const memo = $('<p/>',{
        text,
        class: "memoNote",
        id,
        spellcheck: false,
        "data-selected": false
    }).appendTo('.addedElements')

    $("<div/>", {
        class: "checkSelect"
    }).appendTo(memo)
}


//AJAX REQUESTS FUNCTIONS

function ajaxPostRequest(ajaxUrl, ajaxData, successFunction) {
    $.ajax({
        type : "POST",
        url : ajaxUrl,
        data : ajaxData,
        indexValue: ajaxData,
        success : successFunction,
        error : ajaxErrorHandler
    })
}

function ajaxGetRequest(ajaxUrl, successFunction) {
    $.ajax({
        type : "GET",
        url : ajaxUrl,
        success : successFunction,
        error : ajaxErrorHandler
    })
}

function ajaxErrorHandler(xhr, status, error) {
    console.error("Error: " + xhr.status + " (" + error + ")")
}




//FILL PAGE WITH USER'S MEMO FUNCTION

function populateApp() {
    ajaxGetRequest("notesOperations.php?action=loadContent", successfullyRequestedAllMemos)
    
    function successfullyRequestedAllMemos(data) {
        const parsedData = safeParseJSON(data)
        
        if (!parsedData) return
                
        if(parsedData === "No results") return

        for(let el in parsedData) {
            console.log(parsedData[el].content)
            buildMemoP(parsedData[el].content, parsedData[el].id)
        }
    }
}



// FIRST FUNCTION SAVES MEMO NOTE VALUE ON CLICK WHILE SECOND FUNCTION CHECKS IF THE VALUE IS CHANGED WHEN THE NOTE LOSES FOCUS
// IF THE VALUE IS THE SAME NOTHING HAPPENS, IF IT'S DIFFERENT THE DATABASE GETS UPDATED WITH THE NEW MEMO VALUE

function saveMemoValue() {
    const value = $(this).text()
    utilityVars.lastMemoValue = value
}


function checkMemoValueVariations(el, currentValue) {
    if(currentValue === "") {
        deleteMemo([el[0].id])
        return
    }
    if(utilityVars.lastMemoValue != currentValue) {
        return true
    }
}



//LONG TAP LOGIC

function tapStart(el) {

    //prevent long press trigger if leaving the memo with cursor
    $(this).on("touchmove mousemove", function() {
        tapEnd($(this))
    })

    if($("#profileInfos").css("display") === "flex") {
        $("#profileInfos").hide()
    }

    //if there are notes selected ignore double click and long press behaviours
    utilityVars.longPress = false

    if(utilityVars.itemsSelected === true) {
        return
    }

    detectDoubleClick(el)

    utilityVars.timer = setTimeout(() => {
        utilityVars.timer = null
        $("#navProfile").hide()
        $("#navOptions").css("display", "flex")
        $(".memoNote").find("div").show()
        el.attr("data-selected", true)
        el.find("div").css("background", "url(media/icons/checkIcon2.svg)")
        utilityVars.longPress = true
        $("#userInput, #btnMic").click(resetSelection)
    }, 500)
}

function clearTimer() {
    clearTimeout(utilityVars.timer)
}

function tapEnd(el) {
    clearTimer()
    const {longPress, itemsSelected} = utilityVars

    //remove event attached on tapStart
    $(this).off("touchmove mousemove")

    //DO NOTHING ON LONGPRESS WHILE THERE ARE NOTES SELECTED
    if (longPress && itemsSelected) return;


    //IF LONG PRESS TRIGGERED
    if(longPress) {
        console.log("TRUUUUUE")
        utilityVars.itemsSelected = true
        return
    }


    //TRIGGERED IF THERE'S ALREADY AT LEAST ONE MEMO NOTE SELECTED ON CLICK
    if(itemsSelected) {
        console.log("YUPPI")
        console.log("was checked : " + el.find("input").is(":checked"))
        if(el.attr("data-selected") === "false") {
            el.attr("data-selected", true)
            el.find("div").css("background", "url(media/icons/checkIcon2.svg)")
            return
        }
        el.attr("data-selected", false)
        el.find("div").css("background", "#fffff2")
        let checks = 0
        $(".memoNote").each(function(index, value) {
            if($(this).attr("data-selected") === "true") {
                checks++
                console.log("check n" + index)
            }
        })
        if(checks == 0) {
            utilityVars.itemsSelected = false
            resetSelection()
        }
    }
}

function resetSelection() {
    $("#userInput, #btnMic").off("click")
    $("#navOptions").hide()
    $("#navProfile").css("display", "flex")
    $(".memoNote").find(".checkSelect").hide()
    $(".memoNote").attr("data-selected", false)
    $(".checkSelect").css("background", "#fffff2")
    utilityVars.itemsSelected = false
}



//PAGE DISPLAY FUNCTIONS

function displayBasedOnCookie() {
    //if cookie is set (user logged in) => show user's memo page
    //if cookie isn't set => show login form
    if(document.cookie) {
        console.log(document.cookie)
        showMemoPage()
        return
    }
    showLoginForm()
}

function showMemoPage() {
    $("#navProfile").css("display", "flex")
    getProfileInfos()
    $(".addedElements").css("display", "flex")
    populateApp()
}

function showLoginForm() {
    $("#loginForm").css("display", "flex")
    $("#navProfile").hide()
}

function hideLoginForm() {
    $("#loginForm").hide()
}

function showRegistrationForm() {
    $("#registrationForm").css("display", "flex")
    //display only the back button from options menu
    $("#navOptions").css("display", "flex")
    $("#deleteBtn").hide()
}

function hideRegistrationForm() {
    $("#registrationForm").css("display", "none")
    //reset options menu items and hide options menu
    $("#navOptions").hide()
    $("#deleteBtn").show()
}

function logOut() {
    ajaxGetRequest("userOperations.php?action=logout", () => location.reload())
}

function getProfileInfos() {
    const cookieArr = formatProfileInfos()

    $("#profileInfos p:first").text(cookieArr[0])
    $("#profileInfos p:last").text(cookieArr[1])
}

function formatProfileInfos() {
    let cookieStr = document.cookie
    let cookieArr = cookieStr.split(";")
    cookieArr[1] = cookieArr[1].trim()
    let email = getDataFromCookieArr(cookieArr, "email=")
    let username = getDataFromCookieArr(cookieArr, "username=")
    email = email.substring(email.indexOf("=") + 1, email.length).replace("%40", "@")
    username = username.substring(username.indexOf("=") + 1, username.length)
    return [username, email]

    function getDataFromCookieArr(arr, el) {
        let res = arr.filter(cookieEl => {
            return cookieEl.startsWith(el)
        }).join()

        return res
    }
}



//RECORDING FUNCTIONS

function recStart() {
    startRecording()
    $(document).on("mouseup touchend", recEnd)
}

function recEnd(e) {
    //prevent context menu popup on long press
    e.preventDefault()

    stopRecording()
    $(document).off("mouseup touchend", recEnd)
}




// TOGGLE RECORDING FUNCTIONS

function startRecording() {
    utilityVars.timer = setTimeout(() => {
        utilityVars.timer = null
        $("#btnMic").css("transform", "scale(1.25)")
        toggleSpeechRecognition()
    }, 750)
}
  
function stopRecording() {
    clearTimer()
    if(!utilityVars.recording) return

    toggleSpeechRecognition()
    setTimeout(() => {
        if(utilityVars.speech === "") {
            console.log("NO TEXT RECORDED")
            return
        }
        createMemo(utilityVars.speech)
    },500)
    $("#btnMic").css("transform", "scale(1)")
}


function toggleSpeechRecognition() {
  if(utilityVars.recording) {
    utilityVars.recognitionObj.onend = null
    utilityVars.recognitionObj.stop()
    utilityVars.recording = null
  } else {
    utilityVars.recognitionObj.onend = continueRecognitionOnEnd
    utilityVars.recognitionObj.start()
    utilityVars.recording = true
  }
}

function continueRecognitionOnEnd() {
  //Prevent mic recording to stop on its own after a few seconds
  console.log('Speech recognition has stopped. Starting again ...')
  utilityVars.recognitionObj.start()
}


function onSpeak(e) {
  utilityVars.results = e.results;
  utilityVars.speech += e.results[e.results.length-1][0].transcript
}

utilityVars.recognitionObj.addEventListener('result', onSpeak)


function detectDoubleClick(el) {
    
    let timeout = setTimeout(() => {
        utilityVars.dblClickTime = 0
        clearTimeout(timeout)
    },750)

    if (utilityVars.dblClickTime === 0) {
        utilityVars.dblClickTime = new Date().getTime();
        utilityVars.clickedMemoId = el[0].id;
        return;
    }

    if ((new Date().getTime() - utilityVars.dblClickTime) < 750 &&
        utilityVars.clickedMemoId === el[0].id) {
        utilityVars.dblClickTime = 0;
        el.attr("contentEditable", "true").focus();
    }
}


//PREVENT POST RESUBMISSION ON REFRESH
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}