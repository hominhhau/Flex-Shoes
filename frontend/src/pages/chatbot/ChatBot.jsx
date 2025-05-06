import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
  // const senderID = localStorage.getItem('customerId') ? localStorage.getItem('customerId') : 1;  // khi login sẽ lấy từ user
  const senderID = 1;  // khi login sẽ lấy từ user
  const [isOpen, setIsOpen] = useState(false);
  const messages = useSelector((state) => state.chat.message);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;
    let res = await dispatch(sendMessages({ clientId: senderID, senderId: 2, message: input, type: "text" , productId: "" }));

    if (res.meta.requestStatus === "fulfilled") {
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

  const convertTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  // Chuyển hướng đến trang chi tiết sản phẩm

  const handleDetail = async(productId) => {
    navigate(`/productdetail/${productId}`);
  }

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end z-50">
      {/* Nút mở chat */}
      <button
        className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
      </button>

      {/* Cửa sổ chat mở bên trái nút */}
      {isOpen && (
        <div className="absolute bottom-0 right-full mr-3 w-[400px] h-[600px] bg-white shadow-lg rounded-lg flex flex-col border">
          {/* Header chat */}
          <div className="bg-blue-500 text-white p-3 font-semibold flex justify-between items-center">
            Chatbot
            <button onClick={toggleChat} className="text-white">✖</button>
          </div>

          {/* Nội dung tin nhắn */}
          <div
            className="flex-1 p-3 overflow-auto flex-grow-1"
            style={{ height: "calc(100vh - 128px)" }}
          >
            {/* Chat messages would go here */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`d-flex my-1 ${msg.senderId !== 2 ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className={`p-3 rounded-3 text-break`}
                  style={{
                    maxWidth: "70%",
                    backgroundColor: msg.senderId !== 2 ? "#0d6efd" : "#f1f1f1",
                    color: msg.senderId !== 2 ? "white" : "black",
                  }}
                >
                  {msg.type === 'image' ? (
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={msg.message}
                        alt="Hình ảnh"
                        className="rounded mb-2"
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      />
                      <button className="btn btn-danger mt-4" onClick={() => handleDetail(msg.productId)}>Xem chi tiết</button>
                    </div>
                  ) : (
                    <span>{msg.message}</span>
                  )}
                  {/* Thời gian gửi */}
                  <div
                    className={`text-end text-xs mt-1 ${msg.senderId !== 2 ? "text-white" : "text-secondary"
                      }`}
                  >
                    {convertTime(msg.createdAt)}
                  </div>
                </div>
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
