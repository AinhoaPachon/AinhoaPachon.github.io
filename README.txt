Ainhoa Pachon Moya, 219371
ainhoa.pachon01@estudiant.upf.edu



Welcome to StardewChat! A place where you can sit, relax, and talk with your favourite villagers (or friends)!

When you enter the chat, you will first arrive to the log in page. Here, you must write a username, but the roomname is optional.
If you leave the roomname blank, you will be automatically joined to StardewChat. Once you decide a username, press enter or click the log in button.

The next step will be to decide an avatar. You will have to choose between my favourite villagers. This avatar will appear when you write a message or when someone recives a message from you.

Finally, you enter the chat page. Now, you can talk with anyone in the room. If there were any messages before you logged in, the oldest user will send you the history of messages, so don't worry. You won't miss anything.

In case you want to check why I created a function or what does it do, here I wrote an API so you (and me from the future) can understand everything better.



VARIABLES:

- input_message: References the input text inside the writting bar of the chat page.

- profile_pics: Array with all instances of the possible avatars. Needed to select one of them.

- selected_avatar_src: The source of the selected avatar by the user.

- msg: The messages. The content of this variable will have:
	- type: Whether it is a text or not.
	- content: The content of the message.
	- username: The username of the sender. Can be "system".
	- roomname: The room it belongs to.

- user: The attributes of an user.
	- username: The chosen username (the one it appears on a message).
	- userID: Assigned by the server on connect.
	- users: List of all users.

- rooms: Attributes of the rooms.
	- roomID: The ID of the chosen room. Needed to check whether the room already exists.
	- actualRoom: The actual room of the chat.
	- list_rooms: List of all rooms.

- dataBase: The Data Base with all the messages on the room.



FUNCTIONS:

- init(): Initializes most variables with Event Listeners belonging to parts of the html file.

- login(): When the user writes their username, they enter the avatar page and connects to the server.

- onKeyDown(): Function called to identify the key pressed in the login page.
		   If the key is an enter:
			- Checks if the username is empty. If it is, it does nothing.
			- Checks if the roomname is empty. If it is, we select the default room. If it is not, it is created.

- loginButton(): Same as onKeyDown(), but for the login button.

- onServerRoomInfo(): Gets the info of all users connected to the room.

- onServerReady(): Function called when you first enter the server, updates the userID with the one given by the server.

- onServerUserConnected(): Notifies when someone connected. The user with lowest ID sends the history of messages.

- onServerUserDisconnected(): Notifies when the user disconnected. Removes their ID from the array of Users ID.

- createMessage(): Fills the attributes of the msg variable and pushes it to the Data Base.

- showSysMessage(): Shows on the chat a maessage sent by the system.

- receiveMessage(): Displays an image from another user.

- sendMessage(): Sends the message written in the writting bar.

- checkRoom(): Checks if the room exists. If it exists we set the actual room to the roomID. If it does not exists, we create it.

- newRoom(): Updates the actualRoom and adds the room to the list_rooms.

- isEmpty(): Checks whether the string is empty or not.

- onKeyDownChat(): If a user is writting something, the style of the button changes.
			 If a user deletes what they have written, the style of the button will be the default style.
			 If a user presses enter (and the writting bar is not empty), the message will be sent.