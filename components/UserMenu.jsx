import React, { Component } from 'react'
import LoginForm from './LoginForm'
import Settings from './Settings'
import { Link } from 'react-router-dom'

class LoginMenu extends Component {
  constructor(props){
    super(props)
    this.renderUserButtons = this.renderUserButtons.bind(this)
    this.renderNoUserButtons = this.renderNoUserButtons.bind(this)
    this.toggleMode = this.toggleMode.bind(this)
    this.toggleHamburger = this.toggleHamburger.bind(this)
    this.state = {
      mode: 'default'
    }
  }

  toggleMode(newMode){
    if (newMode === 'default' && this.props.showSaveConfirmation){
      this.props.saveConfirmation({user: false})
    }
    if (this.state.mode === newMode) {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: newMode})
    }
  }

  componentWillReceiveProps(nextProps) {
    // close the form when you log in
    if (nextProps.user.id !== this.props.user.id || nextProps.params.mix_id !== this.props.params.mix_id) {
      this.setState({mode: 'default'})
    }
  }

  renderUserButtons() {
    return (
      <span>
        <Link className='button' to={`/${this.props.user.username}`}>{this.props.user.username}</Link>
        <span className="divider">{'/'}</span>
        <span className={this.state.mode === 'settings' ? 'button selected' : 'button'} onClick={() => this.toggleMode('settings')}>
          settings
        </span>
        <span className="divider">{'/'}</span>
        <a className='logout button' href="/logout">logout</a>
      </span>
    )
  }

  renderNoUserButtons() {
    return (
      <span>
        <span className={this.state.mode === 'login' ? 'button selected' : 'button'} onClick={() => this.toggleMode('login')}>
          login
        </span>
        <span className="divider">{' / '}</span>
        <span className={this.state.mode === 'signup' ? 'button selected' : 'button'} onClick={() => this.toggleMode('signup')}>
          signup
        </span>
      </span>
    )
  }

  toggleHamburger() {
    if (this.state.mode === 'default'){
      this.setState({mode: 'open'})
    } else {
      this.setState({mode: 'default'})
    }
  }

  render(){
    return(
      <span className="right-nav">
        <div onClick={this.toggleHamburger} className={this.state.mode === 'default' ? 'button hamburger' : 'button hamburger open'}>
          {this.state.mode === 'default' ? '☰' : '×'}
        </div>
        <div className={this.state.mode === 'default' ? 'user-actions-container' : 'user-actions-container open'}>
          {this.props.user &&
            this.renderUserButtons()
          }
          {!this.props.user &&
            this.renderNoUserButtons()
          }
          {(this.state.mode === 'login' || this.state.mode === 'signup') &&
            <span className='user-form-container'>
              <LoginForm mode={this.state.mode} login={this.props.login} fromHomepage={this.props.fromHomepage} errors={this.props.errors}  />
              <span className='close-form' onClick={() => this.toggleMode('default')}>&times;</span>
            </span>
          }
          {(this.state.mode === 'settings') &&
            <span className='user-form-container'>
              <Settings showSaveConfirmation={this.props.showSaveConfirmation} errors={this.props.errors} user={this.props.user} updateUser={this.props.updateUser} />
              <span className='close-form' onClick={() => this.toggleMode('default')}>&times;</span>
            </span>
          }
        </div>
      </span>
    )
  }
}

export default LoginMenu
