// ALL VARIABLES
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
    let chatscreen = document.getElementById("chat");
    let chattitle = document.getElementById("titlebar");
    let joinroom = document.getElementsByClassName("join");
    const socket = io();
///////////////////////////////////////////////////////////////////////////////////

// CHAT PART -SOCKET.IO
    socket.on('makechat',(id,roomname,username,rooms)=>{
        if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
            }
        if(document.getElementsByClassName("create-room").length>0){
                document.querySelectorAll('.create-room').forEach(e => e.style.display = "none");
        }
        if(!chatscreen && !chattitle){
        chatscreen.style.display = "flex";
        chattitle.style.display = "flex";
    }
    if(document.getElementById("chatword").innerHTML!=roomname){
        document.getElementById("chatword").innerHTML = roomname;
    }
    for(var i = 0;i<rooms[id].length;i++){
        let isimler = document.createElement("div");
        isimler.className = "alert alert-primary users";
        isimler.innerHTML = username;
        document.getElementById("isimler").appendChild(isimler);
    }
        // div class="alert alert-primary users" role="alert">
        //         This is a primary alert—check it out! asdasdasdasdasdsdDSADSDASDASDASDASDASDASDASDsdafsdfkalkdfjwljwljqwldqlkdasd329428304820348
        //       </div>
        console.log(username);
        });
///////////////////////////////////////////////////////////////

// HAMBURGER MENU
    $(".hamburger").click(function(){
        $(".hbuttons").stop().slideToggle();
    });
///////////////////////////////////////////////////

// CREATE YOUR ROOM BUTTON
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

 //  SIGN-OUT BUTTON
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
        if(document.getElementsByClassName("create-room").length>0){
            document.querySelectorAll('.create-room').forEach(e => e.style.display="none");
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
            join.className = "btn btn-success join";
            deleteroom.className = "btn btn-danger deleteroom";
            join.setAttribute("style","font-weight:bolder;margin-top:85px;float:left;margin-left:30px;");
            deleteroom.setAttribute("style","font-weight:bolder;margin-top:85px;float:right;margin-right:30px;");
            chat.innerHTML = "Room Name: "+jsonobj[i].chatname;
            let justname = jsonobj[i].chatname;
            membercount.innerHTML = "Available Space: "+jsonobj[i].memberamount;
            join.id = jsonobj[i].id;
            deleteroom.id = jsonobj[i].id;
            join.innerHTML = "JOIN THIS ROOM!";
            deleteroom.innerHTML = "DELETE THIS ROOM!";

            // JOIN BUTTON CLICKED
                join.addEventListener("click",async()=>{
                   let postdata = await fetch("/check-room",{
                       method:'POST',
                       headers:{
                            'Accept': 'application/json',
                           'Content-Type':'application/json'
                       },
                       body:JSON.stringify({"id":join.id})
                   });
                   let jsonres = await postdata.json();
                   if(jsonres.success == "true"){
                       socket.emit("joinroom",join.id,justname,jsonres.name);
                   }
                   else{
                    swal({
                        title: "ROOM IS NOT AVAILABLE!",
                        text: "This Room's Capacity Is Full! ",
                        icon: "error",
                        button: "Close This Alert",
                      });
                   }
                });
            /////////////////////////////////////////////
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
            if(document.getElementsByClassName("create-room").length>0){
                document.querySelectorAll('.create-room').forEach(e => e.style.display = "none");
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
            join.className = "btn btn-success join";
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



