import { useState, useRef, useEffect } from "react";
import { Search, Smile, Paperclip, Send } from "lucide-react";
import "./SidebarChat.scss";
import { useSelector, useDispatch } from "react-redux";
import { getAllSender, getLastMessage, updateMessageStatus } from "../../redux/chatSlice";
import ChatAdmin from "./ChatAdmin";
import { Api_ManagerCustomer } from '../../../apis/Api_ManagerCustomer';

export default function SidebarChat() {
    // const senders = useSelector((state) => state.chat.senders);
    const [lastMessages, setLastMessages] = useState([])
    const [senders, setSenders] = useState([
        {
            clientId: 1,
            name: "Nguyễn Văn A",
            phoneNumber: "0123456789",
            dateOfBirth: "2000-01-01",
            time: "2023-10-01T12:00:00Z",
        }
    ])
    const [searchInput, setSearchInput] = useState("");
    const [conversations, setConversations] = useState([]);
    const [info, setInfo] = useState({});

    const dispatch = useDispatch();
    const fetchListSender = async () => {
        // let sender = await dispatch(getAllSender());
        // { customerId: "KH001", customerName: "Nguyễn Thị Quỳnh Giang", email: "nguyenthiquynhgiang@gmail.com", phoneNumber: "123-456-7890", address: "TPHCM" },
        // try {
        //     const customers = await Api_ManagerCustomer.getAllCustomers();
        //     // setSenders(customers);
        //     console.log('Customers:', customers);
        // } catch (error) {
        //     console.error('Failed to fetch customers:', error);
        // }
    };

    // Gọi last message của từng sender
    const lastMessage = async (senders) => {
        const senderIds = senders.map(s => s.clientId).join(',');
        let res = await dispatch(getLastMessage(senderIds))

        if (res.payload.EC === 0 && Array.isArray(res.payload.DT)) {
            const formattedMessages = res.payload.DT.map(item => ({
                senderId: item.clientId,
                message: item.message,
                state: item.status,
                timestamp: item.createdAt // nếu cần dùng cho convertTime
            }));
            setLastMessages(formattedMessages);
        }

    }


    useEffect(() => {
        // dispatch(getAllSender());
        lastMessage(senders)
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
        const _conversations = senders.map(sender => {
            const lastMsg = lastMessages.find(m => m.senderId === sender.clientId);
            console.log('lastMsg ', lastMsg);

            return {
                id: sender.clientId,
                name: sender.name,
                phoneNumber: sender.phoneNumber,
                message: lastMsg?.message || "",
                time: convertTime(new Date(lastMsg?.timestamp || sender.createdAt)),
                avatar: "/placeholder.svg",
                state: lastMsg?.state || 0
            };
        });

        // Sắp xếp theo timestamp mới nhất
        const sorted = [..._conversations].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setConversations(sorted);
    }, [lastMessages]);

    const handleShowChat = async (sender) => {
        // Gửi yêu cầu cập nhật trạng thái đọc
        try {
            await dispatch(updateMessageStatus({ clientId: sender.id }))
            // Sau khi cập nhật, gọi lại lastMessage để load lại trạng thái
            await lastMessage(senders);
        } catch (error) {
            console.error("Failed to update message status:", error);
        }

        setInfo({
            clientId: sender.id,
            name: sender.name,
            avatar: sender.avatar,
            time: sender.time,
        });

    }

    const handleSearch = () => {
        const keyword = searchInput.toLowerCase();

        const filtered = senders
            .filter(sender =>
                sender.name.toLowerCase().includes(keyword) ||
                sender.phoneNumber.includes(keyword)
            )
            .map(sender => ({
                id: sender.clientId,
                name: sender.name,
                phoneNumber: sender.phoneNumber,
                dateOfBirth: sender.dateOfBirth,
                message: 'sender.message',
                time: convertTime(new Date(sender.createdAt || sender.time || new Date())), // fallback nếu thiếu `createdAt`
                avatar: "/placeholder.svg",
            }));

        setConversations(filtered);
    };

    const handleSearchRealtime = (keyword) => {
        const lowerKeyword = keyword.toLowerCase();

        const filtered = senders
            .filter(sender =>
                sender.name.toLowerCase().includes(lowerKeyword) ||
                sender.phoneNumber.includes(lowerKeyword)
            )
            .map(sender => ({
                id: sender.clientId,
                name: sender.name,
                phoneNumber: sender.phoneNumber,
                dateOfBirth: sender.dateOfBirth,
                message: 'sender.message',
                time: convertTime(new Date(sender.createdAt || sender.time || new Date())),
                avatar: "/placeholder.svg",
            }));

        setConversations(filtered);
    };

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
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        handleSearchRealtime(e.target.value);
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <span
                                    className="input-group-text bg-light border-start-0 cursor-pointer"
                                    onClick={() => handleSearch()}
                                >
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
                                    <div className={`text-truncate small ${chat.message && chat.state === 0
                                        ? 'fw-semibold text-dark'
                                        : 'text-secondary'
                                        }`}>
                                        {chat.message || "Không có tin nhắn"}
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
