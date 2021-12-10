
let create = document.getElementsByClassName("create");
    let createroom = document.getElementsByClassName("create-room");
    let chatword = document.getElementById("chatword");
    let usersname = document.getElementsByClassName("users");
    let signoutbut = document.getElementsByClassName("sign-out")[0];
    let signoutbut2 = document.getElementsByClassName("sign-out")[1];
    let memberamount = document.getElementById("memberamount");
    let chatname = document.getElementById("chatname");
    let yourrooms = document.getElementsByClassName("yourrooms");
    let allrooms = document.getElementsByClassName("allrooms");
    const socket = io();
    $(".hamburger").click(function(){
        $(".hbuttons").stop().slideToggle();
    });


create[0].addEventListener("click",()=>{
    if(document.getElementsByClassName("create-room1").length>0){
        document.querySelectorAll('.create-room1').forEach(e => e.remove());
}
createroom[0].style.display = "block";
});
create[3].addEventListener("click",()=>{
    if(document.getElementsByClassName("create-room1").length>0){
        document.querySelectorAll('.create-room1').forEach(e => e.remove());
}
createroom[0].style.display = "block";
});
 //////////////////////////////////////////////////////////////////  
 
 
 //  SIGN-OUT
   signoutbut.addEventListener("click",async()=>{
   const response = await fetch("/sign-out");
   location.replace("/");
   });

   signoutbut2.addEventListener("click",async()=>{
    const response = await fetch("/sign-out");
    location.replace("/");
    });

////////////////////////////////////////////////////////////////////////

// YOUR ROOMS
for(var i = 0;i<yourrooms.length;i++){
    if(i==0||i==1){
        yourrooms[i].addEventListener("click",async()=>{
            if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
        }
            const response = await fetch("/your-rooms");
            const jsonobj = await response.json();
            console.log(jsonobj.length);
            for(var i = 0;i<jsonobj.length;i++){
            let all = document.createElement('nav');
            let chat = document.createElement('p');
            let membercount = document.createElement('p');
            let join = document.createElement('button');
            let deleteroom = document.createElement('button');
            all.className = "navbar navbar-dark bg-dark create-room1";
            chat.id = "chatname";
            membercount.id = "memberamount";
            join.className = "btn btn-success";
            deleteroom.className = "btn btn-danger";
            join.setAttribute("style","font-weight:bolder;margin-top:85px;float:left;margin-left:30px;");
            deleteroom.setAttribute("style","font-weight:bolder;margin-top:85px;float:right;margin-right:30px;");
            chat.innerHTML = "Room Name: "+jsonobj[i].chatname;
            membercount.innerHTML = "Available Space: "+jsonobj[i].memberamount;
            join.id = jsonobj[i].id;
            deleteroom.id = jsonobj[i].id;
            join.innerHTML = "JOIN THIS ROOM!";
            deleteroom.innerHTML = "DELETE THIS ROOM!";
            all.appendChild(chat);
            all.appendChild(membercount);
            all.appendChild(join);
            all.appendChild(deleteroom);
            document.body.appendChild(all);
            chat.onwheel = function(event){
                this.scrollLeft -= (event.deltaY);
                event.preventDefault();
            }
            membercount.onwheel = function(event){
                this.scrollLeft -= (event.deltaY);
                event.preventDefault();
            }
            document.getElementsByClassName("create-room1")[i].style.display = "block";
            }
        })
        
}
}
//////////////////////////////////////////////////////////////////////////////////////////////
// ALL ROOMS
for(var i = 0;i<allrooms.length;i++){
    if(i==0||i==1){
        allrooms[i].addEventListener("click",async()=>{
            if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
            }
            const response = await fetch("/all-rooms");
            const jsonobj = await response.json();
            console.log(jsonobj.length);
            for(var i = 0;i<jsonobj.length;i++){
            let all = document.createElement('nav');
            let chat = document.createElement('p');
            let membercount = document.createElement('p');
            let join = document.createElement('button');
            all.className = "navbar navbar-dark bg-dark create-room1";
            chat.id = "chatname";
            membercount.id = "memberamount";
            join.className = "btn btn-success";
            join.setAttribute("style","font-weight: bolder; margin-top: 85px; float: left; margin-left: 30px; margin-left: 50%; transform: translate(-50%, -50%);height: 100px; width: 300px;");
            chat.innerHTML = "Room Name: "+jsonobj[i].chatname;
            membercount.innerHTML = "Available Space: "+jsonobj[i].memberamount;
            join.id = jsonobj[i].id;
            join.innerHTML = "JOIN THIS ROOM!";
            all.appendChild(chat);
            all.appendChild(membercount);
            all.appendChild(join);
            document.body.appendChild(all);
            chat.onwheel = function(event){
                this.scrollLeft -= (event.deltaY);
                event.preventDefault();
            }
            membercount.onwheel = function(event){
                this.scrollLeft -= (event.deltaY);
                event.preventDefault();
            }
            document.getElementsByClassName("create-room1")[i].style.display = "block";
            }
        });
    }
}
/////////////////////////////////////////////////////////////

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


// CHAT PART



