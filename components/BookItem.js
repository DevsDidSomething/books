import React, { Component } from 'react'

export default class BookItem extends Component {
  constructor(props) {
    super(props)
    this.deleteBook = this.deleteBook.bind(this)
  }

  deleteBook(e) {
    e.stopPropagation()
    this.props.deleteBook(this.props.book.id)
  }

  render() {
    return (
      <div
        className='book-item'
        style={{ backgroundImage: `url(${this.props.book.large_image_src})` }}
        onClick={() => this.props.previewBook(this.props.book.google_id)}>
        {this.props.canEdit &&
          <span
            className='delete-book'
            onClick={this.deleteBook}>
            x
          </span>
        }
        <div className='book-info'>
          <div className='book-item-title'>{this.props.book.title}</div>
          <div>by {this.props.book.author}</div>
          <div className='click-instruction'>Click to open</div>
        </div>
      </div>
    )
  }
}
