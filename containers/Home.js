import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllMixes } from '../actions'
import MixItem from '../components/MixItem'

class Home extends Component {
  componentWillMount() {
    this.props.getAllMixes()
  }

  render(){
    return(
      <div className="home">
        <h2>
          Browse some people's shelves:
        </h2>
        {this.props.mixes &&
          <div>
            {this.props.mixes.map( (mix, i) =>
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
  mixes: state.app.allMixes
})

const mapDispatchToProps = ({
  getAllMixes: getAllMixes
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
