import { useState, useRef, useEffect } from "react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import "./SidebarChat.scss";
import { useSelector, useDispatch } from "react-redux";
import { getMessages, sendMessages } from "../../redux/chatSlice";
import {SearchProductModal} from './SearchProduct'

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

    const sendMessage = async () => {
        if (!input.trim()) return;
        let res = await dispatch(sendMessages({ clientId: senderID, senderId: 1, message: input }));

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
                    <button className="btn btn-light me-2" onClick={() => setShowModal(true)}>
                        <Paperclip size={20}/>
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
           
            <SearchProductModal 
              show={showModal}
              handleClose={() => setShowModal(false)}/>

        </div>

    );
}
