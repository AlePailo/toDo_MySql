$(document).ready(function() {

    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
    })

    $(".addedElements").on("click", "p", function(){
        $(this).attr("contentEditable", "true")
        $(this).focus()
        saveMemoValue($(this).text())
    })

    $(".addedElements").on("blur", "p", function(){
        $(this).attr("contentEditable", "false")
        checkMemoValueVariations($(this).text())
    })

    $(".addedElements").on("touchstart", ".memoNote", function() {
        tapStart($(this))
    })

    $(".addedElements").on("touchend", ".memoNote", function() {
        tapEnd($(this))
    })

    $("#backBtn").click(function() {
        resetSelection()
    })

    
    //localStorage.setItem("timer", null)

})


//MEMO ELEMENT CREATION BASED ON USER INPUT

function createMemo(text) {
    $('<p/>',{
        text: text,
        class: "memoNote"
    }).attr("spellcheck", "false")
    .attr("data-selected", "false")
    .appendTo('.addedElements')
    $("#userInput").val("")
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
    el.attr("data-selected", "true")
    localStorage.setItem("longPress", false)
    timer = setTimeout(() => {
        timer = null
        $("#backBtn").css("display", "inline-block")
        $("#deleteBtn").css("display", "inline-block")
        //el.attr("data-selected", "true")
        console.log("half second passed")
        localStorage.setItem("longPress", true)
    }, 500)
}

function clearTimer() {
    clearTimeout(timer)
}

function tapEnd(el) {
    clearTimer()
    console.log(localStorage.getItem("longPress"))
    const isLongPressed = localStorage.getItem("longPress")
    if(isLongPressed == "true") {
        el.attr("data-selected", "true")
    } else {
        el.attr("data-selected", "false")
    }
    //localStorage.getItem("longPress") === true ? el.attr("data-selected", "true") : el.attr("data-slected", "false")
    //el.attr("userSelected") === "true" ? el.css("background", "var(--on-focus-memo)") : el.css("background", "var(--secondary-bg)")
}

function resetSelection() {
    $("#deleteBtn").css("display", "none")
    $("#backBtn").css("display", "none")
    $(".memoNote").attr("data-selected", "false")
    //$(".memoNote").attr("userSelected") === "true" ? $(this).css("background", "var(--on-focus-memo)") : $(this).css("background", "var(--secondary-bg)")
    //el.css("background", "var(--secondary-bg)")
}