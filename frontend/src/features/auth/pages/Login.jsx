import React from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'

const Login = () => {


  const handleSubmit = (e) => {
    e.preventDefault()
  }


  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" placeholder='Enter the email address'/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="text" id="password" name="password" placeholder='Enter the password'/>
          </div>

          <button className='button primary-button'>Login</button>


        </form>

        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login
