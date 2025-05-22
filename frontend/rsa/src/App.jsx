import { useState, useEffect } from "react";
import io from "socket.io-client";
import forge from "node-forge";
import MessageInput from "./components/MessageInput";
import MessageDisplay from "./components/MessageDisplay";

const socket = io("https://rsa-encryption-chatapp-3backend.onrender.com");

function App() {
  const [publicKeyPem, setPublicKeyPem] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Receive public key from server
    socket.on("publicKey", (key) => {
      console.log("Public key received:", key);
      setPublicKeyPem(key);
    });

    // Receive messages
    socket.on("receiveMessage", (message) => {
      console.log("Message received from server:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("publicKey");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = (message) => {
    if (publicKeyPem && message) {
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const encrypted = forge.util.encode64(
        publicKey.encrypt(message, "RSA-OAEP")
      );
      console.log("Encrypted message sent:", encrypted);
      socket.emit("sendMessage", encrypted);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ">
      <h1 className="text-4xl font-bold mb-8 text-indigo-400">
        RSA Encrypted Chat
      </h1>
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
        <MessageDisplay messages={messages} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;
