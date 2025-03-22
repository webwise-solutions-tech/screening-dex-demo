import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

// Define the Note type
interface Note {
  id: number;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [noteIdToFetch, setNoteIdToFetch] = useState<string>('');
  const [singleNote, setSingleNote] = useState<Note | null>(null);
  const [showFetchModal, setShowFetchModal] = useState<boolean>(false);

  const apiUrl = "http://localhost:5025/api";

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch all notes
  const fetchNotes = async () => {
    const response = await fetch(`${apiUrl}/notes`);
    const data: Note[] = await response.json();
    setNotes(data);
  };

  // Fetch a single note by ID
  const fetchNoteById = async () => {
    if (!noteIdToFetch) return;

    const response = await fetch(`${apiUrl}/notes/${noteIdToFetch}`);
    if (response.ok) {
      const data: Note = await response.json();
      setSingleNote(data);
      setShowFetchModal(true); // Show the fetch modal
    } else {
      setSingleNote(null);
      alert('Note not found');
    }
  };

  // Add a new note
  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (response.ok) {
      setTitle('');
      setContent('');
      fetchNotes(); // Refresh the notes list
    }
  };

  // Open edit modal
  const openEditModal = (id: number, title: string, content: string) => {
    setEditId(id);
    setEditTitle(title);
    setEditContent(content);
    setShowEditModal(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Close fetch modal
  const closeFetchModal = () => {
    setShowFetchModal(false);
  };

  // Edit a note
  const editNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;

    const response = await fetch(`${apiUrl}/notes/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    if (response.ok) {
      closeEditModal();
      fetchNotes(); // Refresh the notes list
    }
  };

  // Delete a note
  const deleteNote = async (id: number) => {
    await fetch(`${apiUrl}/notes/${id}`, { method: 'DELETE' });
    fetchNotes(); // Refresh the notes list
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Form to create a new note */}
        <form onSubmit={addNote}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Note
          </Button>
        </form>

        {/* Form to fetch a note by ID */}
        <Box sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Fetch Note by ID"
            value={noteIdToFetch}
            onChange={(e) => setNoteIdToFetch(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchNoteById}
            sx={{ mt: 2 }}
          >
            Fetch Note
          </Button>
        </Box>

        {/* List of all notes */}
        <List sx={{ mt: 4 }}>
          {notes.map((note) => (
            <ListItem key={note.id}>
              <ListItemText primary={note.title} secondary={note.content} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => openEditModal(note.id, note.title, note.content)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteNote(note.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Modal for editing a note */}
      <Dialog open={showEditModal} onClose={closeEditModal}>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <form onSubmit={editNote}>
            <TextField
              fullWidth
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <DialogActions>
              <Button type="submit" color="primary">
                Save Changes
              </Button>
              <Button onClick={closeEditModal} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal for displaying the fetched note */}
      <Dialog open={showFetchModal} onClose={closeFetchModal}>
        <DialogTitle>Fetched Note</DialogTitle>
        <DialogContent>
          {singleNote && (
            <>
              <Typography variant="h6">{singleNote.title}</Typography>
              <Typography>{singleNote.content}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFetchModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notes;