import React, { Component } from 'react'

class LoginForm extends Component {
  constructor(props){
    super(props)
    this.login = this.login.bind(this)
    this.state = {
      email: '',
      username: '',
      password: ''
    }
  }

  login(e){
    e.preventDefault()
    this.props.login({email: this.state.email, username: this.state.username, password: this.state.password})
  }

  render(){
    return(
      <form onSubmit={this.login}>
        <input type="text" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="email" />
        <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} placeholder="username" />
        <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="password" />
        <input type="submit" value="Log In"/>
      </form>
    )
  }
}

export default LoginForm
