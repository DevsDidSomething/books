import React, { Component } from 'react'
import Edit from './Edit'
import BookItem from './BookItem'

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.mix !== this.props.mix) {
      this.setState({mode: 'default'})
    }
  }

  render() {
    return (
      <div>
        <h1 className="mix-title">{this.props.mix.name}</h1>
        {this.props.canEdit &&
          <span>
            <span className="edit-mix button" onClick={this.toggleEdit}>{this.state.mode === 'editing' ? '-Edit' : '+Edit'}</span>
            {this.state.mode === 'editing' &&
              <Edit mix={this.props.mix} searchResults={this.props.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} />
            }
          </span>
        }
        <div>
          {this.props.mix.Books.map(book =>
            <BookItem key={`b-${book.google_id}`} book={book} deleteBook={this.props.deleteBook} previewBook={this.props.previewBook} canEdit={this.props.canEdit}/>
          )}
        </div>
      </div>
    )
  }
}

export default Mix
