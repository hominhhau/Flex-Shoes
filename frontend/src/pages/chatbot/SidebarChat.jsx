import { useState, useRef, useEffect } from "react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import "./SidebarChat.scss";
import { useSelector, useDispatch } from "react-redux";
// import { getAllSender } from "../../redux/chatSlice";
import ChatAdmin from "./ChatAdmin";

export default function SidebarChat() {
    // const senders = useSelector((state) => state.chat.senders);
    const senders = [
        {
            clientId: 1,
            name: "Nguyễn Văn A",
            phoneNumber: "0123456789",
            dateOfBirth: "2000-01-01",
            time: "2023-10-01T12:00:00Z",
        }, {
            clientId: 2,
            name: "Nguyễn Văn B",
            phoneNumber: "0123456789",
            dateOfBirth: "2000-01-01",
            time: "2023-10-01T12:00:00Z",
        },
        {
            clientId: 3,
            name: "Nguyễn Văn C",
            phoneNumber: "0123456789",
            dateOfBirth: "2000-01-01",
            time: "2023-10-01T12:00:00Z",
        }
    ]
    const [conversations, setConversations] = useState([]);
    const [info, setInfo] = useState({});

    const dispatch = useDispatch();

    const fetchListSender = async () => {
        // await dispatch(getAllSender());
    };

    useEffect(() => {
        // dispatch(getAllSender());

        const interval = setInterval(fetchListSender, 1000); // Lặp lại mỗi 1 giây
        return () => clearInterval(interval); // Cleanup khi component unmount
    }, []);

    const convertTime = (targetDate) => {
        const diffInMilliseconds = new Date() - targetDate;
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        // Nếu thời gian vượt quá 1 ngày, chỉ lấy ngày
        if (diffInDays > 0) {
            return `${diffInDays} ngày trước`;
        }
        else if (diffInHours > 0) {
            return `${diffInHours} giờ trước`;
        }
        else if (diffInMinutes > 0) {
            return `${diffInMinutes} phút trước`;
        }

        else if (diffInSeconds > 0) {
            return `${diffInSeconds} giây trước`;
        }
        else {
            return "đang hoạt động";
        }
    }

    useEffect(() => {
        setConversations(
            senders.map(sender => ({
                id: sender.clientId,
                name: sender.name,
                phoneNumber: sender.phoneNumber,
                dateOfBirth: sender.dateOfBirth,
                message: 'sender.message',
                time: convertTime(new Date(sender.createdAt)),
                avatar: "/placeholder.svg",
            }))
        );
    }, []);

    const handleShowChat = (sender) => {
        setInfo({
            clientId: sender.id,
            name: sender.name,
            avatar: sender.avatar,
            time: sender.time,
        });
    }

    return (
        <div className="container-fluid vh-100 p-0">
            <div className="row h-100 g-0 ">
                {/* Left SidebarChat */}

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
                                onClick={() => handleShowChat(chat)}

                            >
                                <img
                                    src={chat.avatar || "/placeholder.svg"}
                                    className="rounded-circle"
                                    alt=""
                                    style={{ width: "48px", height: "48px" }}
                                />

                                <div className="ms-2 overflow-hidden ">
                                    <div className="d-flex align-items-center gap-5">
                                        <div className="text-truncate fw-medium ">{chat.name}</div>
                                        <small className="text-muted ms-auto">{chat.time}</small>
                                    </div>
                                    <div className="text-truncate small text-muted ">
                                        {chat.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="col-9 bg-light">
                    <ChatAdmin info={info} />
                </div>
            </div>
        </div>
    );
}
