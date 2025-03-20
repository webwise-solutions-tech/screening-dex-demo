import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5025/api/v1/";

// Note Type
interface Note {
  id: number;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Fetch all notes
  const fetchNotes = async (): Promise<void> => {
    try {
      const response = await fetch(API_BASE_URL);
      const data: Note[] = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create or Update Note
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const noteData = { title, content };

    try {
      if (editingNote) {
        // Update existing note
        await fetch(`${API_BASE_URL}${editingNote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        setEditingNote(null);
      } else {
        // Create new note
        await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }
      setTitle("");
      setContent("");
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Delete Note
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}${id}`, { method: "DELETE" });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit Note
  const handleEdit = (note: Note): void => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div>
      <h1>Notes App</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {editingNote ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      <ul style={{width: "70%", margin: "50px auto"}}>
        {notes.map((note) => (
          <li key={note.id} style={{display: "flex", border: "1px solid", marginBottom: '5px', padding: "5px", justifyContent: "space-between"}} className="border p-2 mb-2 flex justify-between">
            <div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(note)}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
