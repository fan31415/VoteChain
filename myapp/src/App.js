import React from 'react';
import logo from './logo.svg';
import './App.css';
import {RenderNews} from './news';

function App() {
  return (
    <div>
    <div id="test">
      <RenderNews title="ff" content="aa"/>
    </div>

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </div>
  );
}

export default App;
