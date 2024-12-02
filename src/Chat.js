import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chat = () => {
    const { name } = useParams();
    const query = new URLSearchParams(window.location.search);
    const duration = parseInt(query.get('duration'), 10) || 60;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]); // Массив для файлов
    const [isChatActive, setIsChatActive] = useState(true);
    const [remainingTime, setRemainingTime] = useState(duration);
    const navigate = useNavigate();

    useEffect(() => {
        const chatActive = localStorage.getItem('chatActive');
        if (chatActive === 'false') {
            navigate('/');
        }

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsChatActive(false);
                    localStorage.setItem('chatActive', 'false');
                    navigate('/');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const languageDetector = (code) => {
        const languages = {
            javascript: /^(const|let|var|function|=>|class|import|export|console\.log)/,
            python: /^(\s*def\s+|import\s+|print\s*\(|\s*class\s+|self)/,
            java: /^\s*(public|private|protected|class|static|void|import|System\.out\.println)/,
            csharp: /^\s*(using\s+|namespace\s+|class\s+|public\s+|private\s+|static|void)/,
            html: /^\s*<html>/,
            css: /^\s*{.*}/,
            php: /^\s*<\?php|^\s*\$|^\s*echo /,
            ruby: /^\s*def\s+|^\s*class\s+/,
        };

        for (const [language, regex] of Object.entries(languages)) {
            if (regex.test(code)) {
                return language;
            }
        }
        return 'plaintext';
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() || files.length > 0) {
            const detectedLanguage = languageDetector(message);
            const newMessage = {
                text: message,
                files: files,
                language: detectedLanguage,
            };
            setMessages([...messages, newMessage]);
            setMessage('');
            setFiles([]); // Очищаем массив файлов
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    if (!isChatActive) {
        return null;
    }

    return (
        <div>
            <h2>Чат: {name}</h2>
            <p style={{ color: remainingTime < 10 ? 'red' : 'black' }}>
                Оставшееся время: {remainingTime} секунд
            </p>
            <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'scroll' }}>
                <h3>Сообщения:</h3>
                {messages.length === 0 ? (
                    <p>Нет сообщений</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <strong>Пользователь:</strong>
                            {msg.language !== 'plaintext' ? (
                                <div>
                                    <SyntaxHighlighter language={msg.language} style={solarizedlight}>
                                        {msg.text}
                                    </SyntaxHighlighter>
                                    <p>Определенный язык: {msg.language}</p>
                                </div>
                            ) : (
                                <div>
                                    <pre>{msg.text}</pre>
                                </div>
                            )}
                            {msg.files.length > 0 && (
                                <div>
                                    <strong>Файлы:</strong>
                                    {msg.files.map((file, fileIndex) => (
                                        <div key={fileIndex}>
                                            <a href={URL.createObjectURL(file)} download={file.name}>
                                                {file.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} style={{ marginTop: '10px' }}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите ваше сообщение"
                    rows="5"
                    style={{ width: '60%', marginRight: '10px', resize: 'none' }}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple // Позволяет выбирать несколько файлов
                    style={{ marginRight: '10px' }}
                />
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

export default Chat;
