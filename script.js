$(document).ready(function() {

    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
    })

    $(".addedElements").on("click", "p", function(){
        saveMemoValue($(this).text())
    })

    $(".addedElements").on("blur", "p", function(){
        $(this).attr("contentEditable", false)
        checkMemoValueVariations($(this).text())
    })

    $(".addedElements").on("touchstart", ".memoNote", function() {
        tapStart($(this))
    })

    $(".addedElements").on("touchend", ".memoNote", function() {
        tapEnd($(this))

        //GETS RID OF FIRST CLICK CHECKBOX BUG (REMOVE THIS AND TRY TO UNCHECK A CHECKBOX TO SEE)
        event.preventDefault()
    })

    $("#backBtn").click(function() {
        resetSelection()
    })

    $("#profileBtn").click(function() {
        $("#profileBtn div").toggle()
    })

    $("input").focus(function() {
        $("#formNotification").hide()
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
            url : "functions.php",
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
                    url : "functions.php",
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

    $("#btnLogin").submit(function() {
        const email = $("#loginEmail").val()
        const psw = $("#loginPsw").val()

        $.ajax({
            type : "POST",
            url : "function.php",
            data : {
                loginAttemptEmail : email,
                loginAttemptPsw : psw
            },
            success: function(data) {
                data = JSON.parse(data)
                if(data == "Credenziali errate") {
                    $("#formNotification").show().text(data).css("background", "#BB0A21")
                    return false
                }
            }
        })
    })
    
    $("#btnRegistration").click(function() {
        const username = $("#registrationUsername").val()
        const email = $("#registrationEmail").val()
        const psw = $("#registrationPsw").val()

        $.ajax({
            type : "POST",
            url : "functions.php",
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

function createMemo(text) {
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
}




// FIRST FUNCTION SAVES MEMO NOTE VALUE ON CLICK WHILE SECOND FUNCTION CHECKS IF THE VALUE IS CHANGED WHEN THE NOTE LOSES FOCUS
// IF THE VALUE IS THE SAME NOTHING HAPPENS, IF IT'S DIFFERENT THE DATABASE GETS UPDATED WITH THE NEW MEMO VALUE

function saveMemoValue(value) {
    localStorage.setItem("memoValue", value)
}


function checkMemoValueVariations(currentValue) {
    if(localStorage.getItem("memoValue") === currentValue) {
        console.log("No variations")
    } else {
        console.log("Value changed")
    }
}


let timer = null

//LONG TAP LOGIC

function tapStart(el) {

    if(!el.attr("data-selected") == "true") {
        el.attr("data-selected", true)
    }
    console.log(localStorage.getItem("itemsSelected"))
    if(localStorage.getItem("itemsSelected") != true) {
        localStorage.setItem("longPress", false)
    } else {
        el.find("input").toggle()
        if(el.attr("checked") == true) {
            el.attr("checked") = false
        } else {
            el.attr("checked") = true
        }
    }

    timer = setTimeout(() => {
        timer = null
        $("#backBtn").css("display", "inline-block")
        $("#deleteBtn").css("display", "inline-block")
        console.log("half second passed")
        localStorage.setItem("longPress", true)
        localStorage.setItem("itemsSelected", true)
        $(".memoNote input:checkbox").show()
        el.children("input").attr("checked", true)
    }, 500)
}

function clearTimer() {
    clearTimeout(timer)
}

function tapEnd(el) {
    clearTimer()
    console.log(localStorage.getItem("longPress"))
    const isLongPressed = localStorage.getItem("longPress")
    const itemsSelected = localStorage.getItem("itemsSelected")
    
    /*if(isLongPressed == true || localStorage.getItem("itemsSelected") == true) {
        el.attr("data-selected", true)
    } else {
        el.attr("data-selected", false)
        $(this).attr("contentEditable", true)
        $(this).focus()
    }*/
    console.log("itemsSelected : " + localStorage.getItem("itemsSelected"))
    if(itemsSelected == "true") {
        if(el.attr("data-selected") == "true") {
            el.attr("data-selected", false)
            el.find("input").removeAttr("checked")
            let checks = 0
            $(".memoNote input:checkbox").each(function(index, value) {
                if($(this).attr("checked")) {
                    checks++
                    console.log("check n" + index)
                }
            })
            if(checks == 0) {
                resetSelection()
            }
        } else {
            el.attr("data-selected", true)
            el.find("input").attr("checked", "checked")
        }
    } else if(isLongPressed == "true") {
        el.attr("data-selected", true)
    } else {
        el.attr("data-selected", false)
        el.attr("contentEditable", true)
        $(this).focus()
    }



    //localStorage.getItem("longPress") === true ? el.attr("data-selected", "true") : el.attr("data-slected", "false")
    //el.attr("userSelected") === "true" ? el.css("background", "var(--on-focus-memo)") : el.css("background", "var(--secondary-bg)")
}

function resetSelection() {
    $("#deleteBtn").css("display", "none")
    $("#backBtn").css("display", "none")
    $(".memoNote").attr("data-selected", false)
    $(".memoNote input").hide().removeAttr("checked")
    localStorage.setItem("itemsSelected", false)



    //$(".memoNote").attr("userSelected") === "true" ? $(this).css("background", "var(--on-focus-memo)") : $(this).css("background", "var(--secondary-bg)")
    //el.css("background", "var(--secondary-bg)")
}