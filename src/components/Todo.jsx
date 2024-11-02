import React, { useEffect, useRef, useState } from "react";
import TodoItems from "./TodoItems";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";

const Todo = () => {
  const [todoList, setTodoList] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredTodoList, setFilteredTodoList] = useState([]);
  const inputRef = useRef();

  const add = () => {
    const inputText = inputRef.current.value.trim();

    if (inputText === "") {
      return null;
    }

    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
      date: currentDate.toLocaleDateString(),
    };
    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };

  const deleteTodo = (id) => {
    setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggle = (id) => {
    setTodoList((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      })
    );
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    const todosForSelectedDate = todoList.filter(
      (todo) => todo.date === currentDate.toLocaleDateString()
    );
    setFilteredTodoList(todosForSelectedDate);
  }, [currentDate, todoList]);

  const calculateProgress = () => {
    if (filteredTodoList.length === 0) return 0;
    const completedTasks = filteredTodoList.filter(
      (todo) => todo.isComplete
    ).length;
    return Math.round((completedTasks / filteredTodoList.length) * 100);
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress <= 33) return "bg-red-500";
    if (progress <= 66) return "bg-yellow-500";
    return "bg-green-500";
  };

  const dayClassName = (date) => {
    const dateString = date.toLocaleDateString();
    return todoList.some((todo) => todo.date === dateString)
      ? "has-todo"
      : undefined;
  };

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
      {/* title */}
      <div className="flex items-center mt-7 gap-2">
        <MdDateRange className="w-8 h-14" />
        <h1 className="text-3xl font-semibold">To-Do List</h1>
        <span className="ml-2 text-gray-500 text-xl">
          {currentDate.toLocaleDateString()}
        </span>
      </div>

      {/* Date picker with highlighted dates */}
      <div className="flex items-center my-4">
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          className="p-2 border border-gray-300 rounded"
          dayClassName={dayClassName}
        />
      </div>

      {/* Progress bar with dynamic color */}
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">完成度</span>
          <span className="text-sm text-gray-600">{calculateProgress()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Input box */}
      <div className="flex items-center my-7 h-9 bg-gray-200 rounded-full">
        <input
          ref={inputRef}
          className="bg-transparent border-0 outline-none flex-1 h-12 pl-6 pr-2 placeholder:text-slate-600"
          type="text"
          placeholder="Add your task"
        />
        <button
          onClick={add}
          className="border-none rounded-full bg-orange-600 w-32 h-9 text-white text-lg font-medium cursor-pointer"
        >
          ADD +
        </button>
      </div>

      {/* Todo list */}
      <div>
        {filteredTodoList.map((item, index) => (
          <TodoItems
            key={index}
            text={item.text}
            id={item.id}
            isComplete={item.isComplete}
            deleteTodo={deleteTodo}
            toggle={toggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Todo;
