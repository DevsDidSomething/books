import React, { Component } from 'react'

export default class SearchResult extends Component {
  render() {
    return (
      <div
        className='search-result'
        style={{ backgroundImage: `url(${this.props.result.small_image_src})` }}
        onClick={ () => this.props.onClick( this.props.result ) }
      >
        <div className='book-info'>
          <div className='book-item-title'>{this.props.result.title}</div>
          <div>by {this.props.result.author}</div>
          <div className='click-instruction'>Click to add</div>
        </div>
      </div>
    )
  }
}
