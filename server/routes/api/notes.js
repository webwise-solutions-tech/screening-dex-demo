const express = require("express");
const { validateCreateNote, validateUpdateNote, validateNoteId } = require("../../validations/notesValidation");
const validateErrors = require("../../middleware/validateErrors");
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require("../../controllers/notesController");

const router = express.Router();

/**
 * @route   POST api/v1/notes
 * @desc    Create a new note
 * @access  Public
 */
router.post("/", validateCreateNote, validateErrors, createNote);

/**
 * @route   GET api/v1/notes
 * @desc    Get all notes
 * @access  Public
 */
router.get("/", getNotes);

/**
 * @route   GET api/v1/notes/:id
 * @desc    Get a single note by ID
 * @access  Public
 */
router.get("/:id", validateNoteId, validateErrors, getNoteById);

/**
 * @route   PUT api/v1/notes/:id
 * @desc    Update an existing note
 * @access  Public
 */
router.put("/:id", validateUpdateNote, validateErrors, updateNote);

/**
 * @route   DELETE api/v1/notes/:id
 * @desc    Delete a note by ID
 * @access  Public
 */
router.delete("/:id", validateNoteId, validateErrors, deleteNote);

module.exports = router;
