import React, { Component } from 'react'

export default class BookItem extends Component {
  render() {
    console.log(this.props)
    return (
      <div
        className='book-item'
        style={{ backgroundImage: `url(${this.props.book.src})` }}>
        <span
          className='delete-book'
          onClick={() => this.props.deleteBook(this.props.book.id)}>
          x
        </span>
      </div>
    )
  }
}
