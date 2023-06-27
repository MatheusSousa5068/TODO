import logo from './logo.svg'
import './App.css'
import Form from './components/Form';

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
              <Form />
            </header>
        </div>
    )
}

export default App
