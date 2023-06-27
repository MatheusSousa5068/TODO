import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [todos, setTodos] = useState([])
    const [task, setTask] = useState('')
    const [sent, setSent] = useState(false)

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await 
                  fetch('http://localhost:5000/task')

                if (response.ok) {
                    const data = await response.json()
                    setTodos(data)
                } else {
                    throw new Error('Something went wrong')
                }
            } catch (error) {
                console.error('An error has occurred:', error)
            }
        }

        fetchTodos()
        console.log('as');
    }, [sent])

    const handleSubmit = async (event) => {
        event.preventDefault()

        const response = await fetch(`http://localhost:5000/task/${task}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })


        setSent(!sent)
        console.log(response)
    }

    const handleChange = (event) => {
        setTask(event.target.value)
    }

    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="task">Task</label>
                    <br></br>

                    <input
                        type="text"
                        name="task"
                        id="task"
                        value={task}
                        onChange={handleChange}
                    />
                    <br></br>

                    <input type="submit" value="Submit" />
                </form>

                <h2>Todo List</h2>
                <ul>
                    {todos.map((todo) => {
                        return <li key={todo.Task[0]}>{todo.Task[1]}</li>
                    })}
                </ul>
            </header>
        </div>
    )
}

export default App
