package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// Define the Note structure
type Note struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

// Function to display the menu
func displayMenu() {
	fmt.Println("\nChoose an option:")
	fmt.Println("1. Add a new note")
	fmt.Println("2. View all notes")
	fmt.Println("3. Update a note")
	fmt.Println("4. Delete a note")
	fmt.Println("5. Exit")
}

func main() {
	// File where notes will be stored
	filePath := "notes.json"

	for {
		displayMenu()

		// Reading user input
		reader := bufio.NewReader(os.Stdin)
		option, _ := reader.ReadString('\n')
		option = strings.TrimSpace(option)

		switch option {
		case "1":
			// Add a new note
			addNote(filePath)
		case "2":
			// View all notes
			viewNotes(filePath)
		case "3":
			// Update a note
			updateNote(filePath)
		case "4":
			// Delete a note
			deleteNote(filePath)
		case "5":
			// Exit
			fmt.Println("Thanks for using our note!")
			return
		default:
			fmt.Println("Invalid option! Please try again.")
		}
	}
}

// Function to add a new note
func addNote(filePath string) {
	fmt.Print("Enter note title: ")
	reader := bufio.NewReader(os.Stdin)
	title, _ := reader.ReadString('\n')
	title = strings.TrimSpace(title)

	fmt.Print("Enter note content: ")
	content, _ := reader.ReadString('\n')
	content = strings.TrimSpace(content)

	// Load existing notes
	notes := loadNotes(filePath)

	// Create new note with an ID
	id := len(notes) + 1
	note := Note{ID: id, Title: title, Content: content}

	// Add the new note to the slice
	notes = append(notes, note)

	// Save the updated notes
	saveNotes(filePath, notes)
	fmt.Println("Note added successfully!")
}

// Function to load notes from file
func loadNotes(filePath string) []Note {
	file, err := os.Open(filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return []Note{}
		}
		fmt.Println("Error opening file:", err)
		return nil
	}
	defer file.Close()

	var notes []Note
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&notes)
	if err != nil && err.Error() != "EOF" {
		fmt.Println("Error reading file:", err)
		return nil
	}
	return notes
}

// Function to save notes to a file
func saveNotes(filePath string, notes []Note) {
	file, err := os.Create(filePath)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	err = encoder.Encode(notes)
	if err != nil {
		fmt.Println("Error saving notes:", err)
	}
}

// Function to view all notes
func viewNotes(filePath string) {
	notes := loadNotes(filePath)
	if len(notes) == 0 {
		fmt.Println("No notes found!")
		return
	}

	for _, note := range notes {
		fmt.Printf("ID: %d\nTitle: %s\nContent: %s\n\n", note.ID, note.Title, note.Content)
	}
}

// Function to update a note
func updateNote(filePath string) {
	fmt.Print("Enter the ID of the note to update: ")
	reader := bufio.NewReader(os.Stdin)
	idStr, _ := reader.ReadString('\n')
	idStr = strings.TrimSpace(idStr)

	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		fmt.Println("Invalid ID")
		return
	}

	// Load existing notes
	notes := loadNotes(filePath)

	// Find the note with the given ID
	var found bool
	for i, note := range notes {
		if note.ID == id {
			// Ask for new content
			fmt.Print("Enter new title: ")
			title, _ := reader.ReadString('\n')
			title = strings.TrimSpace(title)

			fmt.Print("Enter new content: ")
			content, _ := reader.ReadString('\n')
			content = strings.TrimSpace(content)

			// Update the note
			notes[i].Title = title
			notes[i].Content = content
			found = true
			break
		}
	}

	if found {
		// Save the updated notes
		saveNotes(filePath, notes)
		fmt.Println("Note updated successfully!")
	} else {
		fmt.Println("Note not found!")
	}
}

// Function to delete a note
func deleteNote(filePath string) {
	fmt.Print("Enter the ID of the note to delete: ")
	reader := bufio.NewReader(os.Stdin)
	idStr, _ := reader.ReadString('\n')
	idStr = strings.TrimSpace(idStr)

	var id int
	_, err := fmt.Sscanf(idStr, "%d", &id)
	if err != nil {
		fmt.Println("Invalid ID")
		return
	}

	// Load existing notes
	notes := loadNotes(filePath)

	// Find and delete the note with the given ID
	var indexToDelete = -1
	for i, note := range notes {
		if note.ID == id {
			indexToDelete = i
			break
		}
	}

	if indexToDelete != -1 {
		// Remove the note from the slice
		notes = append(notes[:indexToDelete], notes[indexToDelete+1:]...)

		// Save the updated notes
		saveNotes(filePath, notes)
		fmt.Println("Note deleted successfully!")
	} else {
		fmt.Println("Note not found!")
	}
}
