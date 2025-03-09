import { useState, useRef, useEffect } from "react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import "./ChatAdmin.scss";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";

export default function ChatAdmin() {
    const [conversations] = useState([
        {
            id: 1,
            name: "Võ Trường Khang",
            message: "[Thông báo] Giới thiệu về Trường Kha...",
            time: "26/07/24",
            avatar: "/placeholder.svg",
        },
        {
            id: 2,
            name: "Thu",
            message: "[Thông báo] Giới thiệu thêm Thu",
            time: "23/07/24",
            avatar: "/placeholder.svg",
        },
        {
            id: 3,
            name: "IGH - DHKTPMTB - CT7",
            message: "Võ Văn Hòa, Dung",
            time: "20/07/24",
            avatar: "/placeholder.svg",
        },
        // Add more conversations as needed
    ]);

    const [input, setInput] = useState("");

    const messages = useSelector((state) => state.chat.message);
    const messagesEndRef = useRef(null);
    const prevMessagesCount = useRef(messages.length);
    const dispatch = useDispatch();

    const sendMessage = async () => {
        if (!input.trim()) return;
        let res = await dispatch(sendMessages({ clientId: 2, senderId: 1, message: input }));
        if (res.payload.EC === 0) {
            setInput("");
            await dispatch(getMessages());
        }
    };

    const fetchMessages = async () => {
        await dispatch(getMessages());
    };

    useEffect(() => {
        dispatch(getMessages());
        const interval = setInterval(fetchMessages, 1000); // Lặp lại mỗi 1 giây
        return () => clearInterval(interval); // Cleanup khi component unmount
    }, []);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (messages.length > prevMessagesCount.current) {
            const chatContent = document.querySelector('.chat-content');
            chatContent.scrollTop = chatContent.scrollHeight;  // Cuộn đến cuối phần Chat Content
        }
        prevMessagesCount.current = messages.length;
    }, [messages]);

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row h-100 g-0 ">
                {/* Left Sidebar */}
                <div
                    className="col-3 border-end bg-white"
                    style={{ maxWidth: "300px" }}
                >
                    {/* Profile and Search */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center ">
                            <img
                                src="/placeholder.svg"
                                className="rounded-circle"
                                alt=""
                                style={{ width: "32px", height: "32px" }}
                            />
                            <div className="input-group ms-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light"
                                    placeholder="Tìm kiếm"
                                />
                                <span className="input-group-text bg-light border-start-0">
                                    <Search size={16} />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div
                        className="overflow-auto"
                        style={{ height: "calc(100vh - 60px)" }}
                    >
                        {conversations.map((chat) => (
                            <div
                                key={chat.id}
                                className="d-flex align-items-center p-2 border-bottom hover-bg-light cursor-pointer"
                            >
                                <img
                                    src={chat.avatar || "/placeholder.svg"}
                                    className="rounded-circle"
                                    alt=""
                                    style={{ width: "48px", height: "48px" }}
                                />
                                <div className="ms-2 overflow-hidden ">
                                    <div className="text-truncate fw-medium ">{chat.name}</div>
                                    <div className="text-truncate small text-muted ">
                                        {chat.message}
                                    </div>
                                </div>
                                <small className="text-muted ms-auto">{chat.time}</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="col-9 bg-light">
                    {/* Chat Header */}
                    <div className="bg-white p-2 d-flex align-items-center border-bottom">
                        <img
                            src="/placeholder.svg"
                            className="rounded-circle"
                            alt=""
                            style={{ width: "40px", height: "40px" }}
                        // onClick={openModal}
                        />


                        <div className="ms-2">
                            <div className="fw-medium">Võ Trường Khang</div>
                            <small className="text-muted">Hoạt động 2 giờ trước</small>
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
                                className={`p-2 my-1 max-w-[80%] rounded-lg ${msg.senderId === 2 ? "bg-blue-100 self-end ml-auto" : "bg-gray-200"}`}
                            >
                                {msg.message}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="bg-white p-2 border-top">

                        <div className="d-flex align-items-center">
                            <button className="btn btn-light me-2">
                                <Smile size={20} />
                            </button>
                            <button className="btn btn-light me-2">
                                <Paperclip size={20} />
                            </button>

                            <input
                                className="flex-1 p-2 border rounded-lg outline-none"
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Nhập tin nhắn..."
                            />
                            <button className="btn btn-primary ms-2" onClick={sendMessage}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
