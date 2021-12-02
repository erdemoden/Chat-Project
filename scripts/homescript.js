const { json } = require("body-parser");

let create = document.getElementsByClassName("create");
    let createroom = document.getElementsByClassName("create-room");
    let chatword = document.getElementById("chatword");
    let usersname = document.getElementsByClassName("users");
    let signoutbut = document.getElementsByClassName("sign-out")[0];
    let signoutbut2 = document.getElementsByClassName("sign-out")[1];
    let memberamount = document.getElementById("memberamount");
    let chatname = document.getElementById("chatname");
    let createroombut = document.getElementsByClassName("createroom")[0];
    //let create = document.getElementById("create");
    $(".hamburger").click(function(){
        $(".hbuttons").stop().slideToggle();
    });
for(i = 0;i<create.length;i++){
    if(i==0){
        create[i].addEventListener("click",()=>{
            createroom[0].style.display = "block";
            createroom[1].style.display = "none";
            createroom[2].style.display = "none";
        });
    }
    if(i==1){
        create[i].addEventListener("click",()=>{
            createroom[1].style.display = "block";
            createroom[0].style.display = "none";
            createroom[2].style.display = "none";
        });
    }
    if(i==2){
        create[i].addEventListener("click",()=>{
            createroom[2].style.display = "block";
            createroom[0].style.display = "none";
            createroom[1].style.display = "none";
        });
    }
}

// ON WHELL FUNCTIONS
   chatword.onwheel = function(event){
    this.scrollLeft -= (event.deltaY);
    event.preventDefault();
   }
   for(var i = 0;i<usersname.length;i++){
   usersname[i].onwheel = function(event){
       this.scrollLeft -= (event.deltaY);
       event.preventDefault();
   }
}
   chatname.onwheel = function(event){
    this.scrollLeft -= (event.deltaY);
    event.preventDefault();
}
memberamount.onwheel = function(event){
    this.scrollLeft -= (event.deltaY);
    event.preventDefault();
}
 //////////////////////////////////////////////////////////////////  
 
 
 // CLICK EVENTS
 
   signoutbut.addEventListener("click",async()=>{
   const response = await fetch("/sign-out");
   location.replace("/");
   });

   signoutbut2.addEventListener("click",async()=>{
    const response = await fetch("/sign-out");
    location.reload();
    });

    create.addEventListener("click",()=>{
        
    });

    createroombut.addEventListener("click",async()=>{
        await fetch("/create-room",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                chatname:document.getElementsByClassName("create-chat-name")[0].innerHTML,
                memberamount:document.getElementsByClassName("amount")[0].innerHTML,
                chatowner: document.getElementsByClassName("owner")[0].innerHTML.slice(8)
            })
        })
    });
   