import React, { useState } from 'react'

function Form() {
    const [task, setTask] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const response = await fetch(`http://localhost:5000/task/${task}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        console.log(response)
    }

    const handleChange = (event) => {
        setTask(event.target.value);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="task">Task</label>
                <br></br>

                <input type="text" name="task" id="task" value={task} onChange={handleChange}/>
                <br></br>

                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Form
