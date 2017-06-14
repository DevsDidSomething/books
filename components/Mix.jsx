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
    if (nextProps.mix.uid !== this.props.mix.uid) {
      this.setState({mode: 'default'})
    }
  }

  render() {
    return (
      <div>
        <div className="mix-title-container">
          <h1 className="mix-title">{this.props.mix.name}</h1>
          {this.props.canEdit &&
            <span className="edit-mix button" onClick={this.toggleEdit}>
              {this.state.mode === 'editing' ? '-Edit' : '+Edit'}
            </span>
          }
        </div>

        {this.props.canEdit && this.state.mode === 'editing' &&
          <Edit mix={this.props.mix} searchResults={this.props.searchResults} deleteMix={this.props.deleteMix} searchBook={this.props.searchBook} addBook={this.props.addBook} updateMix={this.props.updateMix} toggleEdit={this.toggleEdit} />
        }
        <div>
          {this.props.mix.Books.map(book =>
            <BookItem key={`b-${book.google_id}`} book={book} deleteBook={this.props.deleteBook} previewBook={this.props.previewBook} canEdit={this.props.canEdit} mode={this.state.mode}/>
          )}
        </div>
      </div>
    )
  }
}

export default Mix
