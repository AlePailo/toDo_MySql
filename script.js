$(document).ready(function() {
    
    //CHECKING IF THE USER IS LOGGED IN
    displayBasedOnCookie()



    //NAVBAR EVENTS

    //(?) icon press => open help box popup
    $("#helpBtn").click(() => $("#helpBox")[0].showModal())

    //close help box on its close button press
    $("#btnCloseHelpBox").click(() => $("#helpBox")[0].close())

    //profile icon press => toggle profile infos popup
    $("#profileBtn").click(toggleprofileInfosPopup)

    //profile infos popup button press => logout
    $("#btnLogOut").click(logOut)

    //back arrow icon events
    $("#backBtn").click(handleBackBtnClick)

    //deletion icon press => brings confirm deletion popup 
    $("#deleteBtn").click(() => $("#confirmDeletion")[0].showModal())//$("#confirmDeletion").css("display", "flex"))



    //USER INPUTS BOTTOM BAR EVENTS

    //Mic icon press
    $("#btnMic").on("mousedown touchstart", recStart)


    //send icon press => create memo with input text
    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
        $("#userInput").val("")
    })



    //CONFIRM DELETION POPUP EVENTS

    //confirm deletion popup left option press => cancel memo deletion
    $("#confirmDeletion").find("span:first").click(function() {
        $("#confirmDeletion")[0].close()
        //$("#confirmDeletion").css("display", "none")
        resetSelection()
    })

    //confirm deletion popup right option press => confirm memo deletion
    $("#confirmDeletion").find("span:last").click(performDeletion)



    //NOTES DISPLAY ZONE EVENTS

    //single click on memo
    $(".addedElements").on("click", "p", function(){
        saveMemoValue($(this).text())
    })
    
    //memo out of focus
    $(".addedElements").on("blur", "p", updateMemo)

    $(document).click(closeProfileInfosIfOpen)



    //MEMO CLICK EVENTS BASED ON POINTER TYPE (mouse or touch)

    $(".addedElements").on("pointerdown", ".memoNote", checkPointerType)

    $(".addedElements").on("pointerup", ".memoNote", checkPointerType)

    $(".addedElements").on("touchmove mousemove", ".memoNote", function() {
        if(utilityVars.itemsSelected != true) {
            tapEnd($(this))
        }
    })

    
    //HIDE FORM ERRORS NOTIFICATIONS WHEN CLICKING ON AN INPUT FIELD
    $("input").focus(function() {
        $("#formNotification").hide()
    })

    //LINK FROM LOGIN FORM TO REGISTRATION FORM CLICK
    $("#linkToRegistration").click(function() {
        showRegistrationForm()
        hideLoginForm()
    })

    


    //INPUTS' ICONS CLICK EVENT 
    $(".identification").find("input ~ span").click(focusSiblingInput)

    //LOGIN FORM BUTTON CLICK EVENT
    $("#btnLogin").click(tryLogin)

    //REGISTRATION FORM BUTTON CLICK EVENT
    $("#btnRegistration").click(tryRegistration)


    //REGISTRATION SUBMIT EVENT (triggered by #btnRegistration after successful validation)
    $("#registrationForm").submit(function() {
        location.reload()
    })

})

//GLOBALLY ACCESSIBLE VARIABLES KEPT IN THIS OBJECT TO AVOID POSSIBLE NAME CONFLICTS
const utilityVars = {
    timer : null,               //used to recognize a long press (held tap for more than 0.5s)
    itemsSelected : false,      //set to true if there's at least one memo selected
    longPress : false,          //set to true if the last click was a long press
    dblClickTime : 0,           //used to recognize a double click (two clicks on same memo in less than 0.75 sec)
    clickedMemoId : null        //used to track last clicked memo (useful to recognize double click on same memo)
}

function sendForm() {
    console.log($("#registrationForm"))
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
    let idsArr = $("[data-selected=true]").map(function() {
        return this.id
    }).get()
    console.log(idsArr)
    deleteMemo(idsArr)
    resetSelection()
    $("#confirmDeletion")[0].close()
    //$("#confirmDeletion").css("display", "none")
}


function closeProfileInfosIfOpen(e) {
        
    //PREVENT REST OF FUNCTION EXECUTION ON PROFILE ICON PRESS CAUSE ITS BEHAVIOUR IS ALREADY HANDLED
    if(e.target === $("#profileBtn").find("img")[0]) {
        return
    }

    let container = $("#profileInfos")

    //CHECK IF PROFILE INFOS DIV IS OPEN
    if(container.css("display") != "flex") {
        return
    }

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
}

function focusSiblingInput() {

    //focus sibling input
    let input = $(this).siblings("input")
    input.focus()
    
    let imgDataCover = $(this).find("img").attr("data-cover")


    //return if it's not the passowrd field
    if(typeof imgDataCover === "undefined" || typeof imgDataCover === false) {
        return
    }

    //set caret after last input character and toggle show/hide password field value
    setCursorAtInputEnd(input[0])

    togglePswVisibility(imgDataCover, $(this))

}

function togglePswVisibility(imgDataCover, span) {
    if(imgDataCover === "cover") {
        span.find("img").attr("src", "media/icons/pswShowIcon.svg")
        span.find("img").attr("data-cover", "show")
        span.siblings("input").attr("type", "text")
        return
    }

    span.find("img").attr("src", "media/icons/pswHideIcon.svg")
    span.find("img").attr("data-cover", "cover")
    span.siblings("input").attr("type", "password")
}

function toggleprofileInfosPopup() {
    if($("#profileInfos").css("display") === "none") {
        $("#profileInfos").css("display", "flex")
        return
    }
    $("#profileInfos").css("display", "none")
}


//LOGIN LOGIC FUNCTION

function tryLogin() {
    const email = $("#loginEmail").val()
    const psw = $("#loginPsw").val()

    const userInfo = {
        loginAttemptEmail : email,
        loginAttemptPsw : psw
    }

    ajaxPostRequest("userOperations.php", userInfo, successfulLogin)
}

function successfulLogin(data) {
    data = JSON.parse(data)
    if(data !== "Logged in successfully") {
        $("#formNotification").show().text(data).css("background", "#BB0A21")
        return false
    }
    location.reload()
}

function checkPointerType(e) {
    e.stopPropagation()
    if(e.type === "pointerdown") {
        handlePointerType(e, tapStart, $(this))
    } else if(e.type === "pointerup") {
        handlePointerType(e, tapEnd, $(this))
    }
}

function handlePointerType(e, func, el) {
    switch(e.pointerType) {
        case "mouse" :
            func(el)
            break
        case "touch" :
            func(el)
            break
    }
}


//REGISTRATION LOGIC FUNCTION

function tryRegistration() {
    const username = $("#registrationUsername").val()
    const email = $("#registrationEmail").val()
    const psw = $("#registrationPsw").val()

    const userInfo = {
        regAttemptUsername : username,
        regAttemptEmail : email,
        regAttemptPsw : psw
    }

    ajaxPostRequest("userOperations.php", userInfo, successfulRegValidation)

    
    function successfulRegValidation(data) {
        data = JSON.parse(data)
        if(data != "Valid") {
            $("#formNotification").show().text(data).css("background", "#BB0A21")
            return false
        }
        sendForm()
    }
}



//MEMOS OPERATIONS FUNCTIONS

function createMemo(memoText) {
    const memoObj = {
        text : memoText
    }
    ajaxPostRequest("notesOperations.php", memoObj, successfullyCreatedMemo)

    function successfullyCreatedMemo(data) {
        data = JSON.parse(data)
        buildMemoP(this.indexValue.text, data[0].id)
    }
}

function buildMemoP(text, id) {
    const memo = $('<p/>',{
        text: text,
        class: "memoNote",
        id: id
    }).attr("spellcheck", "false")
    .attr("data-selected", false)
    .appendTo('.addedElements')

    $("<div/>", {
        class: "checkSelect"
    }).appendTo(memo)
}


function deleteMemo(idsArr) {
    const idsObj = {
        deletionArr : idsArr
    }
    ajaxPostRequest("notesOperations.php", idsObj, successfullyDeletedMemo)

    function successfullyDeletedMemo() {
        this.indexValue.deletionArr.forEach(id => {
            $(`p.memoNote[id=${id}]`).remove()
        })
    }
}


function updateMemo() {
    $(this).attr("contentEditable", false)
    if(checkMemoValueVariations($(this), $(this).text()) !== true) {
        return
    }

    let memoId = $(this).attr("id")
    let newText = $(this).text()

    const memoInfos = {
        changedMemoID : memoId,
        newMemoText : newText
    }
    ajaxPostRequest("notesOperations.php", memoInfos)
}


//AJAX REQUESTS FUNCTIONS

function ajaxPostRequest(ajaxUrl, ajaxData, successFunction) {
    $.ajax({
        type : "POST",
        url : ajaxUrl,
        data : ajaxData,
        indexValue: ajaxData,
        success : successFunction
    })
}

function ajaxGetRequest(ajaxUrl, successFunction) {
    $.ajax({
        type : "GET",
        url : ajaxUrl,
        success : successFunction
    })
}



//FILL PAGE WITH USER'S MEMO FUNCTION

function populateApp() {
    ajaxGetRequest("notesOperations.php?action=loadContent", successfullyRequestedAllMemos)
    
    function successfullyRequestedAllMemos(data) {
        data = JSON.parse(data)
        console.log(data)
                
        if(data === "No results") {
            return
        }

        for(let el in data) {
            console.log(data[el].content)
            buildMemoP(data[el].content, data[el].id)
        }
    }
}



// FIRST FUNCTION SAVES MEMO NOTE VALUE ON CLICK WHILE SECOND FUNCTION CHECKS IF THE VALUE IS CHANGED WHEN THE NOTE LOSES FOCUS
// IF THE VALUE IS THE SAME NOTHING HAPPENS, IF IT'S DIFFERENT THE DATABASE GETS UPDATED WITH THE NEW MEMO VALUE

function saveMemoValue(value) {
    localStorage.setItem("memoValue", value)
}


function checkMemoValueVariations(el, currentValue) {
    if(localStorage.getItem("memoValue") != currentValue && currentValue != "") {
        return true
    }
    if(currentValue === "") {
       deleteMemo([el[0].id])
    }
}



//LONG TAP LOGIC

function tapStart(el) {

    //if there are notes selected ignore double click and long press behaviours
    utilityVars.longPress = false

    if(utilityVars.itemsSelected === true) {
        return
    }

    if(utilityVars.itemsSelected != true) {
        detectDoubleClick(el)
    }

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
    const isLongPressed = utilityVars.longPress
    const itemsSelected = utilityVars.itemsSelected


    //DO NOTHING ON LONGPRESS WHILE THERE ARE NOTES SELECTED
    if(isLongPressed === true && itemsSelected === true) {
        return
    }


    //IF LONG PRESS TRIGGERED
    if(isLongPressed === true) {
        console.log("TRUUUUUE")
        utilityVars.itemsSelected = true
        return
    }


    //TRIGGERED IF THERE'S ALREADY AT LEAST ONE MEMO NOTE SELECTED ON CLICK
    if(itemsSelected === true) {
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




function setCursorAtInputEnd(input) {
    let sel = window.getSelection();
    sel.selectAllChildren(input);
    sel.collapseToEnd();
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
    startRegistration()
    $(document).on("mouseup touchend", recEnd)
}

function recEnd(e) {
    //prevent context menu popup on long press
    e.preventDefault()

    stopRegistration()
    $(document).off("mouseup touchend", recEnd)
}




// TOGGLE RECORDING FUNCTIONS

function startRegistration() {
    utilityVars.timer = setTimeout(() => {
      utilityVars.timer = null
      $("#btnMic").css("transform", "scale(1.25)")
      localStorage.setItem("speech", "")
      toggleRecording()
    }, 750)
}
  
function stopRegistration() {
    clearTimer()
    if(recording === null) {
        return
    }
    toggleRecording()
    setTimeout(() => {
        if(localStorage.getItem("speech") === "") {
            console.log("NO TEXT")
            return
        }
        //$("#results").html(localStorage.getItem("speech"))
        createMemo(localStorage.getItem("speech"))
        //console.log(localStorage.getItem("speech"))
    },500)
    $("#btnMic").css("transform", "scale(1)")
}





window.SpeechRecognition = window.SpeechRecognition ||
window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition()
let recording = null;
let results = null;

recognition.continuous = true;
recognition.lang = "it-IT"

function toggleRecording() {
  if(recording) {
    recognition.onend = null
    recognition.stop()
    recording = null
  } else {
    recognition.onend = onEnd
    recognition.start()
    recording = true
  }
}

function onEnd() {
  //Prevent mic recording to stop on its own after a few seconds
  console.log('Speech recognition has stopped. Starting again ...')
  recognition.start()
}


function onSpeak(e) {
  results = e.results;
  //console.log(e.results[e.results.length-1][0].transcript)
  let text = localStorage.getItem("speech") + e.results[e.results.length-1][0].transcript
  localStorage.setItem("speech", text)
}

recognition.addEventListener('result', onSpeak)


function detectDoubleClick(el) {
    
    let timeout = setTimeout(() => {
        utilityVars.dblClickTime = 0
        //localStorage.setItem("dblClickTime", 0)
        console.log("Time passed")
        clearTimeout(timeout)
    },750)

    //let dblClickTime = Number(localStorage.getItem("dblClickTime"))
    let dblClickTime = Number(utilityVars.dblClickTime)
    if(dblClickTime === 0) {
        //localStorage.setItem("dblClickTime", new Date().getTime())
        utilityVars.dblClickTime = new Date().getTime()
        utilityVars.clickedMemoId = el[0].id
        //localStorage.setItem("memoClicked", el[0].id)
        return
    }

    if((new Date().getTime() - dblClickTime) < 750 && utilityVars.clickedMemoId === el[0].id) {//localStorage.getItem("memoClicked") === el[0].id) {
        utilityVars.dblClickTime = 0
        //localStorage.setItem("dblClickTime", 0)
        console.log("double click")
        //console.log(localStorage.getItem("memoClicked"))
        console.log(el[0].id)
        el[0].contentEditable = "true"
        el[0].focus()
    }
}


//PREVENT POST RESUBMISSION ON REFRESH
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}