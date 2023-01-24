VARIABLES:

- input_message: References the input text inside the writting bar of the chat page.

- profile_pics: Array with all instances of the possible avatars. Needed to select one of them.

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

- onServerReady(): Function called when you first enter the server (chat, after login page).

- onServerUserConnected(): Notifies when someone connected.

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

- selectRoom(): In case I implement the change between rooms. If not, will be deleted.



