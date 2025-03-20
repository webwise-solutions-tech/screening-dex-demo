const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for notes
const notesStore = {}; // { id: { title: "...", content: "..." } }
let nextId = 1; // Auto-incrementing ID

// Create a new note (POST /notes)
app.post("/notes", (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }
    const id = nextId++;
    notesStore[id] = { title, content };
    res.status(201).json({ id, message: "Note created successfully" });
});

// Get all notes (GET /notes)
app.get("/notes", (req, res) => {
    res.json(notesStore);
});

// Get a specific note by ID (GET /notes/:id)
app.get("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!notesStore[id]) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.json({ id, ...notesStore[id] });
});

// Update a note by ID (PUT /notes/:id)
app.put("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!notesStore[id]) {
        return res.status(404).json({ error: "Note not found" });
    }
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }
    notesStore[id] = { title, content };
    res.json({ message: "Note updated successfully" });
});

// Delete a note by ID (DELETE /notes/:id)
app.delete("/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (!notesStore[id]) {
        return res.status(404).json({ error: "Note not found" });
    }
    delete notesStore[id];
    res.json({ message: "Note deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
