import React, { Component } from 'react'
import Edit from './Edit'

class Mix extends Component {
  constructor(props){
    super(props)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.state = {
      mode: 'default'
    }
  }

  toggleEdit(){
    if (this.state.mode === 'editing') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'editing'})
    }
  }

  render() {
    return (
      <div>
        <h1 className="mix-title">{this.props.mix.name}</h1>
        <span className="button" onClick={this.toggleEdit}>Edit</span>
        {this.state.mode === 'editing' &&
          <Edit mix={this.props.mix} searchResults={this.props.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} />
        }
      </div>
    )
  }
}

export default Mix
