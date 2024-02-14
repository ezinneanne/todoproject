import express from "express";
import bodyParser from "body-parser"; // Add this line for handling JSON data in requests

const app = express(); // Create an Express app instance

app.use(bodyParser.json());
 
// Define the array to store todos
let todos = [
  { id: 1, contents: "Study cloud computing", completed: false },
  { id: 2, contents: "Writing web documentation", completed: false },
  { id: 3, contents: "Writing tech article", completed: true },
  { id: 4, contents: "Volunteer work", completed: false },
  { id: 5, contents: "Bible study", completed: true }
];

// Create an API route to get todos
app.get('/api/todos', (req, res) => {
    try {
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Create an API route to add a new todo
app.post('/api/todos', (req, res) => {
  const newTodo = req.body;
  newTodo.id = Date.now();
  todos.push(newTodo);
  res.json(newTodo);
});

// Create an API route to remove a todo by ID
app.delete('/api/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 5174; // Use the provided PORT or a default value
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
