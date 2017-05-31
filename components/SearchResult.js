import React, { Component } from 'react'

export default class SearchResult extends Component {
  render() {
    return (
      <div
        className='search-result'
        style={{ backgroundImage: `url(${this.props.result.src})` }}
        onClick={ () => this.props.onClick( this.props.result ) }
      />
    )
  }
}
