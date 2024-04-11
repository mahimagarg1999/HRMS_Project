import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './home.css'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onButtonClick = () => {
    // You'll update this function later
  }

  return (
    <div className="mainContainer">
      <div className={'titleContainer'}>
        <div>Welcome!</div>
      </div>
      <div>This is the home page.</div>
      <div className="formActions">
        <button className="formSubmitBtn" type="submit">
          <Link to="/login" style={{ color: 'black' }}>Login</Link>
        </button>
      </div>
      {/* <div className={'buttonContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Log out' : 'Log in'}
        />
        {loggedIn ? <div>Your email address is {email}</div> : <div />}
      </div> */}
    </div>
  )
}

export default Home