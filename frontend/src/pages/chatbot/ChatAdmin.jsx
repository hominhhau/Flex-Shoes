import { useState, useRef, useEffect } from "react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import "./SidebarChat.scss";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";
import { SearchProductModal } from './SearchProduct'

export default function ChatAdmin(props) {
    const senderID = props.info.clientId;
    const name = props.info.name;
    const time = props.info.time;
    const avatar = props.info.avatar;

    const [input, setInput] = useState("");
    const [showModal, setShowModal] = useState(false);

    const messages = useSelector((state) => state.chat.message);
    const messagesEndRef = useRef(null);
    const prevMessagesCount = useRef(messages.length);
    const dispatch = useDispatch();

    const sendMessage = async (type) => {
        if (!input.trim()) return;
        let res = await dispatch(sendMessages({ clientId: senderID, senderId: 1, message: input, type: type , productId: "" }));

        if (res.meta.requestStatus === "fulfilled") {
            setInput("");
            await dispatch(getMessages({ senderID }));
        }
    };

    const fetchMessages = async () => {
        await dispatch(getMessages({ senderID }));
    };

    useEffect(() => {
        if (senderID) {
            dispatch(getMessages({ senderID }));
            const interval = setInterval(fetchMessages, 1000); // Lặp lại mỗi 1 giây
            return () => clearInterval(interval); // Cleanup khi component unmount
        }
    }, [senderID]);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (messages.length > prevMessagesCount.current) {
            const chatContent = document.querySelector('.chat-content');
            chatContent.scrollTop = chatContent.scrollHeight;  // Cuộn đến cuối phần Chat Content
        }
        prevMessagesCount.current = messages.length;
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

    return (
        <div className=" ">
            {/* Chat Header */}
            <div className="bg-white p-2 d-flex align-items-center border-bottom">
                <img
                    src={avatar}
                    className="rounded-circle"
                    alt=""
                    style={{ width: "40px", height: "40px" }}
                />


                <div className="ms-2">
                    <div className="fw-medium">{name}</div>
                    <small className="text-muted">Hoạt động {time}</small>
                </div>
            </div>

            {/* Chat Content */}
            <div
                className="chat-content p-3 overflow-auto flex-grow-1"
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

            {/* Message Input */}
            <div className="bg-white p-4 border-top">

                <div className="d-flex align-items-center">
                    <button className="btn btn-light me-2">
                        <Smile size={20} />
                    </button>
                    <button className="btn btn-light me-2" onClick={() => setShowModal(true)}>
                        <Paperclip size={20} />
                    </button>


                    <input
                        className="flex-1 p-2 border rounded-lg outline-none"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage('text')}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button className="btn btn-primary ms-2" onClick={() => sendMessage('text')}>
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <SearchProductModal
                senderID={senderID}
                show={showModal}
                handleClose={() => setShowModal(false)} />

        </div >

    );
}
