const { body, param } = require("express-validator");

const idValidate = param("id").isInt().withMessage("Note Id must be an integar");

const validateCreateNote = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required")
];

const validateNoteId = [
  idValidate
];

const validateUpdateNote = [
  idValidate,
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty")
];

module.exports = {
  validateCreateNote,
  validateNoteId,
  validateUpdateNote
};