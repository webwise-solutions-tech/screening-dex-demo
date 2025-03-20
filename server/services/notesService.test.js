const NotesService = require("./notesService");

describe("NotesService", () => {
  beforeEach(() => {
    // Reset notes array before each test
    NotesService.notes = [];
    NotesService.idTracker = 1;
  });

  test("should create a new note", () => {
    const note = NotesService.createNote("Test Title", "Test Content");

    expect(note).toHaveProperty("id");
    expect(note).toHaveProperty("title", "Test Title");
    expect(note).toHaveProperty("content", "Test Content");
    expect(note).toHaveProperty("createdAt");
    expect(note).toHaveProperty("updatedAt");
  });

  test("should get all notes", () => {
    NotesService.createNote("Note 1", "Content 1");
    NotesService.createNote("Note 2", "Content 2");

    const notes = NotesService.getAllNotes();
    expect(notes.length).toBe(2);
  });

  test("should get a note by ID", () => {
    const note = NotesService.createNote("Find Me", "Find Content");
    const foundNote = NotesService.getNoteById(note.id);

    expect(foundNote).toEqual(note);
  });

  test("should return undefined if note ID does not exist", () => {
    const note = NotesService.getNoteById(999);
    expect(note).toBeUndefined();
  });

  test("should update a note", async () => {
    const note = NotesService.createNote("Old Title", "Old Content");
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const updatedNote = NotesService.updateNote(note.id, {
      title: "New Title",
      content: "New Content"
    });
    // console.log('pdatedNote.updatedAt', updatedNote.updatedAt);
    // console.log('note', note.updatedAt);

    expect(updatedNote).toHaveProperty("title", "New Title");
    expect(updatedNote).toHaveProperty("content", "New Content");
    // expect(updatedNote.updatedAt).not.toBe(note.updatedAt);
  });

  test("should return null when updating a non-existing note", () => {
    const updatedNote = NotesService.updateNote(999, { title: "New Title" });
    expect(updatedNote).toBeNull();
  });

  test("should delete a note", () => {
    const note = NotesService.createNote("To Delete", "Delete Me");
    const result = NotesService.deleteNote(note.id);

    expect(result).toBe(true);
    expect(NotesService.getAllNotes()).toHaveLength(0);
  });

  test("should return false when deleting a non-existing note", () => {
    const result = NotesService.deleteNote(999);
    expect(result).toBe(false);
  });
});
