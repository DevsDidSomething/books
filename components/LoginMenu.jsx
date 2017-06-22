import React, { Component } from 'react'
import LoginForm from './LoginForm'

class LoginMenu extends Component {
  constructor(props){
    super(props)
    this.toggleLogin = this.toggleLogin.bind(this)
    this.toggleSignup = this.toggleSignup.bind(this)
    this.state = {
      mode: 'default'
    }
  }

  toggleLogin(){
    if (this.state.mode === 'login') {
      this.changeMode('default')
    } else {
      this.changeMode('login')
    }
  }

  toggleSignup(){
    if (this.state.mode === 'signup') {
      this.changeMode('default')
    } else {
      this.changeMode('signup')
    }
  }

  changeMode(mode){
    this.setState({mode: mode, errors: {}, password: ''})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === false) {
      this.changeMode('default')
    }
  }

  render(){
    return(
      <span>
        <span className={this.state.mode === 'login' ? 'button selected' : 'button'} onClick={this.toggleLogin}>login</span>
        <span className="divider">
          {' / '}
        </span>
        <span className={this.state.mode === 'signup' ? 'button selected' : 'button'} onClick={this.toggleSignup}>signup</span>
        {(this.state.mode === 'login' || this.state.mode === 'signup') &&
          <span className='login-form-container'>
            <LoginForm mode={this.state.mode} login={this.props.login} fromHomepage={this.props.fromHomepage} errors={this.props.errors}  />
            <span className='close-form' onClick={() => this.changeMode('default')}>&times;</span>
          </span>
        }
      </span>
    )
  }
}

export default LoginMenu
