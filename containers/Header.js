import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions'

let Header = ({ user, login }) => (
  <div className="nav-container">
    <h1>
      Bookshelf
    </h1>
    {user &&
      <a href="/logout">logout</a>
    }
    {!user &&
      <LoginForm login={login} />
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
