import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginMenu from '../components/LoginMenu'
import { bindActionCreators } from 'redux'
import { login } from '../actions'
require('../css/Header.scss')

class Header extends Component {
  constructor(props) {
    super(props)
    this.toggleForm = this.toggleForm.bind(this)
    this.state = {
      open: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.setState({open: false})
    }
  }

  toggleForm(){
    this.setState({open: !this.state.open})
  }

  render() {
    return (
      <div className="nav-container">
        <div className="site-title">
          <h1>
            <Link className='button' to='/'>
              Bookshelf
            </Link>
          </h1>
          {this.props.currentUsername &&
            <h1>
              <span className="divider">
                {'/'}
              </span>
              <Link className='button' to={`/${this.props.currentUsername}`}>
                {this.props.currentUsername}
              </Link>
            </h1>
          }
        </div>
        <div onClick={this.toggleForm} className={this.state.open ? 'button hamburger open' : 'button hamburger'}>{this.state.open ? '×' : '☰'}</div>
        {this.props.user &&
          <div className={this.state.open ? 'user-actions-container open' : 'user-actions-container'}>
            <Link className='button' to={`/${this.props.user.username}`}>{this.props.user.username}</Link>
            <span className="divider">
              {'/'}
            </span>
            <a className='logout button' href="/logout">logout</a>
          </div>
        }
        {!this.props.user &&
          <div className={this.state.open ? 'user-actions-container open' : 'user-actions-container'}>
            <LoginMenu login={this.props.login} fromHomepage={this.props.fromHomepage} errors={this.props.errors} open={this.state.open}/>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.app.user,
  currentUsername: ownProps.params.username,
  fromHomepage: ownProps.params.username ? false : true,
  errors: state.app.errors.user
})

const mapDispatchToProps = ({
  login: login
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
