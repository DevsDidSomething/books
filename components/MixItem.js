import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class MixItem extends Component {
  render() {
    return (
      <div className="mix-item">
        <Link to={`/mixes/${this.props.mix.id}/${this.props.mix.webstring}`}>
          {this.props.mix.name}
        </Link>
        <span
          className='delete-mix'
          onClick={() => this.props.deleteMix(this.props.mix.id)}>
          x
        </span>
      </div>
    )
  }
}
