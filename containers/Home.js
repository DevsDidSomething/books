import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllMixes, login } from '../actions'
import MixItem from '../components/MixItem'
import LoginForm from '../components/LoginForm'

class Home extends Component {
  componentWillMount() {
    this.props.getAllMixes()
  }

  render(){
    const mixes = _.filter(this.props.mixes, (m) => {return m.booksCount !== '0'})
    return(
      <div className="home">
        {!this.props.user &&
          <span>
            <h2>
              Sign Up to Create a Book Mixtape
            </h2>
            <LoginForm login={this.props.login} fromHomepage={true} errors={this.props.errors} mode='signup'/>
            <br />
            <br />
          </span>
        }
        <h2>
          Browse some people's shelves:
        </h2>
        {mixes &&
          <div className='mix-item-list'>
            {mixes.map( (mix, i) =>
              <MixItem
                key={ mix.id }
                username={ mix.User.username }
                mix={ mix }
                isLast={ i === this.props.mixes.length-1 } />
            )}
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.app.user,
  mixes: state.app.allMixes,
  errors: state.app.errors.user
})

const mapDispatchToProps = ({
  getAllMixes: getAllMixes,
  login: login
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
