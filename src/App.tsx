import React from 'react';
import './App.css';

const getMessages = async () => {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            message: 'Hello, sir!'      // Will have a message from the input
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const response = await fetch('http://localhost:8000/chat', options)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error);
    }
}

const App: React.FC = () => {
    return (
        <div className="app">
            <section className="side-bar">
                <button>+ New Chat</button>
                <ul className="history">
                    <li>Test Chat 1</li>
                    <li>Test Chat 2</li>
                    <li>Test Chat 3</li>
                    <li>Test Chat 4</li>
                </ul>
                <nav>Made by Bug-Finderr</nav>
            </section>
            <section className="main">
                <h1>Chat</h1>
                <ul className="feed"></ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input />
                        <div id="submit" onClick={getMessages}>⪢</div>
                    </div>
                    <p className="info">Be sure to set up the API key before usage</p>
                </div>
            </section>
        </div>
    );
};

export default App;
