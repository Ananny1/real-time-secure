package Handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"real-time-secure/Database"
	Helpers "real-time-secure/Helpers"
	"real-time-secure/Models"
	"time"

	"github.com/google/uuid"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("im here")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	fmt.Println("im here1")

	var User Models.User
	err := json.NewDecoder(r.Body).Decode(&User)
	if err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	fmt.Println("im here2")

	if User.FirstName == "" || User.LastName == "" || User.Password == "" || User.Email == "" || User.Gender == "" || User.Age < 13 {
		http.Error(w, "Missing or invalid fields", http.StatusBadRequest)
		return
	}
	fmt.Println("im here3")

	var exists bool
	err = Database.DB.QueryRow(`SELECT EXISTS (SELECT 1 FROM users WHERE email = ?)`, User.Email).Scan(&exists)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}
	fmt.Println("im here4")
	HashedPassword, err := Helpers.HashPassword(User.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	fmt.Println("im here5")

	res, err := Database.DB.Exec(`
		INSERT INTO users (nickname, email, password, gender, age, first_name, last_name)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		User.Nickname, User.Email, HashedPassword, User.Gender, User.Age, User.FirstName, User.LastName,
	)
	fmt.Println("im here6")
	if err != nil {
		fmt.Println("INSERT error:", err) // <-- print the real error
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	fmt.Println("im here7")

	userID, err := res.LastInsertId()
	if err != nil {
		http.Error(w, "Could not get user ID", http.StatusInternalServerError)
		return
	}
	fmt.Println("im here8")

	sessionID := uuid.NewString()
	expiresAt := time.Now().Add(24 * time.Hour)
	_, err = Database.DB.Exec("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
		sessionID, userID, expiresAt)
	if err != nil {
		http.Error(w, "Error creating session", http.StatusInternalServerError)
		return
	}
	fmt.Println("im here9")

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id", // ✅ This is what shows in DevTools
		Value:    sessionID,
		Expires:  expiresAt,
		HttpOnly: true,
		Path:     "/",
	})
	fmt.Println("im here10")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User created successfully",
	})
}
