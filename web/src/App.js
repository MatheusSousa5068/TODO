import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [sent, setSent] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load ToDo's
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:5000/task');

        if (response.ok) {
          const data = await response.json();
          // Adicionar a propriedade isChecked a cada tarefa
          const updatedTodos = data.map((todo) => ({
            ...todo,
            isChecked: false,
          }));
          setTodos(updatedTodos);
        } else {
          throw new Error('Something went wrong');
        }
      } catch (error) {
        console.error('An error has occurred:', error);
      }
    };

    fetchTodos();
  }, [sent]);

  // when form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`http://localhost:5000/task/${task}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setSent(!sent); // used to update the useEffect
    return response.json();
  };

  const handleChange = (event) => {
    // updates the task state
    setTask(event.target.value);
  };

  const handleCheckboxChange = async (id) => {
    // Encontrar a tarefa correspondente pelo id
    const updatedTodos = todos.map((todo) => {
      if (todo.Task[0] === id) {
        return {
          ...todo,
          isChecked: !todo.isChecked,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);

    try {
      const response = await fetch(`http://localhost:5000/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: '' }),
      });
    } catch {}
  };

  // AA
  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const handleEditInputChange = (e, id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.Task[0] === id) {
        return { ...todo, Task: [id, e.target.value] };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleEditSave = async (id) => {
    setEditingId(null);

    const todo = todos.find((todo) => todo.Task[0] === id);
    if (todo) {
      try {
        const response = await fetch(`http://localhost:5000/task/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_text: todo.Task[1] }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task text');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await fetch(`http://localhost:5000/task/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSent(!sent); // used to update the useEffect
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="task" className="form-label">
              Task
            </label>
            <input
              type="text"
              name="task"
              id="task"
              value={task}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <ul className="list-group mt-4">
          {todos.map((todo) => {
            const isEditing = todo.Task[0] === editingId;
            const itemClass = todo.isChecked ? 'checked' : '';

            return (
              <li
                key={todo.Task[0]}
                className={`list-group-item d-flex align-items-center ${itemClass}`}
              >
                {isEditing ? (
                  <div className="d-flex align-items-center flex-grow-1">
                    <input
                      type="text"
                      value={todo.Task[1]}
                      onChange={(e) => handleEditInputChange(e, todo.Task[0])}
                      className="form-control"
                    />
                    <button
                      onClick={() => handleEditSave(todo.Task[0])}
                      className="btn btn-primary mx-2"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="d-flex align-items-center flex-grow-1">
                    <input
                      type="checkbox"
                      checked={todo.isChecked}
                      onChange={() => handleCheckboxChange(todo.Task[0])}
                      className="form-check-input"
                    />
                    <span className="ms-2">{todo.Task[1]}</span>
                  </div>
                )}
                <button
                  onClick={() => handleEditClick(todo.Task[0])}
                  className="btn btn-secondary mx-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(todo.Task[0])}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

export default App;
