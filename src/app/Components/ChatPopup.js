"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! 👋 ¿Quieres que te recomiende un libro?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botón flotante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition">
          <MessageCircle size={35} />
        </button>
      )}

      {/* Ventana del chat */}
      {open && (
        <div className="w-100 h-116 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2">
            <h2 className="font-bold text-lg">Asistente de Libros</h2>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto text-lg p-3 space-y-2 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-left"
                    : "bg-blue-500 text-white self-end ml-auto"
                }`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t py-4 px-3 items-center bg-white">
            <input
              type="text"
              className="flex-1 border rounded-md px-3 py-2 text-md"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-md">
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
