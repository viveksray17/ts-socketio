import { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("wss://socketio-vivek.herokuapp.com");

function sendMessage(name, message, clearMessage) {
	if(name === ""){
		alert("please enter a name")
	}else if(message === ""){
		alert("please enter a message")
	}else{
		socket.emit("messageFromFrontend", { message: message, username: name });
		clearMessage()
	}
}

function App() {
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [messageList, setMessageList] = useState([]);

	useEffect(() => {
		const handleMessage = (data) => {
			setMessageList((prev) => {
				return [...prev, data];
			});
		};
		socket.on("messageFromBackend", handleMessage);
		return () => {
			socket.off("messageFromBackend", handleMessage); // clearing the eventlistener so it doesn't pile up on subsequent renders
		};
	}, []);

	return (
		<div>
			<input
				placeholder="enter name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<input
				placeholder="enter message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<button onClick={() => sendMessage(name, message, () => setMessage(""))}>Send!</button>
			<ul>
				{messageList.map((message) => (
					<li>
						{message.username}: {message.message}
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
