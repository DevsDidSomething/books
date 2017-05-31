import React, { Component } from 'react'

export default class MixItem extends Component {
  render() {
    return (
      <div
        className="mix-item">
        {this.props.mix.name}
      </div>
    )
  }
}
