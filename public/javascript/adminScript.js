$(".custom-file-input").on("change", function(){
    let fileSize = document.getElementById("inputGroupFile").files[0].size,
             val = $(this).val().toLowerCase(),
           regex = new RegExp("(.*?)\.(jpeg|jpg|png|gif|gif|tif|tiff)$");
    if (fileSize > 750000 || fileSize < 200000 || (!(regex.test(val)))) {
        alert("Expected file size: 200 KB to 750 KB | Expected file formats: jpeg, jpg, png, gif, tif, tiff");
        document.getElementById("inputGroupFile").value = "";
        $(this).next(".custom-file-label").html("Upload image");
    } else{
        let fileName = $(this).val().replace(/C:\\fakepath\\/i, "").slice(0,22);
        $(this).next(".custom-file-label").html(fileName);
    }
});

$(".passwordChange").click(function(){
    $(this).hide();
    $(this).next(".toToggle").slideToggle("fast");
});

$(".cancelChange").click(function(){
    $(".form-control").val("");
    $(this).parent(".toToggle").slideToggle("fast");
    $(this).parent().siblings(".passwordChange").show()
});

$(".hide-posts").on("click", function(){
    let parameters;
    if($(this).hasClass("false")){
        parameters = { id: $(this).val(), change: true };
        $(this).toggleClass("true").toggleClass("false");
        $(this).toggleClass("btn-success").toggleClass("btn-outline-success");
    }else{
        parameters = { id: $(this).val(), change: false };
        $(this).toggleClass("true").toggleClass("false");
        $(this).toggleClass("btn-success").toggleClass("btn-outline-success");
    }
    $.getJSON( "/hide-posts", parameters, data =>{})
});