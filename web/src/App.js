import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [todos, setTodos] = useState([])
    const [task, setTask] = useState('')
    const [sent, setSent] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // Load ToDo's
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch('http://localhost:5000/task')

                if (response.ok) {
                    const data = await response.json()
                    // Adicionar a propriedade isChecked a cada tarefa
                    const updatedTodos = data.map((todo) => ({
                        ...todo,
                        isChecked: false,
                    }))
                    setTodos(updatedTodos)
                } else {
                    throw new Error('Something went wrong')
                }
            } catch (error) {
                console.error('An error has occurred:', error)
            }
        }

        fetchTodos()
    }, [sent])

    // when form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault()

        const response = await fetch(`http://localhost:5000/task/${task}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        setSent(!sent) // used to update the useEffect
        return response.json()
    }

    const handleChange = (event) => {
        // updates the task state
        setTask(event.target.value)
    }

    const handleCheckboxChange = async (id) => {
        // Encontrar a tarefa correspondente pelo id
        const updatedTodos = todos.map((todo) => {
            if (todo.Task[0] === id) {
                return {
                    ...todo,
                    isChecked: !todo.isChecked,
                }
            }
            return todo
        })

        setTodos(updatedTodos)

        try {
            const response = await fetch(`http://localhost:5000/task/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: '' }),
            })
        } catch {}
    }

    // AA
    const handleEditClick = (id) => {
        setEditingId(id)
    }

    const handleEditInputChange = (e, id) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.Task[0] === id) {
                return { ...todo, Task: [id, e.target.value] }
            }
            return todo
        })

        setTodos(updatedTodos)
    }

    const handleEditSave = async (id) => {
        console.log('ie');
        setEditingId(null)

        const todo = todos.find((todo) => todo.Task[0] === id)
        if (todo) {
            console.log('ie2');
            try {
                const response = await fetch(
                    `http://localhost:5000/task/${id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ new_text: todo.Task[1] }),
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to update task text')
                }
            } catch (error) {
                console.error('An error occurred:', error)
            }
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Todo List</h1>
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

                <ul>
                    {todos.map((todo) => {
                        const isEditing = todo.Task[0] === editingId
                        const itemClass = todo.isChecked ? 'checked' : ''

                        return (
                            <li key={todo.Task[0]} className={itemClass}>
                                {isEditing ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={todo.Task[1]}
                                            onChange={(e) =>
                                                handleEditInputChange(
                                                    e,
                                                    todo.Task[0]
                                                )
                                            }
                                        />
                                        <button
                                            onClick={() =>
                                                handleEditSave(todo.Task[0])
                                            }
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={todo.isChecked}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    todo.Task[0]
                                                )
                                            }
                                        />
                                        <span>{todo.Task[1]}</span>
                                        <button
                                            onClick={() =>
                                                handleEditClick(todo.Task[0])
                                            }
                                        >
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </header>
        </div>
    )
}

export default App
