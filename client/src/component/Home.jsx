import React, { useState, useEffect } from "react";
import CreatePostButton from "./CreatePostButton";
import likeIcon from "/static/icons/like.svg";
import "../../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);

  // Load posts from backend when Home loads
  useEffect(() => {
    fetch("http://localhost:8080/posts", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts", err));
  }, []);

  function handleAddPost(post) {
    setPosts(prev => [post, ...prev]);
  }

  function handleLike(idx, e) {
    e.preventDefault();
    e.stopPropagation();
    setPosts(prev =>
      prev.map((post, i) =>
        i === idx ? { ...post, liked: !post.liked } : post
      )
    );
  }

  return (
    <div className="home-container">
      {posts.map((post, idx) => (
        <Link
          to={`/posts/${post.id}`}
          className="post-link"
          key={post.id || idx}
        >
          <div className="post-card">
            <img
              src={
                post.image
                  ? (post.image.startsWith("http")
                    ? post.image
                    : post.image.startsWith("/")
                      ? `http://localhost:8080${post.image}`
                      : `http://localhost:8080/uploads/${post.image}`)
                  : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              }
              alt="Post visual"
              className="post-image"
            />

            <div className="post-title">{post.title}</div>
            <div className="post-body">{post.content}</div>
            <div className="post-meta">
              Posted by <b>{post.username}</b> • {post.created_at}
            </div>
            <button
              className={`like-btn${post.liked ? " liked" : ""}`}
              onClick={e => handleLike(idx, e)}
              aria-label="Like"
            >
              <img src={likeIcon} alt="Like" className="like-icon" />
            </button>
          </div>
        </Link>
      ))}
      <CreatePostButton onPost={handleAddPost} />
    </div>
  );
}
