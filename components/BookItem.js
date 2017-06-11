import React, { Component } from 'react'

export default class BookItem extends Component {
  render() {
    return (
      <div
        className='book-item'
        style={{ backgroundImage: `url(${this.props.book.src})` }}
        onClick={() => this.props.previewBook(this.props.book.google_id)}>
        <span
          className='delete-book'
          onClick={() => this.props.deleteBook(this.props.book.id)}>
          x
        </span>
      </div>
    )
  }
}
