$(document).ready(function() {
    
    //CHECKING IF THE USER IS LOGGED IN
    displayBasedOnCookie()


    /*//RESETTING LOCAL STORAGE VARIABLES
    localStorage.setItem("dblClickTime", 0)
    localStorage.setItem("itemsSelected", false)
    localStorage.setItem("longPress", false)*/



    //NAVBAR EVENTS

    //(?) icon press => open help box popup
    $("#helpBtn").click(function() {
        $("#helpBox")[0].showModal()    
    })

    //close help box on its close button press
    $("#btnCloseHelpBox").click(function() {
        $("#helpBox")[0].close()
    })

    //profile icon press => toggle profile infos popup
    $("#profileBtn").click(function() {
        if($("#profileInfos").css("display") === "none") {
            $("#profileInfos").css("display", "flex")
            return
        }
        $("#profileInfos").css("display", "none")
    })

    //profile infos popup button press => logout
    $("#btnLogOut").click(function() {
        logOut()
    })

    //back arrow icon events
    $("#backBtn").click(handleBackBtnClick)

    //deletion icon press => brings confirm deletion popup 
    $("#deleteBtn").click(function() {
        $("#confirmDeletion").css("display", "flex")
    })



    //USER INPUTS BOTTOM BAR EVENTS

    //mic icon events based on device
    $("#btnMic").on({
        mousedown : recClickStart,
        touchstart : recTapStart
    })

    //send icon press => create memo with input text
    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
        $("#userInput").val("")
    })



    //CONFIRM DELETION POPUP EVENTS

    //confirm deletion popup left option press => cancel memo deletion
    $("#confirmDeletion p span:first").click(function() {
        $("#confirmDeletion").css("display", "none")
        resetSelection()
    })

    //confirm deletion popup right option press => confirm memo deletion
    $("#confirmDeletion p span:last").click(function() {
        let idsArr = $("[data-selected=true]").map(function() {
            return this.id
        }).get()
        console.log(idsArr)
        deleteMemo(idsArr)
        resetSelection()
        $("#confirmDeletion").css("display", "none")
    })



    //NOTES DISPLAY ZONE EVENTS

    $(".addedElements").on("click", "p", function(){
        saveMemoValue($(this).text())
    })

    /*$(".addedElements").on("blur", "p", function(){
        $(this).attr("contentEditable", false)
        if(checkMemoValueVariations($(this), $(this).text()) === true) {
            $.ajax({
                type : "POST",
                url : "notesOperations.php",
                data : {
                    changedMemoID : $(this).attr("id"),
                    newMemoText : $(this).text()
                },
                success : function() {
                    
                }
            })
        }
    })*/
    
    $(".addedElements").on("blur", "p", updateMemo)

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

    
    $(".addedElements").on("click", ".checkSelect", function() {
        console.log("CHECKBOX")
    })


    $(document).click(closeProfileInfosIfOpen)

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

    /*$(".addedElements").on("touchstart", ".memoNote", function() {
        tapStart($(this))
    })

    $(".addedElements").on("touchend", ".memoNote", function() {
        tapEnd($(this))

        //GETS RID OF FIRST CLICK CHECKBOX BUG (REMOVE THIS AND TRY TO UNCHECK A CHECKBOX TO SEE)
        //event.preventDefault()
    })

    $(".addedElements").on("click", ".memoNote", function() {
        tapStart($(this))
    })*/

    $(".addedElements").on("pointerdown", ".memoNote", function(e) {
        switch(e.pointerType) {
            case "mouse" : 
                tapStart($(this))
                break
            case "touch" : 
                tapStart($(this))
                break
        }
    })

    $(".addedElements").on("pointerup", ".memoNote", function(e) {
        switch(e.pointerType) {
            case "mouse" : 
                tapEnd($(this))
                break
            case "touch" : 
                tapEnd($(this))
                break
        }
    })

    $(".addedElements").on("touchmove mousemove", ".memoNote", function() {
        /*if(localStorage.getItem("itemsSelected") != "true") {
            tapEnd($(this))
        }*/
        if(utilityVars.itemsSelected != true) {
            tapEnd($(this))
        }
    })

    

    $("input").focus(function() {
        $("#formNotification").hide()
    })

    $("#linkToRegistration").click(function() {
        hideLoginForm()
        $("#registrationForm").css("display", "flex")
        $("#navOptions").css("display", "flex")
        $("#deleteBtn").css("visibility", "hidden")
    })


    //INPUTS' ICONS CLICK EVENT 
    $(".identification input ~ span").click(function() {

        //focus parent input
        let input = $(this).siblings("input")
        let imgDataCover = $(this).find("img").attr("data-cover")
        input.focus()
        
        //set caret after last input character and toggle show/hide password field value
        setCursorAtInputEnd(input[0])


        //return if it's not the passowrd field
        if(typeof imgDataCover === "undefined" || typeof imgDataCover === false) {
            return
        }

        if(imgDataCover === "cover") {
            $(this).find("img").attr("src", "media/icons/pswShowIcon.svg")
            $(this).find("img").attr("data-cover", "show")
            $(this).siblings("input").attr("type", "text")
            return
        }

        $(this).find("img").attr("src", "media/icons/pswHideIcon.svg")
        $(this).find("img").attr("data-cover", "cover")
        $(this).siblings("input").attr("type", "password")

    })

    /*$("#btnLogin").click(function() {
        const email = $("#loginEmail").val()
        const psw = $("#loginPsw").val()

        $.ajax({
            type : "POST",
            url : "userOperations.php",
            data : {
                loginAttemptEmail : email,
                loginAttemptPsw : psw
            },
            success: function(data) {
                data = JSON.parse(data)
                console.log(data)
                if(data !== "Logged in successfully") {
                    $("#formNotification").show().text(data).css("background", "#BB0A21")
                    return false
                }
                //hideLoginForm()
                //showMemoPage()
                window.location.reload()
            }
        })
    })*/

    $("#btnLogin").click(tryLogin)

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



    
    /*$("#btnRegistration").click(function() {
        const username = $("#registrationUsername").val()
        const email = $("#registrationEmail").val()
        const psw = $("#registrationPsw").val()

        $.ajax({
            type : "POST",
            url : "userOperations.php",
            data : {
                regAttemptUsername : username,
                regAttemptEmail : email,
                regAttemptPsw : psw
            },
            success : function(data) {
                data = JSON.parse(data)
                if(data != "Valid") {
                    $("#formNotification").show().text(data).css("background", "#BB0A21")
                    return false
                }
                sendForm()
            }
        })
    })*/

    $("#btnRegistration").click(tryRegistration)

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
    }

    function successfulRegValidation(data) {
        data = JSON.parse(data)
        if(data != "Valid") {
            $("#formNotification").show().text(data).css("background", "#BB0A21")
            return false
        }
        sendForm()
    }



    $("#registrationForm").submit(function() {
        //$(this).hide(1000)
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
    $("#registrationForm").hide()
    $("#deleteBtn").css("visibility", "visible")
    showLoginForm()
}


//MEMO ELEMENT CREATION BASED ON USER INPUT

/*function createMemo(text) {
    const el = $('<p/>',{
        text: text,
        class: "memoNote"
    }).attr("spellcheck", "false")
    .attr("data-selected", false)
    .appendTo('.addedElements')
    $("#userInput").val("")

    $('<input>',{
        class: "checkSelect"
    }).attr("type", "checkbox")
    .appendTo(el)
}*/



//MEMOS OPERATIONS FUNCTIONS

/*function createMemo(text) {
    $.ajax({
        type : "POST",
        url : "notesOperations.php",
        data : {
            text : text
        },
        success : function(data) {
            data = JSON.parse(data)
            buildMemoP(text, data[0].id)
        }
    })
}*/
function createMemo(memoText) {
    const memoObj = {
        text : memoText
    }
    ajaxPostRequest("notesOperations.php", memoObj, successfullyCreatedMemo)
}

function successfullyCreatedMemo(data) {
    data = JSON.parse(data)
    buildMemoP(this.indexValue.text, data[0].id)
}

function buildMemoP(text, id) {
    const memo = $('<p/>',{
        text: text,
        class: "memoNote",
        id: id
    }).attr("spellcheck", "false")
    .attr("data-selected", false)
    .appendTo('.addedElements')

    $('<input>',{
        class: "checkSelect"
    }).attr("type", "checkbox")
    .appendTo(memo)
}

/*function deleteMemo(idsArr) {
    $.ajax({
        type : "POST",
        url : "notesOperations.php?",
        data : {
            deletionArr : idsArr
        },
        success : function() {
            idsArr.forEach(id => {
                $(`p.memoNote[id=${id}]`).remove()
            })
        }
    })
}*/

function deleteMemo(idsArr) {
    const idsObj = {
        deletionArr : idsArr
    }
    ajaxPostRequest("notesOperations.php", idsObj, successfullyDeletedMemo)
}

function successfullyDeletedMemo() {
    this.indexValue.deletionArr.forEach(id => {
        $(`p.memoNote[id=${id}]`).remove()
    })
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

/*function populateApp() {
    $.ajax({
        type : "GET",
        url : "notesOperations.php?action=loadContent",
        success : function(data) {
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
    })
}*/

function populateApp() {
    ajaxGetRequest("notesOperations.php?action=loadContent", successfullyRequestedAllMemos)
}

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


//let timer = null

//LONG TAP LOGIC

function tapStart(el) {

    /*if(localStorage.getItem("itemsSelected") != "true") {
        detectDoubleClick(el)
    }*/

    if(utilityVars.itemsSelected != true) {
        detectDoubleClick(el)
    }

    utilityVars.longPress = false
    //localStorage.setItem("longPress", false)

    if(el.attr("data-selected") != "true" && utilityVars.itemsSelected === false) { //localStorage.getItem("itemsSelected") === "false"
        el.attr("data-selected", true)
    }

    utilityVars.timer = setTimeout(() => {
        utilityVars.timer = null
        console.log("half second passed")

        
        $("#navProfile").hide()
        $("#navOptions").css("display", "flex")
        $(".memoNote input:checkbox").show()
        el.children("input").attr("checked", true)

        utilityVars.longPress = true
        $("#userInput, #btnMic").click(resetSelection)
        //localStorage.setItem("longPress", true)

    }, 500)
}

function clearTimer() {
    clearTimeout(utilityVars.timer)
}

function tapEnd(el) {
    clearTimer()
    //console.log(localStorage.getItem("longPress"))
    //const isLongPressed = localStorage.getItem("longPress")
    const isLongPressed = utilityVars.longPress
    const itemsSelected = utilityVars.itemsSelected
    //const itemsSelected = localStorage.getItem("itemsSelected")

    //console.log("itemsSelected : " + localStorage.getItem("itemsSelected"))
    console.log("longPress : " + isLongPressed)


    //DO NOTHING ON LONGPRESS WHILE THERE ARE NOTES SELECTED
    if(isLongPressed === true && itemsSelected === true) {
        return
    }


    //IF LONG PRESS TRIGGERED
    if(isLongPressed === true) {
        console.log("TRUUUUUE")
        utilityVars.itemsSelected = true
        //localStorage.setItem("itemsSelected", true)
        return
    }


    //TRIGGERED IF THERE'S ALREADY AT LEAST ONE MEMO NOTE SELECTED ON CLICK
    if(itemsSelected === true) {
        console.log("YUPPI")
        if(el.attr("data-selected") === "false") {
            el.attr("data-selected", true)
            el.find("input").attr("checked", "checked")
            return
        }
        el.attr("data-selected", false)
        el.find("input").removeAttr("checked")
        let checks = 0
        $(".memoNote input:checkbox").each(function(index, value) {
            console.log(this.checked)
            if($(this).attr("checked")) {
                checks++
                console.log("check n" + index)
            }
        })
        if(checks == 0) {
            utilityVars.itemsSelected = false
            //localStorage.setItem("itemsSelected", false)
            resetSelection()
        }
    }

    el.attr("data-selected", false)
}

function resetSelection() {
    $("#userInput, #btnMic").off("click")
    $("#navOptions").hide()
    $("#navProfile").css("display", "flex")
    $(".memoNote").attr("data-selected", false)
    $(".memoNote input").hide().removeAttr("checked")
    //localStorage.setItem("itemsSelected", false)
    utilityVars.itemsSelected = false



    //$(".memoNote").attr("userSelected") === "true" ? $(this).css("background", "var(--on-focus-memo)") : $(this).css("background", "var(--secondary-bg)")
    //el.css("background", "var(--secondary-bg)")
}

/*function getSessionVariables() {
    $("#loadingCircleDiv").css("display", "flex")
    $.ajax({
        type: "POST",
        url: "userOperations.php",
        data: {
            GetSessionVariables : "true" 
        },
        success : function(data) {
            $("#loadingCircleDiv").hide()
            data = JSON.parse(data)
            if(data === true) {
                showMemoPage()
            } else {
                showLoginForm()
                //$("#loginForm").css("display", "flex")
                //alert("Not logged in")
            }
        }
    })
}*/

function displayBasedOnCookie() {
    if(document.cookie) {
        showMemoPage()
        return
    }
    showLoginForm()
}

function showLoginForm() {
    $("#loginForm").css("display", "flex")
    $("#navOptions").hide()
    $("#navProfile").hide()
}

function hideLoginForm() {
    $("#loginForm").hide()
}

function setCursorAtInputEnd(input) {
    let sel = window.getSelection();
    sel.selectAllChildren(input);
    sel.collapseToEnd();
}

/*function logOut() {
    $.ajax({
        type : "GET",
        url : "userOperations.php?action=logout",
        success: function() {
            location.reload()
        }
    })
}*/

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
    //console.log(cookieStr)
    let cookieArr = cookieStr.split(";")
    cookieArr[1] = cookieArr[1].trim()
    let email = getDataFromCookieArr(cookieArr, "email=")
    let username = getDataFromCookieArr(cookieArr, "username=")
    email = email.substring(email.indexOf("=") + 1, email.length).replace("%40", "@")
    username = username.substring(username.indexOf("=") + 1, username.length)
    return [username, email]
}


function getDataFromCookieArr(arr, el) {
    let res = arr.filter(cookieEl => {
        return cookieEl.startsWith(el)
    }).join()

    return res
}




// MOUSE EVENTS FUNCTIONS

function recClickStart() {
    document.addEventListener("mouseup", recClickEnd, true)
    startRegistration()
}
  
function recClickEnd() {
    stopRegistration()
    document.removeEventListener("mouseup", recClickEnd, true)
}





// MOBILE TOUCH EVENTS FUNCTIONS

function recTapStart() {
    document.addEventListener("touchend", recTapEnd, true)
    startRegistration()
}
  
function recTapEnd(e) {
    //e.preventDefault()
    stopRegistration()
    document.removeEventListener("touchend", recTapEnd, true)
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




function showMemoPage() {
    $("#navProfile").css("display", "flex")
    getProfileInfos()
    $(".addedElements").css("display", "flex")
    populateApp()
}


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