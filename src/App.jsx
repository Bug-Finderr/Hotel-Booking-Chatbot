import React, { useState, useEffect } from 'react';
import './App.css';
import bot from './assets/bot2.png';


const App = () => {
    const [, setMessage] = useState(null);
    const [inputVal, setInputVal] = useState('');
    const [previousChats, setPreviousChats] = useState([]);
    const [currentTitle, setCurrentTitle] = useState('');

    const createNewChat = () => {
        setMessage(null);
        setInputVal('');
        setCurrentTitle('');
    };

    const handleClick = (title) => {
        setCurrentTitle(title);
        setMessage(null);
        setInputVal('');
    };

    const getMessages = async (messages) => {
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
            title: currentTitle || inputVal,
            role: 'user',
            content: inputVal,
        };

        setInputVal('');

        const updatedChats = [...previousChats, newMessage];

        setPreviousChats(updatedChats);

        const formattedMessages = updatedChats.filter(chat => chat.title === (currentTitle || inputVal)).map((message) => ({
            role: message.role,
            content: message.content,
        }));

        const response = await getMessages(formattedMessages);

        setPreviousChats((prevChats) => [
            ...prevChats,
            {
                title: currentTitle || inputVal,
                role: 'assistant',
                content: response.content,
            },
        ]);

        setMessage(response);

        if (!currentTitle) {
            setCurrentTitle(inputVal);
        }
    };

    const currentChats = previousChats.filter((chat) => chat.title === currentTitle);
    const uniqueTitles = Array.from(new Set(previousChats.map((chat) => chat.title)));

    useEffect(() => {
        const feed = document.querySelector('.feed');
        if (feed) {
          feed.scrollTop = feed.scrollHeight;
        }
    }, [currentChats]); // Automatically scroll down when currentChats updates

    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New Chat</button>
                <ul className="history">
                    {uniqueTitles.map((title, index) => (
                        <li key={index} onClick={() => handleClick(title)}>
                            {title.split(' ').slice(0, 3).join(' ')}
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
                            {/* <p className='role'>{chatItem.role}</p> */}
                            <p>{chatItem.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="bottom-section">
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
