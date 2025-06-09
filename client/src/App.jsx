import { Routes, Route, Navigate } from 'react-router-dom'
import SignupForm from './component/SignUpForm'
import LoginForm from './component/LoginForm'
import Home from './component/Home'
import PostPage from './component/PostPage' // <-- Add this import
import { useEffect, useState } from 'react'
import NavBar from './component/NavBar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('auth') === 'true'
    setIsAuthenticated(auth)
  }, [])

  return (
    <>
      {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}

      <div className={isAuthenticated ? 'pt-20' : ''}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated
                ? <Navigate to="/home" />
                : <SignupForm setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route
            path="/login"
            element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/home"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/" />
            }
          />
          {/* Add this: */}
          <Route
            path="/posts/:id"
            element={
              isAuthenticated ? <PostPage /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App
