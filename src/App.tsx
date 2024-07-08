import React, { useState } from 'react';
import './App.css';
import bot from './assets/bot2.png';

type Chat = {
    title: string;
    role: string;
    content: string;
};

const App: React.FC = () => {
    const [, setMessage] = useState<Chat | null>(null);
    const [inputVal, setInputVal] = useState('');
    const [previousChats, setPreviousChats] = useState<Chat[]>([]);
    const [currentTitle, setCurrentTitle] = useState('');

    const createNewChat = () => {
        setMessage(null);
        setInputVal('');
        setCurrentTitle('');
    };

    const handleClick = (title: string) => {
        setCurrentTitle(title);
        setMessage(null);
        setInputVal('');
    };

    const getMessages = async (messages: { role: string; content: string }[]) => {
        const options = {
            method: 'POST',
            body: JSON.stringify({ messages }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch('http://localhost:8000/chat', options);
            const data = await response.json();
            return data.newMessage;
        } catch (error) {
            console.error(error);
        }
    };

    const formSubmit = async () => {
        const newMessage = {
            title: currentTitle,
            role: 'user',
            content: inputVal,
        };

        setInputVal('');

        const updatedChats = [...previousChats, newMessage];

        setPreviousChats(updatedChats);

        const formattedMessages = updatedChats.map((message) => ({
            role: message.role,
            content: message.content,
        }));

        const response = await getMessages(formattedMessages);

        setPreviousChats((prevChats) => [
            ...prevChats,
            {
                title: currentTitle,
                role: 'assistant',
                content: response.content,
            },
        ]);

        setMessage(response);
    };

    const currentChats = previousChats.filter((chat) => chat.title === currentTitle);
    const uniqueTitles = Array.from(new Set(previousChats.map((chat) => chat.title)));

    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New Chat</button>
                <ul className="history">
                    {uniqueTitles.map((title, index) => (
                        <li key={index} onClick={() => handleClick(title)}>
                            {title}
                        </li>
                    ))}
                </ul>
                <nav>Made by Bug-Finderr</nav>
            </section>
            <section className="main">
                {!currentTitle && <h1>Chat</h1>}
                <ul className="feed">
                    {currentChats.map((chatItem, index) => (
                        <li key={index}>
                            <img src={bot} alt='assistant'/>
                            <p>{chatItem.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="bottom-section">
                    {/* <div className="input-container">
                        <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                        <div id="submit" onClick={formSubmit}>
                            ⪢
                        </div>
                    </div> */}
                    <form className="input-container" onSubmit={(e) => {
                        e.preventDefault(); // Prevent the default form submission
                        formSubmit(); // Call your formSubmit function
                    }}>
                        <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                        <div id="submit" onClick={formSubmit}>
                            ⪢
                        </div>
                    </form>
                    <p className="info">Be sure to set up the API key before usage</p>
                </div>
            </section>
        </div>
    );
};

export default App;
