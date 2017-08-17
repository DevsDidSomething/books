import React, { Component } from 'react'
import MixItem from './MixItem'
import MixContainer from '../containers/MixContainer'
import { Link } from 'react-router-dom'
import * as l from '../../lib'

class Books extends Component {
  constructor(props) {
    super(props)
    this.createMix = this.createMix.bind(this)
    this.previewBook = this.previewBook.bind(this)
    this.creatingMixMode = this.creatingMixMode.bind(this)
    this.renderMixes = this.renderMixes.bind(this)
    this.state = {
      mode: 'default',
      previewing: false,
      bookNotFound: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.props.params) {
      this.setState({mode: 'default'})
    }
  }

  createMix(e) {
    e.preventDefault()
    this.props.createMix(this.state.mixName)
  }

  renderMixItems(mixes) {
    return (
      mixes.map( (mix, i) =>
        <MixItem
          key={ mix.id }
          username={ this.props.bookshelf.user.username }
          mix={ mix }
          selected={ this.props.params.mix_id === mix.uid }
          isLast={ i === mixes.length-1 } />
      )
    )
  }

  renderMixes(mixes) {
    return (
      mixes.map( (mix, i) =>
        <MixContainer
          key= {`mix-${mix.id}`}
          params={this.props.params}
          mix={mix}
          previewBook={this.previewBook}
        />
      )
    )
  }

  previewBook( book ) {
    this.setState({previewing: book, bookNotFound: false})
    if ( this.props.app.googleLoaded ) {
      let googlePreview = new google.books.DefaultViewer(this.googlePreviewContainer)
      googlePreview.load( book.google_id, () => {this.setState({bookNotFound: true})} )
    } else {
      console.log('google hasnt loaded')
    }
  }

  creatingMixMode() {
    if (this.state.mode === 'creatingMix') {
      this.setState({mode: 'default'})
    } else {
      this.setState({mode: 'creatingMix'})
    }
  }

  render() {
    let bookString, mixes, privateMixes;
    if (this.state.previewing){
      bookString = l.createWebString(this.state.previewing.title)
    }
    const mixItems = _.filter(this.props.bookshelf.user.Mixes, ['isPrivate', false])
    const privateMixItems = _.filter(this.props.bookshelf.user.Mixes, ['isPrivate', true])
    if (this.props.params.mix_id) {
      mixes = this.props.bookshelf.mixes
    } else {
      mixes = _.filter(this.props.bookshelf.mixes, ['isPrivate', false])
      privateMixes = _.filter(this.props.bookshelf.mixes, ['isPrivate', true])
    }

    return (
      <div>
        <div className='mix-item-list'>
          <span>
            <span className={this.props.params.mix_id ? 'mix-item' : 'mix-item selected'}>
              <Link to={`/${this.props.bookshelf.user.username}`}>
                All
              </Link>
              <span className="separator">&bull;</span>
            </span>
            {this.renderMixItems(mixItems)}
          </span>
          {this.props.bookshelf.user.id === this.props.app.user.id &&
            <span className='create-mix button' onClick={this.creatingMixMode}>{this.state.mode === 'creatingMix' ? '-Create New Mix' : '+Create New Mix'}</span>
          }
        </div>
        {!_.isEmpty(privateMixItems) &&
          <div className='mix-private-list'>
            <div className="privacy-description">
              Private Mixes
            </div>
            {this.renderMixItems(privateMixItems)}
          </div>
        }
        {this.state.mode === 'creatingMix' &&
          <form onSubmit={this.createMix}>
            <input className="mix-title-field" onChange={(e) => this.setState({mixName: e.target.value})} type="text" placeholder="Come up with an unusually specific title" />
            <input type="submit" value="Create Mix"/>
          </form>
        }
        <div className="mix-list">
          {this.renderMixes(mixes)}
        </div>
        {!_.isEmpty(privateMixes) &&
          <div className='mix-list mix-private-list'>
            <div className="privacy-description">
              Private Mixes
            </div>
            {this.renderMixes(privateMixes)}
          </div>
        }
        <div className={this.state.previewing ? 'google-preview-container previewing' : 'google-preview-container'}>
          <a className='buy-book button' target="_blank" href={`https://www.indiebound.org/search/book?searchfor=${bookString}`}>Buy this book</a>
          {this.state.bookNotFound &&
            <div className='preview-message'>Sorry, preview unavailable for this book</div>
          }
          <div className='preview-background' onClick={() => this.setState({previewing: false})} />
          <div className='close-preview' onClick={() => this.setState({previewing: false})}>&times;</div>
          <div className='google-preview' ref={ (el) => this.googlePreviewContainer = el } />
        </div>
      </div>
    )
  }
}

export default Books
