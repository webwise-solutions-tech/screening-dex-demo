const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

let notes = [];
let currentId = 1;

// @route    POST api/notes
// @desc     Create a note
// @access   Public
router.post('/',
  check('content', 'Content is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body

    try {

      const newNote = {
        id: currentId++,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      notes.push(newNote);
      res.status(201).json(newNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/notes
// @desc     Get all notes
// @access   Public
router.get('/', async (req, res) => {
  try {
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/notes/:id
// @desc     Get note by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const note = notes.find(n => n.id === parseInt(req.params.id));

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/notes/:id
// @desc     Delete a note
// @access   Public
router.delete('/:id', async (req, res) => {
  try {
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (noteIndex === -1) return res.status(404).json({ message: 'Note not found' });
  
    notes.splice(noteIndex, 1);
    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/notes/:id
// @desc     Update a note
// @access   Public
router.put('/:id', async (req, res) => {
  try {
    const note = notes.find(n => n.id === parseInt(req.params.id));

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    const { title, content } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    note.updatedAt = new Date().toISOString();

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
