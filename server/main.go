package main

import (
	"fmt"
	"net/http"
	"real-time-secure/Database"
	"real-time-secure/Database/migration"
	"real-time-secure/Handlers"

	"github.com/gorilla/mux"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	Database.ConnectDatabase()
	migration.CreateTables()

	r := mux.NewRouter()

	r.Use(corsMiddleware)

	r.PathPrefix("/").Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.WriteHeader(http.StatusNoContent)
	})

	r.HandleFunc("/posts/{id}/comments", Handlers.AddComment).Methods("POST")
	r.HandleFunc("/posts/{id}/comments", Handlers.GetComments).Methods("GET")
	r.HandleFunc("/posts/{id}", Handlers.GetPostByID).Methods("GET")
	r.HandleFunc("/posts", Handlers.GetPostsHandler).Methods("GET")
	r.HandleFunc("/posts", Handlers.CreatePostHandler).Methods("POST")
	r.HandleFunc("/logout", Handlers.LogoutHandler).Methods("POST")
	r.HandleFunc("/", Handlers.HomeHandler).Methods("GET")
	r.HandleFunc("/signup", Handlers.SignUpHandler).Methods("POST")
	r.HandleFunc("/login", Handlers.SignInHandler).Methods("POST")
	// r.HandleFunc("/posts/{id}/like", LikePostHandler).Methods("POST")

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))
	r.PathPrefix("/uploads/").Handler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	fmt.Println("Server is running on port 8080")
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		fmt.Println("Failed to start server:", err)
	}
}
