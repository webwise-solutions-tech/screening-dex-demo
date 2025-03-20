class NotesService {

  static notes = [];
  static idTracker = 1;

  static createNote(title, content) {
    const timestamp = new Date().toISOString();
    const newNote = {
      id: this.idTracker++,
      title,
      content,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.notes.push(newNote);
    return newNote;
  }

  static getAllNotes() {
    return this.notes;
  }

  static getNoteById(id) {
    return this.notes.find(note => note.id === id);
  }

  static updateNote(id, { title, content }) {
    const note = this.notes.find(n => n.id === id);
    if (!note) return null;

    note.title = title || this.note.title;
    note.content = content || this.note.content;
    note.updatedAt = new Date().toISOString();

    return note;
  }

  static deleteNote(id) {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return false;

    this.notes.splice(index, 1);
    return true;
  }
}

module.exports = NotesService;
