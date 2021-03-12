$(".arrow-btn").mouseover(function() {
  $(this).find("i").removeClass("fa-arrow-right").addClass("fa-arrow-down");
});

$(".arrow-btn").mouseleave(function() {
  $(this).find("i").removeClass("fa-arrow-down").addClass("fa-arrow-right");
});

// ParticlesJS Config
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 700 } },
  
  
      "color": {
        "value": "#ffffff" },
  
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000" },
  
        "polygon": {
          "nb_sides": 5 } },
  
  
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 0.1,
          "opacity_min": 0.1,
          "sync": false } },
  
  
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 10,
          "size_min": 0.1,
          "sync": false } },
  
  
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1 },
  
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200 } } },
  
  
  
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab" },
  
        "onclick": {
          "enable": true,
          "mode": "push" },
  
        "resize": true },
  
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1 } },
  
  
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3 },
  
        "repulse": {
          "distance": 200,
          "duration": 0.4 },
  
        "push": {
          "particles_nb": 4 },
  
        "remove": {
          "particles_nb": 2 } } },

    "retina_detect": true });

// navbar

function navItemColor(){
  $(".home-nav-item").each(function(){
    $(this).removeClass("text-info").addClass("text-white");
  })
}

$(window).scroll(function(){  
  if ($(this).scrollTop() > window.innerHeight) {
    $("#home-nav").addClass("fixed-top");
    // add padding top to show content behind navbar
    $("body").css("padding-top", $(".navbar").outerHeight() + "px");
  }else{
    $("#home-nav").removeClass("fixed-top");
    // remove padding top from body
    $("body").css("padding-top", "0");
  }
  //  changing nav-item colors
  if ($(this).scrollTop() <= window.innerHeight * .5) {
    navItemColor();
    $("#home-item").addClass("text-info");
  } else if ($(this).scrollTop() > $("#home-about").offset().top * .5 && $(this).scrollTop() <= $("#home-portfolio").offset().top * .9) {
    navItemColor();
    $("#about-item").addClass("text-info");
  } else if ($(this).scrollTop() > $("#home-portfolio").offset().top * .9 && $(this).scrollTop() <= $("#home-contact").offset().top * .9 ) {
    navItemColor()
    $("#portfolio-item").addClass("text-info");
  } else if ($(this).scrollTop() > $("#home-contact").offset().top * .9) {
    navItemColor()
    $("#contact-item").addClass("text-info");
  } 
});


//Portfolio
$("#myModal").on("shown.bs.modal", ()=> {
  $("#myInput").trigger("focus")
})

$(document).ready(function(){
  $("#modalCenter").on("show.bs.modal", function(event){
      // Get the button that triggered the modal
      let button = $(event.relatedTarget);
      let titleData = button.data("title");
      let descData = button.data("desc");
      let bodyData = button.data("body");
      let imageData = button.data("image");
      let urlData = button.data("url");
      let githubData = button.data("github");
      $(this).find(".modal-title").text(titleData);
      $(this).find(".modal-img").attr("src", imageData).attr("alt", titleData);
      $(this).find(".modal-body").text(bodyData);
      $(this).find(".modal-desc").text(descData);
      $(this).find(".modal-url").attr("href", urlData);
      $(this).find(".modal-github").attr("href", githubData);
  });
});

//Contact Form

(function ($) {
  "use strict";

  let input = $(".validate-input .input100");
  $(".validate-form").on("submit", function(){
    let check = true;
    for(let i=0; i<input.length; i++) {
      if(validate(input[i]) === false){
        showValidate(input[i]);
        check=false;
      }
    }
    return check;
  });

  $(".validate-form .input100").each(function(){
      $(this).focus(function(){
         hideValidate(this);
      });
  });

  function validate (input) {
    if($(input).attr("type") === "email" || $(input).attr("name") === "email") {
      if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) === null) {
        return false;
      }
    }
    else {
      if($(input).val().trim() === ""){
        return false;
      }
    }
  }

  function showValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(input) {
    let thisAlert = $(input).parent();
    $(thisAlert).removeClass("alert-validate");
  }

})(jQuery);

$(".contact100-form").on("submit", e =>{
  e.preventDefault();
  let name = $("#form-name").val().trim();
  let email = $("#form-email").val().trim();
  let phone = $("#form-phone").val().trim();
  let message = $("#form-message").val().trim();
  let data = {name, email, phone, message};
  $("#form-name").val("");
  $("#form-email").val("");
  $("#form-phone").val("");
  $("#form-message").val("");
  $.post("/contact", data, function(){})
})