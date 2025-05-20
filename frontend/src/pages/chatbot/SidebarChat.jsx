import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { getLastMessage, updateMessageStatus } from '../../redux/chatSlice';
import ChatAdmin from './ChatAdmin';
import { Api_ManagerCustomer } from '../../../apis/Api_ManagerCustomer';

function SidebarChat() {
    const [lastMessages, setLastMessages] = useState([]);
    const [senders, setSenders] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [info, setInfo] = useState({});
    const [isShowChat, setIsShowChat] = useState(false);

    const dispatch = useDispatch();

    const fetchListSender = async () => {
        // { customerId: "KH001", customerName: "Nguyễn Thị Quỳnh Giang", email: "nguyenthiquynhgiang@gmail.com", phoneNumber: "123-456-7890", address: "TPHCM" },
        try {
            const customers = await Api_ManagerCustomer.getAllCustomers();
            setSenders(customers.response);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    const lastMessage = async (senders) => {
        if (!senders || senders.length === 0) return; // Kiểm tra senders không rỗng
        try {
            const senderIds = senders.map((s) => s.userID).join(',');
            const res = await dispatch(getLastMessage(senderIds));

            if (res.payload.EC === 0 && Array.isArray(res.payload.DT)) {
                const formattedMessages = res.payload.DT.map((item) => ({
                    senderId: item.clientId,
                    message: item.message,
                    state: item.status,
                    timestamp: item.createdAt,
                }));
                setLastMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Failed to fetch last messages:', error);
        }
    };

    useEffect(() => {
        fetchListSender(); // Gọi lần đầu khi mount
        const interval = setInterval(fetchListSender, 5000); // Tăng interval lên 5 giây
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        lastMessage(senders); // Gọi lastMessage khi senders thay đổi
    }, [senders]);

    const convertTime = (targetDate) => {
        if (!targetDate) return 'đang hoạt động';
        const diffInMilliseconds = new Date() - new Date(targetDate);
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) return `${diffInDays} ngày trước`;
        if (diffInHours > 0) return `${diffInHours} giờ trước`;
        if (diffInMinutes > 0) return `${diffInMinutes} phút trước`;
        if (diffInSeconds > 0) return `${diffInSeconds} giây trước`;
        return 'đang hoạt động';
    };

    useEffect(() => {
        const _conversations = senders.map((sender) => {
            const lastMsg = lastMessages.find((m) => m.senderId === sender.userID);

            return {
                id: sender.userID,
                name: sender.lastName + ' ' + sender.firstName,
                phoneNumber: sender.phoneNumber,
                message: lastMsg?.message || '',
                time: convertTime(new Date(lastMsg?.timestamp || sender.createdAt || Date.now())),
                avatar: '/placeholder.svg',
                state: lastMsg?.state || 0,
            };
        });

        // Sắp xếp theo timestamp mới nhất
        const sorted = _conversations.sort(
            (a, b) =>
                new Date(
                    b.time === 'đang hoạt động'
                        ? Date.now()
                        : lastMessages.find((m) => m.senderId === b.id)?.timestamp || 0,
                ) -
                new Date(
                    a.time === 'đang hoạt động'
                        ? Date.now()
                        : lastMessages.find((m) => m.senderId === a.id)?.timestamp || 0,
                ),
        );

        setConversations(sorted);
    }, [senders, lastMessages]);

    const handleShowChat = async (sender) => {
        setIsShowChat(true);
        try {
            await dispatch(updateMessageStatus({ clientId: sender.id }));
            await lastMessage(senders);
        } catch (error) {
            console.error('Failed to update message status:', error);
        }

        setInfo({
            clientId: sender.id,
            name: sender.name,
            avatar: sender.avatar,
            time: sender.time,
        });
    };

    const handleSearchRealtime = (keyword) => {
        if (!keyword || typeof keyword !== 'string') {
            setConversations(
                senders.map((sender) => {
                    const lastMsg = lastMessages.find((m) => m.senderId === sender.userID);
                    return {
                        id: sender.userID,
                        name: sender.lastName + ' ' + sender.firstName,
                        phoneNumber: sender.phoneNumber,
                        message: lastMsg?.message || '',
                        time: convertTime(new Date(lastMsg?.timestamp || sender.createdAt || Date.now())),
                        avatar: '/placeholder.svg',
                        state: lastMsg?.state || 0,
                    };
                }),
            );
            return;
        }

        const lowerKeyword = keyword.toLowerCase();

        const filtered = senders
            .filter(
                (sender) =>
                    `${sender.lastName} ${sender.firstName}`.toLowerCase().includes(lowerKeyword) ||
                    sender.phoneNumber.includes(lowerKeyword),
            )
            .map((sender) => {
                const lastMsg = lastMessages.find((m) => m.senderId === sender.userID);
                return {
                    id: sender.userID,
                    name: sender.lastName + ' ' + sender.firstName,
                    phoneNumber: sender.phoneNumber,
                    message: lastMsg?.message || '',
                    time: convertTime(new Date(lastMsg?.timestamp || sender.createdAt || Date.now())),
                    avatar: '/placeholder.svg',
                    state: lastMsg?.state || 0,
                };
            });

        setConversations(filtered);
    };

    return (
        <div className="w-full pl-[260px] mt-[100px]">
            <div className="p-[20px]">
                <div className="container-fluid vh-100 p-0">
                    <div className="row h-100 g-0">
                        <div className="col-3 border-end bg-white" style={{ maxWidth: '300px' }}>
                            <div className="p-3 border-bottom">
                                <div className="d-flex align-items-center">
                                    <img
                                        src="/placeholder.svg"
                                        className="rounded-circle"
                                        alt=""
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                    <div className="input-group ms-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm bg-light"
                                            placeholder="Tìm kiếm theo tên hoặc SĐT"
                                            value={searchInput}
                                            onChange={(e) => {
                                                setSearchInput(e.target.value);
                                                handleSearchRealtime(e.target.value);
                                            }}
                                        />
                                        <span
                                            className="input-group-text bg-light border-start-0 cursor-pointer"
                                            onClick={() => handleSearchRealtime(searchInput)}
                                        >
                                            <Search size={16} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-auto" style={{ height: 'calc(100vh - 60px)' }}>
                                {conversations.map((chat) => (
                                    <div
                                        key={chat.id}
                                        className="d-flex align-items-center p-2 border-bottom hover-bg-light cursor-pointer"
                                        onClick={() => handleShowChat(chat)}
                                    >
                                        <img
                                            src={chat.avatar || '/placeholder.svg'}
                                            className="rounded-circle"
                                            alt=""
                                            style={{ width: '48px', height: '48px' }}
                                        />
                                        <div className="ms-2 overflow-hidden">
                                            <div className="d-flex align-items-center gap-5">
                                                <div className="text-truncate fw-medium">{chat.name}</div>
                                                <small className="text-muted ms-auto">{chat.time}</small>
                                            </div>
                                            <div
                                                className={`text-truncate small ${chat.message && chat.state === 0 ? 'fw-semibold text-dark' : 'text-secondary'}`}
                                            >
                                                {chat.message || 'Không có tin nhắn'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isShowChat ? (
                            <div className="col-9 bg-light">
                                <ChatAdmin info={info} />
                            </div>
                        ) : (
                            <div
                                className="col-9 bg-light d-flex justify-content-center align-items-center"
                                style={{ height: '100vh' }}
                            >
                                <h3 className="text-muted">Chào mừng bạn trở lại</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarChat;
