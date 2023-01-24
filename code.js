var MYCHAT = {

    input_message: null,
    profile_pics: [],
    selected_avatar_src: null,

    user:
    {
        username: null,
        userID: null,
        users: []
    },

    rooms: {
        roomID : null,
        actualRoom : null,
        list_rooms: ["StardewChat", "room2"]  // array with all pre-defined rooms and added rooms
    },

    dataBase: [],

    init: function()
    {
        MYCHAT.profile_pics = document.querySelectorAll("img.avatar"); // load all avatars
        for (let i = 0; i < MYCHAT.profile_pics.length; i++) {
            MYCHAT.profile_pics[i].addEventListener('click', function onClick() {  // event listener for each image

                var div = document.querySelector("div.profile-picture"); // select the div of the profile pic
                var img = document.createElement("img"); // create image
                img.id = "user-image";
                img.className = "image";
                img.src = MYCHAT.profile_pics[i].src; // source from the clicked avatar
                selected_avatar_src = img.src;
                div.appendChild(img);
                var avatarSection = document.querySelector("div.avatar-page");
                avatarSection.remove();
                MYCHAT.server.connect( "wss://ecv-etic.upf.edu/node/9000/ws", MYCHAT.rooms.actualRoom );
                MYCHAT.server.on_room_info = MYCHAT.onServerRoomInfo;
                MYCHAT.server.on_ready = MYCHAT.onServerReady;
            });
        }

        MYCHAT.user.username = document.querySelector(".login-username");
        MYCHAT.user.username.addEventListener("keydown", MYCHAT.onKeyDown);
        
        MYCHAT.rooms.roomID = document.querySelector(".login-roomname");
        MYCHAT.rooms.roomID.addEventListener("keydown", MYCHAT.onKeyDown);

        MYCHAT.send_button = document.querySelector(".login-button");
        MYCHAT.send_button.addEventListener("click", MYCHAT.loginButton);

        MYCHAT.send_button = document.querySelector(".send");
        MYCHAT.send_button.addEventListener("click", MYCHAT.sendMessage);

        MYCHAT.input_message = document.querySelector("input.input-message");
        MYCHAT.input_message.addEventListener("keydown", MYCHAT.onKeyDownChat);

        var selected = document.querySelector(".history");
        selected.addEventListener("click", MYCHAT.selectRoom);
        
        MYCHAT.server = new SillyClient();
        MYCHAT.server.on_user_connected = MYCHAT.onServerUserConnected;
        MYCHAT.server.on_user_disconnected = MYCHAT.onServerUserDisconnected;
        MYCHAT.server.on_message = MYCHAT.receiveMessage;
    },
    
    login: function() {
        var loginSection = document.querySelector("div.login-page");
        loginSection.remove();

        var loginUsername = document.querySelector("div.text#username");
        var loginRoomname = document.querySelector("div.text#roomname");
        loginUsername.innerHTML = MYCHAT.user.username.value;
        loginRoomname.innerHTML = MYCHAT.rooms.actualRoom;
    },

    onKeyDown: function (event) {
        if(!event.code == "Enter")
            return;

        if(event.code == "Enter" && !MYCHAT.isEmpty(MYCHAT.user.username.value))
        {
            if(!MYCHAT.isEmpty(MYCHAT.rooms.roomID.value))
                MYCHAT.checkRoom();
            else
                MYCHAT.rooms.actualRoom = "StardewChat";
            console.log("User and room added");
            MYCHAT.login();
        }
    },

    loginButton: function () {
        if(!MYCHAT.isEmpty(MYCHAT.user.username.value))
        {
            if(!MYCHAT.isEmpty(MYCHAT.rooms.roomID.value))
                MYCHAT.checkRoom();
            else
                MYCHAT.rooms.actualRoom = "StardewChat";
            console.log("User and room added");
            MYCHAT.login();
        }
    },

    onServerRoomInfo: function(user_id)
    {
        MYCHAT.getUsers();
        var msg = "Welcome to Stardew Chat!";
        MYCHAT.showSysMessage( msg );
    },

    onServerReady: function(user_id)
    {
        MYCHAT.user.userID = user_id;
    },

    getUsers: function() 
    {
        MYCHAT.user.users = Object.keys(MYCHAT.server.clients).map(Number);
    },

    onServerUserConnected: function(user_id)
    {
        MYCHAT.user.users.push(Number(user_id));

        var msg = user_id + " connected";
        MYCHAT.showSysMessage(msg);

        var minID = Math.min.apply(Math, MYCHAT.user.users);

        if(MYCHAT.user.userID == minID)
        {
            for( let i = 0; i < MYCHAT.dataBase.length; i++)
            {
                if(MYCHAT.dataBase[i].type != "sys")
                    MYCHAT.server.sendMessage(MYCHAT.dataBase[i], [user_id]);
            }
        }
    },

    onServerUserDisconnected: function(user_id)
    {
        var msg = user_id + " disconnected";

        const index = MYCHAT.user.users.indexOf(Number(user_id));
        if (index > -1) { // only splice array when item is found
            MYCHAT.user.users.splice(index, 1); // 2nd parameter means remove one item only
        }

        MYCHAT.showSysMessage(msg);
    },

    createMessage: function(type, content, username, room, profile_pic)
    {
        var msg = {
            type: type,
            content: content,
            username: username,
            roomname: room,
            profile_pic: profile_pic
        }

        MYCHAT.dataBase.push(msg);

        return msg;
    },
    
    showSysMessage: function( msg )
    {
        var div = document.createElement("div"); // A separation for each message
        div.className = "sys-message";
        
        var p = document.createElement("p"); // Content for the message
        
        var newMsg = MYCHAT.createMessage("sys", msg, "System", MYCHAT.rooms.actualRoom, null);
        MYCHAT.server.sendMessage(newMsg);
        p.innerText = msg;
        
        console.log(p.innerText);
        
        div.appendChild( p ); // Put the text inside the division
        
        var log = document.querySelector("div.chat");
        log.appendChild( div );  // Put the division on the chat
        log.scrollTop = 10000;
    },
    
    receiveMessage: function( user_id, msg )
    {
        var parsed = JSON.parse( msg );
        var newMsg = MYCHAT.createMessage(parsed.type, parsed.content, parsed.username, parsed.roomname, parsed.profile_pic);
        
        var div = document.createElement("div"); // A separation for each message

        if(parsed.type == "sys")  // No mostro els missatges del sistema dels altres usuaris
            return;

        div.className = "out-message";

        var img = document.createElement("img");
        img.id = "avatar-msg";
        img.className = "image";
        img.src = parsed.profile_pic; // source from the clicked avatar
        div.appendChild(img);

        var p = document.createElement("p"); // Content for the message

        p.innerText = parsed.username + ": " + parsed.content;

        console.log(p.innerText);
        
        div.appendChild( p ); // Put the text inside the division
        var log = document.querySelector("div.chat");
        log.appendChild( div );  // Put the division on the chat
        log.scrollTop = 10000;
    },

    sendMessage: function()
    {
        var div = document.createElement("div"); // A separation for each message
        div.className = "my-message";

        var img = document.createElement("img");
        img.id = "avatar-msg";
        img.className = "image";
        img.src = selected_avatar_src; // source from the clicked avatar
        div.appendChild(img);

        var p = document.createElement("p"); // Content for the message
        
        if(MYCHAT.isEmpty(MYCHAT.input_message.value))
            return;
        
        var newMsg = MYCHAT.createMessage("text", MYCHAT.input_message.value, MYCHAT.user.username.value, MYCHAT.rooms.actualRoom, selected_avatar_src);
        p.innerText = MYCHAT.user.username.value + ": " + MYCHAT.input_message.value;
        console.log(p.innerText);
        
        div.appendChild( p ); // Put the text inside the division
    
        var log = document.querySelector("div.chat");
        log.appendChild( div );  // Put the division on the chat

        MYCHAT.server.sendMessage(JSON.stringify(newMsg));

        MYCHAT.input_message.value = "";
        log.scrollTop = 10000;
    },

    checkRoom: function () {
        for(let i = 0; i < MYCHAT.rooms.list_rooms.length; i++){
            if(MYCHAT.rooms.roomID.value == MYCHAT.rooms.list_rooms[i])
            {
                MYCHAT.actualRoom = MYCHAT.rooms.list_rooms[i];
                return;
            }
        }
        MYCHAT.newRoom();
    },

    newRoom: function() {
        MYCHAT.rooms.actualRoom = MYCHAT.rooms.roomID.value;
        MYCHAT.rooms.list_rooms.push(MYCHAT.rooms.roomID.value);
    },

    isEmpty: function(text)
    {
        return !text.trim().length;
    },

    onKeyDownChat: function(event)
    {    
        if(MYCHAT.input_message.value != "")
        {
            MYCHAT.send_button.style.backgroundColor = "rgb(219,163,154)"; //When we write a message, the color of the button changes
            MYCHAT.send_button.style.borderColor = "rgb(219,163,154)";
        }
        else
        {
            MYCHAT.send_button.style.backgroundColor = "rgb(204, 214, 166)"; // If we delete the message, the color of the button changes to its previous color
            MYCHAT.send_button.style.borderColor = "rgb(204, 214, 166)";
        }
    
        if(MYCHAT.input_message.value != "" && event.code == "Enter")
        {
            MYCHAT.sendMessage();
            MYCHAT.send_button.style.backgroundColor = "rgb(204, 214, 166)"; // When we send the message, adjust the color to the original color
            MYCHAT.send_button.style.borderColor = "rgb(204, 214, 166)"; 
        }
    },

    selectRoom: function(event)
    {
        if(event.target.id)
            MYCHAT.actualRoom = event.target.id;

        console.log(MYCHAT.actualRoom);
    }

}