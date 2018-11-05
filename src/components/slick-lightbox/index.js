import React, { Component } from 'react';
import styles from './index.scss';
import PropTypes from 'prop-types';
import Lightbox from 'react-images'
import Slider from 'react-slick'

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  arrows: false
}

class SlickLightbox extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      lightboxIsOpen: false,
			currentImage: 0,
    }
  }

  componentDidMount(){

  }

  openLightbox(index) {
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		})
	}

	closeLightbox() {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		})
	}

	gotoPrevious() {
		this.setState({
			currentImage: this.state.currentImage - 1,
		})
	}

	gotoNext() {
		this.setState({
			currentImage: this.state.currentImage + 1,
		})
	}

	gotoImage(index) {
		this.setState({
			currentImage: index,
		})
	}

	handleClickImage() {
		if (this.state.currentImage === this.props.imageUrls.length - 1) {
			return
		}
		this.gotoNext()
	}

  render() {
    let images = this.props.images.map(u => {
			return {src: u}
		})
    return (
      <div className={styles.slickLightbox}>
        <Slider {...settings}>
          {this.props.images.map((item, key) => {
              return(
                <div className="float-left" key={key}>
                  <span onClick={this.openLightbox.bind(this, key)}>
                    <img src={item} alt="message-img"/>
                  </span>
                </div>
              )
            })
          }
       </Slider>
       <Lightbox
         backdropClosesModal
         currentImage={this.state.currentImage}
         images={images}
         isOpen={this.state.lightboxIsOpen}
         onClickImage={this.handleClickImage.bind(this)}
         onClickNext={this.gotoNext.bind(this)}
         onClickPrev={this.gotoPrevious.bind(this)}
         onClickThumbnail={this.gotoImage.bind(this)}
         onClose={this.closeLightbox.bind(this)}
       />
      </div>
    );
  }
}

export default SlickLightbox
