import React, { Component } from 'react'

export default class BookItem extends Component {
  render() {
    return (
      <div
        className='book-item'
        style={{ backgroundImage: `url(${this.props.book.src})` }}
      />
    )
  }
}
