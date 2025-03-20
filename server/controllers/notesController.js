const noteService = require('../services/notesService');
const serverError = require('../helpers/utils')

const createNote = (req, res) => {
  const { title, content } = req.body;
  try {
    const note = noteService.createNote(title, content);
    return res.status(201).json(note);
  }catch(e) {
    return serverError(res, e);
  }
}

const getNotes = (req, res) => {
  try {
    const notes = noteService.getAllNotes();
    return res.status(200).json(notes);
  }catch(e) {
    return serverError(res, e);
  }
}

const getNoteById = (req, res) => {
  try {
    const note = noteService.getNoteById(parseInt(req.params.id));
    if (!note) return res.status(404).json({ message: "Note not found" });
    return res.status(200).json(note);
  }catch(e) {
    return serverError(res, e);
  }
}

const updateNote = (req, res) => {
  const { id } = req.params;
  try {
    const updatedNote = noteService.updateNote(parseInt(id), req.body);
    if (!updatedNote) return res.status(400).json({ message: "Invalid note Id provided" });
    return res.status(200).json(updatedNote);
  }catch(e) {
    return serverError(res, e);
  }
}

const deleteNote = (req, res) => {
  try {
    // return res.status(200).json({ m: parseInt(req.params.id) });
    const deletedNote = noteService.deleteNote(parseInt(req.params.id));
    if (!deletedNote) return res.status(400).json({ message: "Invalid note Id provided"});
    return res.status(204).send();
  }catch(e){
    return serverError(res, e);
  }
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
}