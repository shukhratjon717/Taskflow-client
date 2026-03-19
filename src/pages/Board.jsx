import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function Board() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // 🔄 tasks olish (NO WARNING)
  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTasks();
  }, [id]); // ✅ faqat id

  // ➕ task qo‘shish
  const createTask = async () => {
    if (!title) return;

    await API.post("/tasks", {
      title,
      boardId: id,
    });

    setTitle("");
    fetchTasks(); // 🔥 qayta yuklash
  };

  // 🔄 status update
  const updateStatus = async (taskId, status) => {
    await API.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  // 📦 group
  const group = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Board</h2>

      {/* Add task */}
      <div className="flex gap-2 mb-6">
        <input
          className="p-2 border rounded w-64"
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createTask}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Columns */}
      <div className="flex gap-4">

        {/* TODO */}
        <div className="bg-gray-200 p-4 rounded w-1/3">
          <h3 className="font-bold mb-3">TODO</h3>

          {group("todo").map((t) => (
            <div
              key={t._id}
              className="bg-white p-3 mb-2 rounded shadow flex justify-between"
            >
              {t.title}
              <button
                onClick={() => updateStatus(t._id, "in-progress")}
                className="text-blue-500"
              >
                →
              </button>
            </div>
          ))}
        </div>

        {/* IN PROGRESS */}
        <div className="bg-gray-200 p-4 rounded w-1/3">
          <h3 className="font-bold mb-3">IN PROGRESS</h3>

          {group("in-progress").map((t) => (
            <div
              key={t._id}
              className="bg-white p-3 mb-2 rounded shadow flex justify-between"
            >
              {t.title}
              <button
                onClick={() => updateStatus(t._id, "done")}
                className="text-green-500"
              >
                →
              </button>
            </div>
          ))}
        </div>

        {/* DONE */}
        <div className="bg-gray-200 p-4 rounded w-1/3">
          <h3 className="font-bold mb-3">DONE</h3>

          {group("done").map((t) => (
            <div
              key={t._id}
              className="bg-white p-3 mb-2 rounded shadow"
            >
              {t.title}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}