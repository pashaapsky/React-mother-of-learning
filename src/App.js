import React, {useEffect} from "react";
import TodoList from "./Todo/TodoList";
import Context from "./context";
import Loader from "./Loader";
import Modal from "./Modal/Modal";

// Lazy load AddTodo
// import AddTodo from "./Todo/addTodo";
const AddTodo = React.lazy(() =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(import('./Todo/addTodo'));
    }, 3000)
  })
);

function App() {
    // без сервера
    // const [todos, setTodos] = React.useState([
    //     {id: 1, completed: false, title: 'Купить хлеб'},
    //     {id: 2, completed: true, title: 'Купить масло'},
    //     {id: 3, completed: false, title: 'Купить молоко'},
    // ]);

    // запрос данных с сервера вместо default state
    const [todos, setTodos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
            .then(response => response.json())
            .then(todos => {
                setTimeout(() => {
                    setTodos(todos);
                    setLoading(false);
                }, 2000);
            })
    }, []);

    function toggleTodo(id) {
        setTodos(
            todos.map(todo => {
                if (todo.id === id) {
                    todo.completed = !todo.completed
                }

                return todo
            })
        )
    }

    function removeTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function addTodo(title) {
        setTodos(todos.concat([{
            title,
            id: Date.now(),
            completed: false
        }]))
    }

    return (
        <Context.Provider value={{removeTodo}}>
            <div className="wrapper">
                <h1>React mother of learning #1</h1>

                <Modal />

                <React.Suspense fallback={<Loader/>}>
                    <AddTodo onCreate={addTodo}/>
                </React.Suspense>

                {loading && <Loader/>}

                {todos.length ? (
                    <TodoList todos={todos} onToggle={toggleTodo}/>
                ) : (
                    loading ? null : <p>No Todos Yet</p>
                )}
            </div>
        </Context.Provider>
    );
}

export default App;
