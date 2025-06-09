package Handlers

import (
	"encoding/json"
	"net/http"
	"real-time-secure/Database"
	"real-time-secure/Models"
	"strconv"

	"github.com/gorilla/mux"
)

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	posts := []Models.Post{}
	rows, err := Database.DB.Query(
		"SELECT id, user_id, username, title, content, image, created_at, like_count FROM posts ORDER BY created_at DESC",
	)
	if err != nil {
		http.Error(w, "Error fetching posts", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var post Models.Post
		err := rows.Scan(&post.ID, &post.UserID, &post.Username, &post.Title, &post.Content, &post.Image, &post.CreatedAt, &post.LikeCount)
		if err != nil {
			continue
		}
		posts = append(posts, post)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func GetPostByID(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	vars := mux.Vars(r)
	id := vars["id"]

	postID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}
	var post Models.Post
	err = Database.DB.QueryRow(
		"SELECT id, user_id, username, title, content, image, created_at, like_count FROM posts WHERE id = ?",
		postID,
	).Scan(&post.ID, &post.UserID, &post.Username, &post.Title, &post.Content, &post.Image, &post.CreatedAt, &post.LikeCount)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}
