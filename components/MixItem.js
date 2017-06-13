import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class MixItem extends Component {
  render() {
    return (
      <span className={this.props.selected ? 'mix-item selected' : 'mix-item'}>
        <Link to={`/${this.props.username}/mixes/${this.props.mix.id}/${this.props.mix.webstring}`}>
          {this.props.mix.name}
        </Link>
        {!this.props.isLast &&
          <span className="separator">&bull;</span>
        }
      </span>
    )
  }
}
