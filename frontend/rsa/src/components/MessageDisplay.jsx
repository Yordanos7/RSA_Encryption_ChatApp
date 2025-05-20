function MessageDisplay({ messages }) {
  return (
    <div className="  h-96 overflow-y-auto p-4 bg-gray-900 rounded-lg">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="p-3 bg-gray-700 rounded-lg w-full mt-2">
            <div className="break-words">
              <p className="text-sm text-gray-400 ">
                Sender: {msg.id} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
              <p className="text-lg font-semibold">Encrypted: {msg.message}</p>
              <p className="text-lg break-words">Decrypted: {msg.decrypted}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageDisplay;
