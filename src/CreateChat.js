// src/CreateChat.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateChat = () => {
    const [chatName, setChatName] = useState('');
    const [duration, setDuration] = useState(3600); // По умолчанию 1 час в секундах
    const navigate = useNavigate();

    const handleCreateChat = (e) => {
        e.preventDefault();
        // Перенаправляем на страницу чата с параметрами
        navigate(`/chat/${chatName}?duration=${duration}`);
    };

    return (
        <div>
            <h2>Создать новый чат</h2>
            <form onSubmit={handleCreateChat}>
                <input
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    placeholder="Введите название чата"
                    required
                />
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value={3600}>1 час</option>
                    <option value={10800}>3 часа</option>
                    <option value={28800}>8 часов</option>
                    <option value={36000}>10 часов</option>
                    <option value={57600}>16 часов</option>
                    <option value={86400}>1 сутки</option>
                    <option value={604800}>1 неделя</option>
                    <option value={2592000}>1 месяц</option>
                </select>
                <button type="submit">Создать чат</button>
            </form>
        </div>
    );
};

export default CreateChat;
