import React, { useState } from 'react';
import { chatGPT } from "../../redux/chatSlice";
import { useSelector, useDispatch } from "react-redux";

const ChatAiGpt = () => {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const dispatch = useDispatch();

    const toggleChat = () => setShowChat(!showChat);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const res = await dispatch(chatGPT(input));
            setMessages([...newMessages, { sender: 'bot', text: res.payload.reply }]);
        } catch (err) {
            console.log('err bot chat gpt: ', err);
            setMessages([...newMessages, { sender: 'bot', text: 'Bot gặp lỗi rồi 😢' }]);
        }
    };

    return (
        <div
            className="position-fixed end-0 me-4 mb-4"
            style={{ bottom: '60px', zIndex: 1050 }}
        >
            {/* Nút mở chat */}
            {!showChat && (
                <button
                    className="btn btn-primary rounded-circle shadow"
                    style={{ width: '55px', height: '55px' }}
                    onClick={toggleChat}
                >
                    🤖
                </button>
            )}

            {/* Khung chat */}
            {showChat && (
                <div className="card shadow" style={{ width: '300px', height: '400px' }}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span>🤖 ChatAiGpt</span>
                        <button className="btn-close" onClick={toggleChat}></button>
                    </div>

                    <div className="card-body overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-success text-white text-end' : 'bg-light'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="card-footer d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAiGpt;
