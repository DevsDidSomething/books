import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

let Header = ({ user, fromHomepage, login }) => (
  <div className="nav-container">
    <h1 className="site-title">
      <Link to='/'>
        Bookshelf
      </Link>
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
        <LoginForm login={login} fromHomepage={fromHomepage}/>
      </div>
    }
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  user: state.app.user,
  fromHomepage: ownProps.params.username ? false : true
})

const mapDispatchToProps = ({
  login: AppActions.login
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
