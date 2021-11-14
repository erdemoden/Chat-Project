
let create = document.getElementsByClassName("create");
    let createroom = document.getElementsByClassName("create-room");
    let chatword = document.getElementById("chatword");
    let usersname = document.getElementById("users");
    let signoutbut = document.getElementsByClassName("sign-out")[0];
    $(".hamburger").click(function(){
        $(".hbuttons").stop().slideToggle();
    });
//    Array.from(create).forEach(function(element){
//     element.addEventListener("click",()=>{
//         createroom.style.display = "block";
//     });
//    });
for(i = 0;i<create.length;i++){
    if(i==0){
        create[i].addEventListener("click",()=>{
            createroom[0].style.display = "block";
            createroom[1].style.display = "none";
        });
    }
    if(i==1){
        create[i].addEventListener("click",()=>{
            createroom[1].style.display = "block";
            createroom[0].style.display = "none";
        });
    }
}
   chatword.onwheel = function(event){
    this.scrollLeft -= (event.deltaY);
    event.preventDefault();
   }
   usersname.onwheel = function(event){
       this.scrollLeft -= (event.deltaY);
       event.preventDefault();
   }
   signoutbut.addEventListener("click",async()=>{
   const response = await fetch("/sign-out");
   location.reload();
   });
   