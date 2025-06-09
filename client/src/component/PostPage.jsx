import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../styles/Home.css';

export default function PostPage() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [postError, setPostError] = useState(null);
    const [commentsError, setCommentsError] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);

    // Add comment form state
    const [commentText, setCommentText] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    useEffect(() => {
        setLoadingPost(true);
        fetch(`http://localhost:8080/posts/${id}`, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Post not found");
                return res.json();
            })
            .then(data => {
                console.log("Fetched post:", data); // <--- add this
                setPost(data);
            })
            .catch(err => setPostError(err.message))
            .finally(() => setLoadingPost(false));

        setLoadingComments(true);
        fetch(`http://localhost:8080/posts/${id}/comments`, { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch comments");
                return res.json();
            })
            .then(data => {
                console.log("Fetched comments:", data); // <--- add this
                setComments(Array.isArray(data) ? data : []);
            })
            .catch(err => setCommentsError(err.message))
            .finally(() => setLoadingComments(false));
    }, [id]);


    function handleAddComment(e) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitLoading(true);

        fetch(`http://localhost:8080/posts/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ content: commentText })

        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to add comment");
                return res.json();
            })
            .then(newComment => {
                setComments(prev => [newComment, ...prev]); // add new comment to top
                setCommentText("");
            })
            .catch(err => setSubmitError(err.message))
            .finally(() => setSubmitLoading(false));
    }

    if (postError) return <div>Error: {postError}</div>;
    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-page-container">
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
            </div>
            <div className="comments-section">
                <h3>Comments</h3>
                {loadingComments && <div>Loading comments...</div>}
                {commentsError && <div>Error: {commentsError}</div>}
                {comments.length === 0 && !loadingComments && <div>No comments yet.</div>}
                {comments.map(comment => (
                    <div key={comment.id} className="comment-card">
                        <div className="comment-author">{comment.username}:</div>
                        <div className="comment-content">{comment.content}</div>
                        <div className="comment-meta">{comment.created_at}</div>
                    </div>
                ))}
                {/* Add Comment Form */}
                <form className="add-comment-form" onSubmit={handleAddComment}>
                    <textarea
                        value={commentText}
                        onChange={e => {
                            setCommentText(e.target.value);
                            setSubmitError(null); // clear error on new input
                        }}
                        placeholder="Write your comment..."
                        required
                        disabled={submitLoading}
                    />
                    <button type="submit" disabled={submitLoading || commentText.trim() === ""}>
                        {submitLoading ? "Posting..." : "Submit"}
                    </button>
                    {submitError && <div className="comment-error">{submitError}</div>}
                </form>
            </div>
        </div>
    );
}
