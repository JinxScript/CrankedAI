"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("response", (msg) => {
            setMessages((prev) => [...prev, { text: msg.text, sender: "bot" }]);
        });
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        socket.emit("message", { text: input });
        setMessages((prev) => [...prev, { text: input, sender: "user" }]);
        setInput("");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6">CRANKED AI CHATBOT</h1>
            <div className="w-full max-w-lg bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex flex-col space-y-4 overflow-y-auto max-h-96 p-2">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-xs ${
                                    msg.sender === "user"
                                        ? "bg-black text-white"
                                        : "bg-white text-black"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center border-t border-gray-700 pt-2">
                    <input
                        className="flex-1 p-2 bg-gray-700 text-white rounded-l-lg outline-none"
                        type="text"
                        placeholder="Type a new message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 p-3 rounded-r-lg hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
