import React, { useReducer, useState } from 'react';
import './App.css';


const initialState = { todos: [] };


const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      // We can add a new todo item to the list
      return {
        ...state,
        todos: [
          { id: Date.now(), text: action.payload, completed: false },
          ...state.todos
        ]
      };
    case 'SWITCH_TODO':
    
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case 'DELETE_TODO':
      
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    case 'EDIT_TODO':
      
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };
    default:
      throw new Error('Unknown action type');
  }
};


const TodoItem = ({ todo, onEdit, onSwitch, onDelete, isEditing, editText, onTextChange, onSave }) => (
  <li>
    {isEditing ? (
      <>
        <input
          type="text"
          value={editText}
          onChange={onTextChange}
        />
        <button onClick={onSave}>Save</button>
      </>
    ) : (
      <>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onSwitch(todo.id)}
        />
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.text}
        </span>
        <button onClick={() => onEdit(todo.id)}>Edit</button>
        <button
          onClick={() => onDelete(todo.id)}
          disabled={!todo.completed}
        >
          Delete
        </button>
      </>
    )}
  </li>
);


const App = () => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState('');

  // We need a function to add a new todo item
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      dispatch({ type: 'ADD_TODO', payload: newTodo.trim() });
      setNewTodo('');
    }
  };

  
  const handleSwitchTodo = (id) => {
    dispatch({ type: 'SWITCH_TODO', payload: id });
  };


  const handleDeleteTodo = (id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  
  const handleEditTodo = (id) => {
    const todo = state.todos.find(todo => todo.id === id);
    setEditTodoId(id);
    setEditText(todo.text);
  };

  
  const handleSaveEdit = () => {
    dispatch({ type: 'EDIT_TODO', payload: { id: editTodoId, text: editText } });
    setEditTodoId(null);
    setEditText('');
  };

  return (
    <div className="App">
      <h1>My Fun Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {state.todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editTodoId === todo.id}
            editText={editText}
            onEdit={handleEditTodo}
            onSwitch={handleSwitchTodo}
            onDelete={handleDeleteTodo}
            onTextChange={(e) => setEditText(e.target.value)}
            onSave={handleSaveEdit}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
