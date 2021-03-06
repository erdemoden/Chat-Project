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
    let homebutton = document.getElementsByClassName("home");
    let chatscreen = document.getElementById("chat");
    let chattitle = document.getElementById("titlebar");
    let joinroom = document.getElementsByClassName("join");
    let senbutton = document.getElementById("lisendbut");
    let writingarea = document.getElementById("limessagearea");
    const socket = io();
///////////////////////////////////////////////////////////////////////////////////

// CHAT PART -SOCKET.IO

// CREATE CHAT SCREEN FOR ALL USERS
    socket.on('makechat',async(id,roomname,username,rooms,chatowner)=>{
        let getname = await fetch("/getname");
        let username1 = await getname.json(); 
        let users = document.getElementsByClassName("users");
        if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
            }
        if(document.getElementsByClassName("create-room").length>0){
                document.querySelectorAll('.create-room').forEach(e => e.style.display = "none");
        }
        chatscreen.style.display = "flex";
        chattitle.style.display = "flex";
    if(document.getElementById("chatword").innerHTML!=roomname){
        document.getElementById("chatword").innerHTML = roomname;
    }
        if(users.length>0)
        {
            console.log("users 0 dan büyük");
            if(username1.name==chatowner){
                if(users[users.length-1].innerHTML!=rooms[id][rooms[id].length-1]){
                    let isimler = document.createElement("div");
                    isimler.className = "alert alert-primary users";
                    isimler.innerHTML = rooms[id][rooms[id].length-1];
                    document.getElementById("isimler").appendChild(isimler);
                    if(rooms[id][rooms[id].length-1]!=chatowner){
                    let ban = document.createElement("button");
                    ban.className = "btn btn-danger bans";
                    ban.id = rooms[id][rooms[id].length-1];
                    ban.innerHTML = "BAN THIS USER!";
                    ban.addEventListener("click",()=>{
                        socket.emit("banprocess",ban.id);
                        console.log("ban a basıldı");
                    });
                    document.getElementById("isimler").appendChild(ban);
                    }
                }
                console.log(chatowner+" "+rooms[id][rooms[id].length-1]);
            }
            else{
                   if(users[users.length-1].innerHTML!=rooms[id][rooms[id].length-1]){
                       console.log("kullanıcı oda sahibi değil"+" "+users[users.length-1].innerHTML+" "+rooms[id][rooms[id].length-1]);
                        let isimler = document.createElement("div");
                        isimler.className = "alert alert-primary users";
                        isimler.innerHTML = rooms[id][rooms[id].length-1];
                        document.getElementById("isimler").appendChild(isimler);
                    }
                
            }
        }
        else{
        for(var i=0;i<rooms[id].length;i++){
        let isimler = document.createElement("div");
        isimler.className = "alert alert-primary users";
        isimler.innerHTML = rooms[id][i];
        document.getElementById("isimler").appendChild(isimler);
        if(username1.name==chatowner){
        if(rooms[id][i]!=chatowner){
            let ban = document.createElement("button");
            ban.className = "btn btn-danger bans";
            ban.id = rooms[id][i];
            ban.innerHTML = "BAN THIS USER!";
            ban.addEventListener("click",()=>{
                socket.emit("banprocess",ban.id);
                console.log("ban a basıldı");
            });
            document.getElementById("isimler").appendChild(ban);
            }
        }
        }
        console.log("users 0 dan küçük"+rooms[id].length);
    }
        });
///////////////////////////////////////////////////////////////

// SEND MESSAGE FOR ALL USERS
socket.on("gotmessage",async(message,sendername)=>{
    let getname = await fetch("getname");
    let userpresent = await getname.json();
    let chatscene = document.getElementById("chatitself");
    let chatmessage = document.createElement("div");
    let username = document.createElement("p");
    let messageitself = document.createElement("p");
    if(userpresent.name == sendername){
        chatmessage.className = "alert alert-success right-tail";
    }else{
        chatmessage.className = "alert alert-primary left-tail";
    }
    chatmessage.setAttribute("style","width:50%; height:auto; margin:0 auto; margin-top:20px;");
    username.setAttribute("style","width: inherit; white-space: pre-wrap; word-wrap: break-word; margin-left: 0px; border:1px solid;");
    messageitself.setAttribute("style","width: inherit; white-space: pre-wrap; word-wrap: break-word; margin-left: 0px;");
    username.innerHTML = "Name: "+sendername;
    messageitself.innerHTML = "Message: "+message;
    chatmessage.appendChild(username);
    chatmessage.appendChild(messageitself);
    chatscene.appendChild(chatmessage);
});
//////////////////////////////////////////////////////////////
// USER LEAVE
// socket.on("deleteuser",async()=>{
//     let getname = await fetch("/getname");
//     let username = await getname.json();
//     socket.emit("leave",username.name);
// });
// //////////////////////////////////////////////////////////////

// ERASE LEAVING USER FROM OTHER USERS 
socket.on("eraseuser",async(name,chatid,checkname)=>{
    let getname = await fetch("/getname");
    let userpresent = await getname.json();
    let users = document.getElementsByClassName("users");
    let bans = document.getElementsByClassName("bans");
    for(var i = 0;i<users.length;i++){
        if(users[i].innerHTML == name){
            users[i].remove();
        }
    }
    if(bans.length>0){
        for(var i = 0;i<bans.length;i++){
            if(bans[i].id == name){
                bans[i].remove();
            }
        }
    }
});

//ERASE BANNED USER FROM OTHER USERS AND BAN THE USER
socket.on("banit",async(username,chatid)=>{
    let getname = await fetch("/getname");
    let username1 = await getname.json();
    if(username1.name == username){
        console.log("banit fonksiyonu"+username1.name+" "+username); 
        let postdata = await fetch("/banuser",{
            method:'POST',
            headers:{
            'Accept': 'application/json',
            'Content-Type':'application/json'
                       },
        body:JSON.stringify({"id":chatid})
        });
        let banned = await postdata.json();
        if(banned.success == "true"){
        swal({
            title: "YOU ARE BANNED FROM THE CHAT!",
            text: "Until Chat Owner Remove Your Ban You Are Banned! ",
            icon: "error",
            button: "Close This Alert",
          });
          location.reload();
    }
}
    else{
        console.log("çalışmadı");
    }
});
//////////////////////////////////////////////////////////////
// // DECREASE ROOM TO 0
// socket.on("formatroom",async(name)=>{
//     let getname = await fetch("/getname");
//     let userpresent = await getname.json();
// if(name == userpresent.name){
//     let postdata = await fetch("/decreaseroom",{
//         method:'POST',
//         headers:{
//              'Accept': 'application/json',
//             'Content-Type':'application/json'
//         },
//         body:JSON.stringify({"id":chatid})
//     });
// }
// });


//////////////////////////////////////////////////////////////
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
            if(chatscreen.style.display == "flex"&&chattitle.style.display == "flex"){
                socket.emit("leavechat");
               location.reload();
            }
            if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
        }
        if(document.getElementsByClassName("create-room").length>0){
            document.querySelectorAll('.create-room').forEach(e => e.style.display="none");
        }
            const response = await fetch("/your-rooms");
            const contentType = response.headers.get("content-type");
            if(contentType.indexOf("application/json") == -1){
                location.reload();
            }
            const jsonobj = await response.json();
            console.log(jsonobj.length);
            if(jsonobj.length<=0){
                swal({
                    title: "YOU DON'T HAVE ANY ROOM",
                    text: "You Can Create A Room",
                    icon: "error",
                    button: "Close This Alert",
                  });
            }
        else{
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
            // DELETE BUTTON CLICKED
            deleteroom.addEventListener("click",async()=>{
                let postdata = await fetch("/deleteroom",{
                    method:'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({"id":deleteroom.id})
                });
                let jsonres = await postdata.json();
                if(jsonres.success == "true"){
                    swal({
                        title: "ROOM IS DELETED!",
                        text: "You Have Deleted Your Room",
                        icon: "success",
                        button: "Close This Alert",
                      });
                      all.remove();
                }
            });
            ////////////////////////////////////////////
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
                       socket.emit("joinroom",join.id,justname,jsonres.name,jsonres.chatowner);
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
        }
        });
        
}
}
//////////////////////////////////////////////////////////////////////////////////////////////
// ALL ROOMS
for(var i = 0;i<allrooms.length;i++){
    if(i==0||i==1){
        allrooms[i].addEventListener("click",async()=>{
            if(chatscreen.style.display == "flex"&&chattitle.style.display == "flex"){
                socket.emit("leavechat");
               location.reload();
            }
            if(document.getElementsByClassName("create-room1").length>0){
                document.querySelectorAll('.create-room1').forEach(e => e.remove());
            }
            if(document.getElementsByClassName("create-room").length>0){
                document.querySelectorAll('.create-room').forEach(e => e.style.display = "none");
            }
            const response = await fetch("/all-rooms");
            const contentType = response.headers.get("content-type");
            if(contentType.indexOf("application/json") == -1){
                location.reload();
            }
            const jsonobj = await response.json();
            if(jsonobj.length<=0){
                swal({
                    title: "SERVER DON'T HAVE ANY ROOM",
                    text: "You Can Create A Room",
                    icon: "error",
                    button: "Close This Alert",
                  });
            }
            else{
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
            let justname = jsonobj[i].chatname;
            membercount.innerHTML = "Available Space: "+jsonobj[i].memberamount;
            join.id = jsonobj[i].id;
            join.innerHTML = "JOIN THIS ROOM!";
            //join.onclick = joinclick(join.id,justname);
            
            all.appendChild(chat);
            all.appendChild(membercount);
            all.appendChild(join);
            document.body.appendChild(all);
            //JOIN BUTTON CLICKED
            join.addEventListener("click",async()=>{
                let str = chat.innerHTML.replace("Room Name: ","");
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
                    socket.emit("joinroom",join.id,str,jsonres.name,jsonres.chatowner);
                }
                else if (jsonres.success == "false"){
                 swal({
                     title: "ROOM IS NOT AVAILABLE!",
                     text: "This Room's Capacity Is Full! ",
                     icon: "error",
                     button: "Close This Alert",
                   });
                }
                else if(jsonres.success == "banned"){
                    swal({
                        title: "YOU ARE BANNED FROM THE CHAT!",
                        text: "Until Chat Owner Remove Your Ban You Are Banned! ",
                        icon: "error",
                        button: "Close This Alert",
                      });
                }
                else if(jsonres.success == "noroom"){
                    swal({
                        title: "THIS ROOM IS DELETED!",
                        text: "PLEASE REFRESH THE PAGE",
                        icon: "error",
                        button: "Close This Alert",
                      });
                }
             });
         /////////////////////////////////////////////
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
        }
        });
    }
}
/////////////////////////////////////////////////////////////

// CHAT SEND BUTTON
senbutton.addEventListener("click",async()=>{
if(writingarea.value!= ""){
    let getname = await fetch("/getname");
    let sendername = await getname.json();
    socket.emit("sendmessage",writingarea.value,sendername.name);
}
});

/////////////////////////////////////////////////////////////

// LEAVE CHAT BUTTON

document.getElementsByClassName("leave")[0].addEventListener("click",async()=>{
socket.emit("leavechat");
location.reload();
});


// HOME BUTTON
for(var i = 0;i<homebutton.length;i++){
    if(i==0||i==1){
    homebutton[i].addEventListener("click",async()=>{
    if(document.getElementsByClassName("create-room1").length>0){
        document.querySelectorAll('.create-room1').forEach(e => e.remove());
    }
    if(document.getElementsByClassName("create-room").length>0){
        document.querySelectorAll('.create-room').forEach(e => e.style.display="none");
    }
    const response = await fetch("/banned-user");
    const contentType = response.headers.get("content-type");
            if(contentType.indexOf("application/json") == -1){
                location.reload();
            }
    const jsonobj = await response.json();
    if(jsonobj.length<=0){
        console.log("merhaba");
        swal({
            title: "YOU DID NOT BAN ANYONE",
            text: "If You Ban Someone You Can See The List",
            icon: "error",
            button: "Close This Alert",
          });
    }
    else{
        console.log("büyük");
        for(var i =0;i<jsonobj.length;i++){
            let all = document.createElement('nav');
            let chat = document.createElement('p');
            let banneduser = document.createElement('p');
            let unban = document.createElement('button');
            all.className = "navbar navbar-dark bg-dark create-room1";
            unban.id = jsonobj[i].userid;
            all.id = jsonobj[i].chatid;
            chat.id = "chatname";
            banneduser.id = "memberamount";
            banneduser.innerHTML = "User Name : "+jsonobj[i].username;
            chat.innerHTML = "Chat Name : "+jsonobj[i].chatname;
            unban.className = "btn btn-danger join";
            unban.setAttribute("style","font-weight: bolder; margin-top: 85px; float: left; margin-left: 30px; margin-left: 50%; transform: translate(-50%, -50%);height: 100px; width: 300px;");
            unban.innerHTML = "UNBAN THIS USER!";
            // UNBAN CLICKED
            unban.addEventListener("click",async()=>{
                let postdata = await fetch("/unbanuser",{
                    method:'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({"userid":unban.id,"chatid":all.id})
                });
                let jsonres = await postdata.json();

                if(jsonres.success == "true"){
                    swal({
                        title: "UNBAN PROCESS HAPPENED!",
                        text: "You Unbanned The User",
                        icon: "success",
                        button: "Close This Alert",
                      });
                      all.remove();
                }
            }); 
            all.appendChild(chat);
            all.appendChild(banneduser);
            all.appendChild(unban);
            document.body.appendChild(all);
            document.getElementsByClassName("create-room1")[i].style.display = "block";
        }
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
