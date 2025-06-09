import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/SignupForm.css'

function SignupForm({ setIsAuthenticated }) {
  const [form, setForm] = useState({
    nickname: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    gender: '',
    age: ''
  })

  const [message, setMessage] = useState('')
  const navigate = useNavigate() // ✅ moved here

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ...form,
      age: form.age === '' ? undefined : parseInt(form.age)
    }

    const res = await fetch('http://localhost:8080/signup', {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
      
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('auth', 'true')
      setIsAuthenticated(true)
      navigate('/') // ✅ works now
    } else {
      setMessage(data.message || 'Signup failed')
    }
  }

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="nickname" placeholder="Nickname" onChange={handleChange} required />
        <input name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="number" name="age" placeholder="Age" min="13" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  )
}

export default SignupForm
