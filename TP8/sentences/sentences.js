$(function(){

    $.get('http://localhost:7709/paras', function(data){
        data.forEach(p => {
            $("#list").append("<li><b>" + p.data + "</b> | " + p.para + '    <button class="deleteP w3-button w3-round-large w3-tiny w3-red deleteP" id="' + p._id + '">X</button></div></li>')
            $("#list").append('<br>')
        })
    })


    $("#list").on("click", ".deleteP",function(e){

        aux = event.target.id
        $.ajax({
            url : 'http://localhost:7709/paras/' + aux,
            type : 'DELETE',
            dataType : 'json',
            success: function(result) {
                console.log("hahaha")
            }
        })

    })

    $("#button").click(function(){
        $.post("http://localhost:7709/paras", $("form").serialize(), result => {
            $("#sentence").val("");
            alert('Record inserted: ' + JSON.stringify(result))
            location.reload();
        })
        
    })

})