const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const forge = require("node-forge");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  },
});

// Generate RSA key pair
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send public key to client
  socket.emit("publicKey", publicKeyPem);

  // Handle incoming encrypted messages
  socket.on("sendMessage", (encryptedMessage) => {
    console.log("Encrypted message received:", encryptedMessage);
    try {
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      const decryptedMessage = privateKey.decrypt(
        forge.util.decode64(encryptedMessage),
        "RSA-OAEP"
      );
      console.log("Decrypted message:", decryptedMessage);

      // Emit the decrypted message to all clients
      io.emit("receiveMessage", {
        id: socket.id,
        message: encryptedMessage,
        decrypted: decryptedMessage,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
