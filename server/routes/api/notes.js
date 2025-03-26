const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { HttpStatusCode } = require('axios');
const { randomUUID } = require('crypto');
const {
  formattedResponse,
  formattedException
} = require('../../utils/responses');

const notes = [];

router.get('/', async (req, res) => {
  try {
    formattedResponse(res, HttpStatusCode.Ok, notes);
  } catch (error) {
    console.error(error.message);
    formattedException(res, HttpStatusCode.InternalServerError, error.message);
  }
});

router.get('/:id', async (req, res) => {
  const { id: noteId } = req.params;
  try {
    const existingNote = notes.find((note) => note.id === noteId);

    if (!existingNote) {
      return formattedException(res, HttpStatusCode.NotFound, 'Note not found');
    }

    formattedResponse(res, HttpStatusCode.Ok, existingNote);
  } catch (error) {
    console.error(error.message);
    formattedException(res, HttpStatusCode.InternalServerError, error.message);
  }
});

router.post(
  '/',
  check('content', 'Content required').notEmpty(),
  check('title', 'Title required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return formattedException(res, HttpStatusCode.BadRequest, errors.array());
    }
    const { title, content } = req.body;

    try {
      const persistNote = {
        id: randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      notes.push(persistNote);

      formattedResponse(res, HttpStatusCode.Created, persistNote);
    } catch (error) {
      console.error(error.message);
      formattedException(
        res,
        HttpStatusCode.InternalServerError,
        error.message
      );
    }
  }
);
router.put('/:id', async (req, res) => {
  const { id: existingNoteId } = req.params;
  try {
    const existingNote = notes.find(({ id }) => existingNoteId === id);

    if (!existingNote) {
      return formattedException(res, HttpStatusCode.NotFound, 'Note not found');
    }

    const { title, content } = req.body;

    existingNote.title = title ?? existingNote.title;
    existingNote.content = content ?? existingNote.content;
    existingNote.updatedAt = new Date().toISOString();

    formattedResponse(res, HttpStatusCode.Ok, existingNote);
  } catch (error) {
    console.error(error.message);
    formattedException(res, HttpStatusCode.InternalServerError, error.message);
  }
});

router.delete('/:id', async (req, res) => {
  const { id: existingNoteId } = req.params;
  try {
    const existingNoteIndex = notes.findIndex(
      ({ id }) => existingNoteId === id
    );

    if (existingNoteIndex === -1) {
      return formattedException(res, HttpStatusCode.NotFound, 'Note not found');
    }

    notes.splice(existingNoteIndex, 1);

    formattedResponse(res, HttpStatusCode.Ok, {
      message: 'Note deleted successfully!'
    });
  } catch (error) {
    console.error(error.message);
    formattedException(res, HttpStatusCode.InternalServerError, error.message);
  }
});

module.exports = router;
