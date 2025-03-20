const NotesController = require("../notesController");
const NotesService = require("../../services/notesService");

jest.mock("../../services/notesService");

describe("NotesController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test("should create a note", async () => {
    const mockNote = { id: 1, title: "Test", content: "Test Content" };
    NotesService.createNote.mockReturnValue(mockNote);

    req.body = { title: "Test", content: "Test Content" };
    await NotesController.createNote(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockNote);
  });

  test("should get all notes", async () => {
    const mockNotes = [{ id: 1, title: "Test", content: "Test Content" }];
    NotesService.getAllNotes.mockReturnValue(mockNotes);

    await NotesController.getNotes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockNotes);
  });

  test("should get a note by ID", async () => {
    const mockNote = { id: 1, title: "Test", content: "Test Content" };
    NotesService.getNoteById.mockReturnValue(mockNote);

    req.params.id = "1";
    await NotesController.getNoteById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockNote);
  });

  test("should return 404 if note is not found", async () => {
    NotesService.getNoteById.mockReturnValue(null);

    req.params.id = "999";
    await NotesController.getNoteById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Note not found" });
  });

  test("should update a note", async () => {
    const mockUpdatedNote = { id: 1, title: "Updated", content: "Updated Content" };
    NotesService.updateNote.mockReturnValue(mockUpdatedNote);

    req.params.id = "1";
    req.body = { title: "Updated", content: "Updated Content" };
    await NotesController.updateNote(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedNote);
  });

  test("should return 400 if trying to update a non-existing note", async () => {
    NotesService.updateNote.mockReturnValue(null);

    req.params.id = "999";
    req.body = { title: "Updated" };
    await NotesController.updateNote(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid note Id provided" });
  });

  test("should delete a note", async () => {
    NotesService.deleteNote.mockReturnValue(true);

    req.params.id = "1";
    await NotesController.deleteNote(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  test("should return 400 when deleting a non-existing note", async () => {
    NotesService.deleteNote.mockReturnValue(false);

    req.params.id = "999";
    await NotesController.deleteNote(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid note Id provided" });
  });
});
