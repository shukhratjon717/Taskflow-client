import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getBoards();
  }, []);

  // 📥 GET
  const getBoards = async () => {
    try {
      const res = await API.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.log("GET ERROR:", err);
    }
  };

  // ➕ CREATE
  const createBoard = async () => {
    if (!title) return;

    try {
      await API.post("/boards", { title });
      setTitle("");
      getBoards();
    } catch (err) {
      console.log("CREATE ERROR:", err);
    }
  };

  // ❌ DELETE
  const deleteBoard = async (id) => {
    try {
      await API.delete(`/boards/${id}`);
      getBoards();
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // ✏️ UPDATE
  const updateBoard = async (id) => {
    const newTitle = prompt("Yangi nom kiriting:");
    if (!newTitle) return;

    try {
      await API.put(`/boards/${id}`, { title: newTitle });
      getBoards();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  // 🔥 DRAG
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(boards);
    const [moved] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, moved);

    setBoards(items);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🚀 Task Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* CREATE */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 flex gap-2">
        <input
          className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New board title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={createBoard}
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* DRAG AREA */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="boards">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {boards.map((b, index) => (
                <Draggable
                  key={b._id}
                  draggableId={b._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-4 rounded-2xl flex items-center justify-between transition 
                      ${
                        snapshot.isDragging
                          ? "bg-blue-50 shadow-2xl scale-105"
                          : "bg-white shadow-md hover:shadow-xl"
                      }`}
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-3">
                        {/* NUMBER */}
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold">
                          {index + 1}
                        </div>

                        {/* TITLE */}
                        <h2 className="font-semibold text-gray-800">
                          {b.title}
                        </h2>
                      </div>

                      {/* RIGHT */}
                      <div className="flex items-center gap-2">
                        {/* DRAG ICON */}
                        <span
                          {...provided.dragHandleProps}
                          className="cursor-grab text-gray-400 hover:text-gray-600"
                        >
                          ☰
                        </span>

                        {/* EDIT */}
                        <button
                          onClick={() => updateBoard(b._id)}
                          className="bg-yellow-400 px-3 py-1 rounded-lg text-sm hover:bg-yellow-500"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteBoard(b._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}