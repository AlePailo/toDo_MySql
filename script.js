$(document).ready(function() {
    
    getSessionVariables()
    localStorage.setItem("dblClickTime", 0)
    localStorage.setItem("itemsSelected", false)
    localStorage.setItem("longPress", false)

    $("#btnMic").on({
        mousedown : recClickStart,
        touchstart : recTapStart
    })

    $("#btnMic").click(function() {
        if(localStorage.getItem("itemsSelected") != false) {
            resetSelection()
        }
    })

    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
        
        $("#userInput").val("")
    })

    $("#userInput").focus(function() {
        if(localStorage.getItem("itemsSelected") != false) {
            resetSelection()
        }
    })

    $("#deleteBtn").click(function() {
        $("#confirmDeletion").css("display", "flex")
    })

    $("#confirmDeletion p span:first").click(function() {
        $("#confirmDeletion").css("display", "none")
        resetSelection()
    })

    $("#confirmDeletion p span:last").click(function() {
        let idsArr = $("[data-selected=true]").map(function() {
            return this.id
        }).get()
        console.log(idsArr)
        deleteMemo(idsArr)
        resetSelection()
        $("#confirmDeletion").css("display", "none")
    })

    $(".addedElements").on("click", "p", function(){
        saveMemoValue($(this).text())
    })

    $(".addedElements").on("blur", "p", function(){
        $(this).attr("contentEditable", false)
        if(checkMemoValueVariations($(this).text()) === true) {
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
        } else {
            console.log("No variations")
        }
        
    })

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

    /*$(".addedElements").on("mouseup", ".memoNote", function() {
        tapEnd($(this))
    })*/

    $("#btnLogOut").click(function() {
        logOut()
    })

    $("#backBtn").click(function() {
        if($("#registrationForm").css("display") === "flex") {
            $("#registrationForm").hide()
            $("#deleteBtn").css("visibility", "visible")
            showLoginForm()
        } else {
            resetSelection()
        }
    })

    $("#profileBtn").click(function() {
        if($("#profileInfos").css("display") === "none") {
            $("#profileInfos").css("display", "flex")
        } else {
            $("#profileInfos").css("display", "none")
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

    $(".identification input ~ span").click(function() {

        let input = $(this).siblings("input")
        let imgDataCover = $(this).find("img").attr("data-cover")
        input.focus()

        //RETURN IF IT'S NOT A PASSWORD FIELD
        if(typeof imgDataCover === "undefined" || typeof imgDataCover === false) {
            return
        }


        //SET CARET AFTER LAST INPUT CHARACTER AND TOGGLE SHOW/HIDE PASSWORD FIELD VALUE
        setCursorAtInputEnd(input[0])

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

    $(".addedElements").on("change", "input.checkSelect", function(){
        /*if($(this).attr("display") === "none") {
            return
        }
        if($(this).attr("checked") === "checked") {
            alert("SIUM")
            $(this).attr("checked", undefined)
        } else {
            $(this).attr("checked", "checked")
        }*/
    })

    //localStorage.setItem("timer", null)

    /*$(".registrationForm").submit(function(e) {
        const username = $("#registrationUsername").val()
        const email = $("#registrationEmail").val()
        const psw = $("#registrationPsw").val()
        
        e.preventDefault()

        $.ajax({
            context: this,
            type : "POST",
            url : "userOperations.php",
            data : {
                regAttemptUsername : username
            },
            success: function(data, e) {
                console.log(data)
                if(JSON.parse(data) == true) {
                    $("#formNotification").show().text("Username già in uso").css("background", "#BB0A21")
                    return
                }

                $.ajax({
                    type : "POST",
                    url : "userOperations.php",
                    data : {
                        regAttemptEmail : email
                    },
                    success: function(data, e) {
                        console.log(data)
                        if(JSON.parse(data) == true) {
                            $("#formNotification").show().text("Email già in uso").css("background", "#BB0A21")
                            return
                        }
                    }
                })
                this.submit()
                //this.style.display = "none"
                $(".addedElements").show()
            }
        })
    })*/

    $("#btnLogin").click(function() {
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
                hideLoginForm()
                showMemoPage()
            }
        })
    })
    
    $("#btnRegistration").click(function() {
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
    })

    $("#registrationForm").submit(function() {
        $(this).hide(1000)
    })

})

function sendForm() {
    console.log($("#registrationForm"))
    $("#registrationForm").submit()
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

function populateApp() {
    $.ajax({
        type : "GET",
        url : "notesOperations.php?action=loadContent",
        success : function(data) {
            data = JSON.parse(data)
            console.log(data)
            for(let el in data) {
                console.log(data[el].content)
                
                /*const memo = $('<p/>',{
                    text: data[el].content,
                    class: "memoNote",
                    id: data[el].id
                }).attr("spellcheck", "false")
                .attr("data-selected", false)
                .appendTo('.addedElements')
            
                $('<input>',{
                    class: "checkSelect"
                }).attr("type", "checkbox")
                .appendTo(memo)*/

                buildMemoP(data[el].content, data[el].id)

            }
        }
    })
}

function createMemo(text) {
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

function deleteMemo(idsArr) {
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
}



// FIRST FUNCTION SAVES MEMO NOTE VALUE ON CLICK WHILE SECOND FUNCTION CHECKS IF THE VALUE IS CHANGED WHEN THE NOTE LOSES FOCUS
// IF THE VALUE IS THE SAME NOTHING HAPPENS, IF IT'S DIFFERENT THE DATABASE GETS UPDATED WITH THE NEW MEMO VALUE

function saveMemoValue(value) {
    localStorage.setItem("memoValue", value)
}


function checkMemoValueVariations(currentValue) {
    if(localStorage.getItem("memoValue") === currentValue) {
        return false
    } else {
        return true
    }
}


let timer = null

//LONG TAP LOGIC

function tapStart(el) {

    /*if(el.attr("contenteditable") === "true") {
        console.log("SIUM")
        return
    }*/

    detectDoubleClick(el)

    
    localStorage.setItem("longPress", false)

    if(el.attr("data-selected") != "true" && localStorage.getItem("itemsSelected") === "false") {
        el.attr("data-selected", true)
    }

    timer = setTimeout(() => {
        timer = null
        console.log("half second passed")

        
        $("#navProfile").hide()
        $("#navOptions").css("display", "flex")
        $(".memoNote input:checkbox").show()
        el.children("input").attr("checked", true)

        localStorage.setItem("longPress", true)

    }, 500)
}

function clearTimer() {
    clearTimeout(timer)
}

function tapEnd(el) {

    console.log("GIGI PISS")
    clearTimer()
    console.log(localStorage.getItem("longPress"))
    const isLongPressed = localStorage.getItem("longPress")
    const itemsSelected = localStorage.getItem("itemsSelected")

    console.log("itemsSelected : " + localStorage.getItem("itemsSelected"))
    console.log("longPress : " + isLongPressed)


    //DO NOTHING ON LONGPRESS WHILE THERE ARE NOTES SELECTED
    if(isLongPressed === "true" && itemsSelected === "true") {
        return
    }


    //IF LONG PRESS TRIGGERED
    if(isLongPressed === "true") {
        localStorage.setItem("itemsSelected", true)
        return
    }


    //TRIGGERED IF THERE'S ALREADY AT LEAST ONE MEMO NOTE SELECTED ON CLICK
    if(itemsSelected === "true") {
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
            localStorage.setItem("itemsSelected", false)
            resetSelection()
        }
    }

    el.attr("data-selected", false)
}

function resetSelection() {
    $("#navOptions").hide()
    $("#navProfile").css("display", "flex")
    $(".memoNote").attr("data-selected", false)
    $(".memoNote input").hide().removeAttr("checked")
    localStorage.setItem("itemsSelected", false)



    //$(".memoNote").attr("userSelected") === "true" ? $(this).css("background", "var(--on-focus-memo)") : $(this).css("background", "var(--secondary-bg)")
    //el.css("background", "var(--secondary-bg)")
}

function getSessionVariables() {
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

function logOut() {
    $.ajax({
        type : "GET",
        url : "userOperations.php?action=logout",
        success: function() {
            location.reload()
        }
    })
}

function getProfileInfos() {
    let cookieStr = document.cookie
    let email = cookieStr.substring(
        cookieStr.indexOf("=") + 1, 
        cookieStr.indexOf(";")
    )
    let username = document.cookie.substring(
        cookieStr.lastIndexOf("=") + 1,
        cookieStr.length
    )
    $("#profileInfos p:first").text(username)
    $("#profileInfos p:last").text(email.replace("%40", "@"))
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
    e.preventDefault()
    stopRegistration()
    document.removeEventListener("touchend", recTapEnd, true)
}





// TOGGLE RECORDING FUNCTIONS

function startRegistration() {
    timer = setTimeout(() => {
      timer = null
      $("#btnMic").css("transform", "scale(1.25)")
      localStorage.setItem("speech", "")
      toggleRecording()
    }, 750)
  }
  
  function stopRegistration() {
    clearTimer()
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
let recording = false;
let results = null;

recognition.continuous = true;
recognition.lang = "it-IT"

function toggleRecording() {
  if(recording) {
    recognition.onend = null
    recognition.stop()
    recording = false
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
        localStorage.setItem("dblClickTime", 0)
        console.log("Time passed")
        clearTimeout(timeout)
    },750)

    let dblClickTime = Number(localStorage.getItem("dblClickTime"))
    if(dblClickTime === 0) {
        localStorage.setItem("dblClickTime", new Date().getTime())
        localStorage.setItem("memoClicked", el[0].id)
        return
    }

    if((new Date().getTime() - dblClickTime) < 750 && localStorage.getItem("memoClicked") === el[0].id) {
        localStorage.setItem("dblClickTime", 0)
        console.log("double click")
        console.log(localStorage.getItem("memoClicked"))
        console.log(el[0].id)
        el[0].contentEditable = "true"
        el[0].focus()
    }
}