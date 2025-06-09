package Handlers

import "net/http"

func UnlikePostHandler(w http.ResponseWriter, r *http.Request) {
	// Get user ID from session/context
	// Get post ID from URL
	// DELETE FROM likes WHERE user_id=? AND post_id=?
}
