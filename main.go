package main

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

// Note structure
type Note struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// Global map to store notes in memory (for simplicity)
var notes = make(map[int]Note)
var idCounter = 1
var mu sync.Mutex

func main() {
	// Initialize Gin router
	r := gin.Default()

	// Define the routes
	r.POST("/notes", createNote)
	r.GET("/notes", getNotes)
	r.GET("/notes/:id", getNoteByID)
	r.PUT("/notes/:id", updateNote)
	r.DELETE("/notes/:id", deleteNote)

	r.Run(":8000")
}

func createNote(c *gin.Context) {
	var newNote Note
	if err := c.ShouldBindJSON(&newNote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	mu.Lock()
	newNote.ID = idCounter
	idCounter++
	notes[newNote.ID] = newNote
	mu.Unlock()

	c.JSON(http.StatusCreated, newNote)
}

func getNotes(c *gin.Context) {
	mu.Lock()
	defer mu.Unlock()

	var allNotes []Note
	for _, note := range notes {
		allNotes = append(allNotes, note)
	}

	c.JSON(http.StatusOK, allNotes)
}

func getNoteByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	mu.Lock()
	note, exists := notes[id]
	mu.Unlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}

	c.JSON(http.StatusOK, note)
}

func updateNote(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	mu.Lock()
	note, exists := notes[id]
	mu.Unlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}

	var updatedNote Note
	if err := c.ShouldBindJSON(&updatedNote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	mu.Lock()
	note.Title = updatedNote.Title
	note.Content = updatedNote.Content
	notes[id] = note
	mu.Unlock()

	c.JSON(http.StatusOK, note)
}

func deleteNote(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	mu.Lock()
	_, exists := notes[id]
	if exists {
		delete(notes, id)
	}
	mu.Unlock()

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Note not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}
