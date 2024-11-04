import React, { useEffect, useRef, useState } from "react";
import TodoItems from "./TodoItems";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Todo = () => {
  const [todoList, setTodoList] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const inputRef = useRef();

  const add = () => {
    const inputText = inputRef.current.value.trim();
    if (inputText === "") return;

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
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  const calculateProgress = (date) => {
    const tasksForDate = todoList.filter(
      (todo) => todo.date === date.toLocaleDateString()
    );
    if (tasksForDate.length === 0) return 0;
    const completedTasks = tasksForDate.filter(
      (todo) => todo.isComplete
    ).length;
    return Math.round((completedTasks / tasksForDate.length) * 100);
  };

  const getDayClassName = (date) => {
    const tasksForDate = todoList.filter(
      (todo) => todo.date === date.toLocaleDateString()
    );
    if (tasksForDate.length === 0) return "";

    const progress = calculateProgress(date);
    if (progress === 100) return "bg-green-500 text-white";
    if (progress >= 50) return "bg-yellow-500 text-white";

    return "bg-red-500 text-white";
  };

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
      <div className="flex items-center mt-7 gap-2">
        <MdDateRange className="w-8 h-14" />
        <h1 className="text-3xl font-semibold">To-Do List (test)</h1>
        <span className="ml-2 text-gray-500 text-xl">
          {currentDate.toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center my-4">
        <DatePicker
          selected={currentDate}
          onChange={(date) => setCurrentDate(date)}
          dayClassName={(date) => getDayClassName(date)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">完成度</span>
          <span className="text-sm text-gray-600">
            {calculateProgress(currentDate)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${
              calculateProgress(currentDate) === 100
                ? "bg-green-500"
                : calculateProgress(currentDate) >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${calculateProgress(currentDate)}%` }}
          ></div>
        </div>
      </div>

      {/* input box */}
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

      {/* todo list */}
      <div>
        {todoList
          .filter((item) => item.date === currentDate.toLocaleDateString())
          .map((item) => (
            <TodoItems
              key={item.id}
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
