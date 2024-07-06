import React, {useEffect, useState} from 'react';
import './App.css';

type Chat = {
    title: string;
    role: string;
    content: string;
};

const App: React.FC = () => {
    const [ message, setMessage ] = useState<Chat | null>(null)
    const [ inputVal, setInputVal ] = useState('')
    const [ previousChats, setPreviousChats ] = useState<Chat[]>([])
    const [ currentTitle, setCurrentTitle ] = useState('')

    const createNewChat = () => {
        setMessage(null)
        setInputVal('')
        setCurrentTitle('')
    }

    const handleClick = (title: string) => {
        setCurrentTitle(title)
        setMessage(null)
        setInputVal('')
    }

    const getMessages = async () => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
                message: inputVal     // Will have a message from the input
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch('http://localhost:8000/chat', options)
            const data = await response.json()
            // console.log(data)
            setMessage(data.choices[0].message)
        } catch (error) {
            console.error(error);
        }
    }

    // console.log(message)

    useEffect(() => {
        console.log(currentTitle, inputVal, message)
        if (!currentTitle && inputVal && message) {
            setCurrentTitle(inputVal)
        }
        if (currentTitle && inputVal && message) {
            setPreviousChats(prevChats => ([
                ...prevChats,
                {
                    title: currentTitle,
                    role: 'user',
                    content: inputVal
                },
                {
                    title: currentTitle,
                    role: message.role,
                    content: message.content
                }
            ]))
        }
    }, [ message, currentTitle ])
    
    // console.log(previousChats)

    const currentChats = previousChats.filter(chat => chat.title === currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(chat => chat.title)))

    console.log(uniqueTitles)

    return (
        <div className="app">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New Chat</button>
                <ul className="history">
                    {uniqueTitles?.map((title, index) => <li key={index} onClick={() => handleClick(title)}>{title}</li>)}
                </ul>
                <nav>Made by Bug-Finderr</nav>
            </section>
            <section className="main">
                {!currentTitle && <h1>Chat</h1>}
                <ul className="feed">
                    {currentChats?.map((chatItem, index) => <li key={index}>
                        <p className='role'>{chatItem.role}</p>
                        <p>{chatItem.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={inputVal} onChange={(event) => setInputVal(event.target.value)}/>
                        <div id="submit" onClick={getMessages}>⪢</div>
                    </div>
                    <p className="info">Be sure to set up the API key before usage</p>
                </div>
            </section>
        </div>
    );
};

export default App;
