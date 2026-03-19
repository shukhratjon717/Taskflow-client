import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getBoards();
  }, []);

  // 📥 GET BOARDS
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
    const newTitle = prompt("Yangi board nomi:");

    if (!newTitle) return;

    try {
      await API.put(`/boards/${id}`, { title: newTitle });
      getBoards();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
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
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* CREATE BOARD */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="New board title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={createBoard}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* BOARDS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {boards.map((b) => (
          <div
            key={b._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <h2 className="text-lg font-semibold">{b.title}</h2>

            <div className="flex gap-2">
              {/* UPDATE */}
              <button
                onClick={() => updateBoard(b._id)}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={() => deleteBoard(b._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}