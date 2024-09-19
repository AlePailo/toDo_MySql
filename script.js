$(document).ready(function() {
    $("#btnSend").click(function() {
        createMemo($("#userInput").val())
        console.log($(".addedElements p"))
    })
    $(".addedElements").on("click", "p", function(){
        $(this).attr("contentEditable", "true")
        $(this).focus()
    })
    $(".addedElements").on("blur", "p", function(){
        $(this).attr("contentEditable", "false")
    })
})

function createMemo(text) {
    $('<p/>',{
        text: text
    }).attr("spellcheck", "false")
    .appendTo('.addedElements')
    $("#userInput").val("")
}