import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [chatName, setChatName] = useState('');
    const [chatDuration, setChatDuration] = useState('');
    const navigate = useNavigate();

    const handleCreateChat = () => {
        // Устанавливаем chatActive в localStorage
        localStorage.setItem('chatActive', 'true');

        // Перенаправляем на новый URL
        navigate(`/chat/${chatName}?duration=${chatDuration}`);

        // Сбрасываем значения полей
        setChatName('');
        setChatDuration('');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Создание чата</h1>
            <div>
                <input
                    type="text"
                    placeholder="Имя чата"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <input
                    type="number"
                    placeholder="Время существования (в секундах)"
                    value={chatDuration}
                    onChange={(e) => setChatDuration(e.target.value)}
                    style={{ width: '80%', marginBottom: '10px' }}
                />
                <button onClick={handleCreateChat}>Создать чат</button>
            </div>
        </div>
    );
};

export default Home;
