let create = document.getElementsByClassName("create");
    let createroom = document.getElementById("create-room");
    let chatword = document.getElementById("chatword");
    $(".hamburger").click(function(){
        $(".hbuttons").stop().slideToggle();
    });
   Array.from(create).forEach(function(element){
    element.addEventListener("click",()=>{
        createroom.style.display = "block";
    });
   });
   chatword.onwheel = function(event){
    this.scrollLeft -= (event.deltaY);
    event.preventDefault();
   }

   