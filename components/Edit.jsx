import React, { Component } from 'react'
import SearchResult from './SearchResult'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.searchBook = this.searchBook.bind(this)
    this.addingBookMode = this.addingBookMode.bind(this)
    this.deleteMix = this.deleteMix.bind(this)
    this.addBook = this.addBook.bind(this)
    this.updateMix = this.updateMix.bind(this)
    this.updateMixName = this.updateMixName.bind(this)
    this.togglePrivacy = this.togglePrivacy.bind(this)
    this.state = {
      mixName: this.props.mix.name,
      isPrivate: this.props.mix.isPrivate,
      mode: 'default',
      searchTerm: ''
    }
  }

  addingBookMode() {
    if (this.state.mode === 'addingBook') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'addingBook'})
    }
  }

  addBook(result){
    this.props.addBook(result, this.props.mix.uid)
    this.setState({searchTerm: ''})
  }

  searchBook(e) {
    e.preventDefault()
    this.props.searchBook(this.state.searchTerm)
  }

  renderSearchResults(results) {
    if (results.length) {
      return (
        <div className="search-list-container edit-form-row">
          {results.map(result =>
            <SearchResult key={`r-${result.google_id}`} result={result} onClick={this.addBook} />
          )}
        </div>
      )
    }
  }

  updateMix(attribs){
    this.props.updateMix(this.props.mix.uid, attribs)
  }

  deleteMix(){
    this.props.deleteMix(this.props.mix.uid)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mix !== nextProps.mix) {
      this.setState({mixName: nextProps.mix.name})
    }
  }

  togglePrivacy(){
    const newPrivacy = !this.state.isPrivate
    this.setState({isPrivate: newPrivacy})
    this.updateMix({isPrivate: newPrivacy})
  }

  updateMixName(e){
    e.preventDefault()
    this.updateMix({name: this.state.mixName})
  }

  render() {
    return (
      <div className='edit-mix-container'>
        {this.props.errors &&
          <div className="form-error">{this.props.errors}</div>
        }
        <div className='edit-form-row form-section'>
          <div className="section-label">
            Title:
          </div>
          <form className='section-content' onSubmit={this.updateMixName}>
            <input type="text" className="mix-title-field" value={this.state.mixName} onChange={(e) => this.setState({mixName: e.target.value})}/>
            <input type="submit" value="Update Title"/>
          </form>
        </div>
        <div className='edit-form-row form-section'>
          <div className="section-label">
            Privacy:
          </div>
          <div className="section-content">
            <div>
              <input type="radio" name="isPrivate" value="false" checked={!this.state.isPrivate} onChange={this.togglePrivacy} />
              Public - <span className="privacy-description">This mix may be listed publicly, and on your user page.</span>
            </div>
            <div>
              <input type="radio" name="isPrivate" value="true" checked={this.state.isPrivate} onChange={this.togglePrivacy} />
              Private - <span className="privacy-description">Mix can be found at the url, but not searchable or listed on user page.</span>
            </div>
          </div>
        </div>
        <div className='edit-form-row'>
          <div className='search-book button' onClick={this.addingBookMode}>{this.state.mode === 'addingBook' ? '-Add a Book' : '+Add a Book'}</div>
        </div>
        {this.state.mode === 'addingBook' &&
          <div className='edit-form-row'>
            <form onSubmit={this.searchBook}>
              <input className="search-google-field" value={this.state.searchTerm} onChange={(e) => this.setState({searchTerm: e.target.value})} type="text" placeholder="Seach by title, author, or keyword" disabled={this.props.isSearching ? true : false}/>
              <input type="submit" value="Search" disabled={this.props.isSearching ? true : false}/>
            </form>
            {this.renderSearchResults(this.props.searchResults)}
          </div>
        }
        <div className='edit-form-row'>
          <div className='delete-mix button' onClick={this.deleteMix}>Delete mix</div>
          <div className={this.props.showSaveConfirmation ? 'save-confirmation visible' : 'save-confirmation'}>Changes saved!</div>
        </div>
        <span className='close-form' onClick={this.props.toggleEdit}>&times;</span>
      </div>
    )
  }
}

export default Edit
