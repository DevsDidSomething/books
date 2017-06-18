import React, { Component } from 'react'
import * as l from '../lib'
import _ from 'lodash'

class LoginForm extends Component {
  constructor(props){
    super(props)
    this.login = this.login.bind(this)
    this.toggleLogin = this.toggleLogin.bind(this)
    this.toggleSignup = this.toggleSignup.bind(this)
    this.state = {
      mode: 'default',
      email: '',
      username: '',
      password: '',
      errors: {}
    }
  }

  login(e){
    e.preventDefault()
    let fields = {username: this.state.username, password: this.state.password}
    if (this.state.mode === 'signup') {
      fields['email'] = this.state.email
    }
    let errors = {}
    // let errors = l.validateFields(fields, {requireEmail: this.state.mode === 'signup'})
    if (_.isEmpty(errors)) {
      this.props.login(
        fields,
        this.state.mode,
        this.props.fromHomepage
      )
    } else {
      this.setState({errors: errors})
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
    if (nextProps.errors) {
      this.setState({errors: nextProps.errors})
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
          <form className='login-form' onSubmit={this.login}>
            {this.state.mode === 'signup' &&
              <span>
                {this.state.errors.email &&
                  <div className="form-error">{this.state.errors.email}</div>
                }
                <input className={this.state.errors.email ? 'error' : ''} type="text" value={this.state.email} onChange={(e) => this.setState({email: e.target.value.trim()})} placeholder="email" />
              </span>
            }
            {this.state.errors.username &&
              <div className="form-error">{this.state.errors.username}</div>
            }
            <input className={this.state.errors.username ? 'error' : ''} type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value.trim()})} placeholder="username" />
            {this.state.errors.password &&
              <div className="form-error">{this.state.errors.password}</div>
            }
            <input className={this.state.errors.password ? 'error' : ''} type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value.trim()})} placeholder="password" />
            <input type="submit" value={this.state.mode === 'signup' ? 'Sign Up' : 'Log In'}/>
            <span className='close-form' onClick={() => this.changeMode('default')}>&times;</span>
          </form>
        }
      </span>
    )
  }
}

export default LoginForm
