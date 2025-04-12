import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";

const ChatBot = () => {
  const senderID = 3;  // khi login sẽ lấy từ user => chưa sửa
  const [isOpen, setIsOpen] = useState(false);
  const messages = useSelector((state) => state.chat.message);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;
    let res = await dispatch(sendMessages({ clientId: senderID, senderId: 2, message: input }));

    if (res.payload.EC === 0) {
      setInput("");
      await dispatch(getMessages({ senderID }));
    }
  };

  const fetchMessages = async () => {
    await dispatch(getMessages({ senderID }));
  };

  useEffect(() => {
    dispatch(getMessages({ senderID }));

    const interval = setInterval(fetchMessages, 1000); // Lặp lại mỗi 1 giây
    return () => clearInterval(interval); // Cleanup khi component unmount
  }, []);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      {/* Nút mở chat */}
      <button
        className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col mt-3 border">
          {/* Header chat */}
          <div className="bg-blue-500 text-white p-3 font-semibold flex justify-between">
            Chatbot
            <button onClick={toggleChat} className="text-white">✖</button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 max-w-[80%] rounded-lg ${msg.senderId === 2 ? "bg-blue-100 self-end ml-auto" : "bg-gray-200"}`}
              >
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="p-3 border-t flex">
            <input
              className="flex-1 p-2 border rounded-lg outline-none"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              onClick={sendMessage}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
