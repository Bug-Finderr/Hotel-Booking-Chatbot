import React from 'react';
import './App.css';

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
                        <div id="submit">⪢</div>
                    </div>
                    <p className="info">Be sure to set up the API key before usage</p>
                </div>
            </section>
        </div>
    );
};

export default App;
