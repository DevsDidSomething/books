import React, { Component } from 'react'
import * as l from '../../server/lib'
import _ from 'lodash'

class LoginForm extends Component {
  constructor(props){
    super(props)
    this.login = this.login.bind(this)
    this.state = {
      email: '',
      username: '',
      password: '',
      errors: {}
    }
  }

  login(e){
    e.preventDefault()
    let fields = {username: this.state.username, password: this.state.password}
    if (this.props.mode === 'signup') {
      fields['email'] = this.state.email
    }
    let errors = l.validateFields(fields, this.props.mode)
    if (_.isEmpty(errors)) {
      this.props.login(
        fields,
        this.props.mode,
        this.props.fromHomepage
      )
    } else {
      this.setState({errors: errors})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }
  }

  render(){
    return(
      <form className='user-form' onSubmit={this.login}>
        {this.state.errors.general &&
          <div className="form-error">{this.state.errors.general}</div>
        }
        {this.props.mode === 'signup' &&
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
        <input type="submit" value={this.props.mode === 'signup' ? 'Sign Up' : 'Log In'}/>
      </form>
    )
  }
}

export default LoginForm
