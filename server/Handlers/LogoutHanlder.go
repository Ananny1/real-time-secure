package Handlers

import (
	"net/http"
	"real-time-secure/Database"
	"time"
)

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	sessionIDCookie, err := r.Cookie("session_id")
	if err == nil {
		_, err = Database.DB.Exec("DELETE FROM sessions WHERE id = ?", sessionIDCookie.Value)
		if err != nil {
			http.Error(w, "Failed to delete session", http.StatusInternalServerError)
			return
		}
	}

	// Clear the session_id cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0), // Expire immediately
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	// Optional: Clear any other cookies like AuthCookie
	http.SetCookie(w, &http.Cookie{
		Name:     "AuthCookie",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Logged out"))
}
