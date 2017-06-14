import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

let Header = ({ user, login }) => (
  <div className="nav-container">
    <h1 className="site-title">
      Bookshelf
    </h1>
    {user &&
      <div className='user-actions-container'>
        <Link className='button' to={`/${user.username}`}>{user.username}</Link>
        {' / '}
        <a className='logout button' href="/logout">logout</a>
      </div>
    }
    {!user &&
      <div className='user-actions-container'>
        <LoginForm login={login} />
      </div>
    }
  </div>
)

const mapStateToProps = (state) => ({
  user: state.app.user
})

const mapDispatchToProps = ({
  login: AppActions.login
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
