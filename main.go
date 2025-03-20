package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type Note struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func displayMenu() {
	fmt.Println("\nChoose an option:")
	fmt.Println("1. Add a new note")
	fmt.Println("2. View all notes")
	fmt.Println("3. Update a note")
	fmt.Println("4. Delete a note")
	fmt.Println("5. Exit")
}

func main() {
	filePath := "notes.json"
	for {
		displayMenu()
		reader := bufio.NewReader(os.Stdin)
		option, _ := reader.ReadString('\n')
		option = strings.TrimSpace(option)

		switch option {
		case "1":
			addNote(filePath)
		case "2":
			viewNotes(filePath)
		case "3":
			updateNote(filePath)
		case "4":
			deleteNote(filePath)
		case "5":
			fmt.Println("Thanks for using our note!")
			return
		default:
			fmt.Println("Invalid option! Please try again.")
		}
	}
}
func addNote(filePath string) {
	fmt.Print("Enter note title: ")
	reader := bufio.NewReader(os.Stdin)
	title, _ := reader.ReadString('\n')
	title = strings.TrimSpace(title)

	fmt.Print("Enter note content: ")
	content, _ := reader.ReadString('\n')
	content = strings.TrimSpace(content)
	notes := loadNotes(filePath)
	id := len(notes) + 1
	note := Note{ID: id, Title: title, Content: content}
	notes = append(notes, note)
	saveNotes(filePath, notes)
	fmt.Println("Note added successfully!")
}
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
	notes := loadNotes(filePath)
	var found bool
	for i, note := range notes {
		if note.ID == id {
			fmt.Print("Enter new title: ")
			title, _ := reader.ReadString('\n')
			title = strings.TrimSpace(title)
			fmt.Print("Enter new content: ")
			content, _ := reader.ReadString('\n')
			content = strings.TrimSpace(content)
			notes[i].Title = title
			notes[i].Content = content
			found = true
			break
		}
	}

	if found {
		saveNotes(filePath, notes)
		fmt.Println("Note updated successfully!")
	} else {
		fmt.Println("Note not found!")
	}
}

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

	notes := loadNotes(filePath)

	var indexToDelete = -1
	for i, note := range notes {
		if note.ID == id {
			indexToDelete = i
			break
		}
	}

	if indexToDelete != -1 {
		notes = append(notes[:indexToDelete], notes[indexToDelete+1:]...)
		saveNotes(filePath, notes)
		fmt.Println("Note deleted successfully!")
	} else {
		fmt.Println("Note not found!")
	}
}
