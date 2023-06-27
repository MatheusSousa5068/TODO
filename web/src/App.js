import logo from './logo.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

function App() {

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/task');
      if (response.ok) {
        const data = await response.json();

        for(let item of data) {
          console.table(item);
        }
       

      } else {
        throw new Error('Erro na requisição');
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  };


    return (
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
                <button onClick={fetchData}>
                Test-me
                </button>
            </header>
        </div>
    )
}

export default App
