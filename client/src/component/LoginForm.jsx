import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/LoginForm.css'


function LoginForm({ setIsAuthenticated }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const navigate = useNavigate() // ✅ moved here

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("hello")
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: "include",
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('auth', 'true')
      setIsAuthenticated(true)
      navigate('/') // ✅ works now
    } else {
      setMessage(data.message || 'Login failed')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Log In</button>
        </form>
        {message && <p>{message}</p>}
        <p>Don't have an account? <Link to="/">Sign Up</Link></p>
      </div>
    </div>
  )
}

export default LoginForm
