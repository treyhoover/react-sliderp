import React from 'react';
import { Slider, createScroller } from "react-sliderp";
import InputBox from "./InputBox";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      subreddit: "pics",
      aspectRatio: "16:9",
      maxSlideWidth: 400,
      slides: [],
      index: 0,
      containerWidth: 0,
      slidesToShow: 4,
    };

    const getScrollState = () => ({
      index: this.state.index,
      numSlides: this.state.slides.length,
      slidesToShow: this.state.slidesToShow,
    });

    this.scroller = createScroller(getScrollState, this.setIndex);
  }

  get lastName() {
    const { slides } = this.state;

    if (slides.length === 0) return null;

    return slides[slides.length - 1].name;
  }

  componentDidMount() {
    this.resetSlides();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.subreddit !== this.state.subreddit) {
      this.resetSlides();
    }
  }

  resetSlides = () => {
    const results = this.fetchPage();

    results.then(slides => {
      if (!Array.isArray(slides)) return;

      this.setState({ slides });
    });
  };

  setIndex = (index) => {
    this.setState({ index });
  };

  handleArrowKey = (e) => {
    if (e.key === "ArrowRight") {
      this.scroller.pageRight();
    } else if (e.key === "ArrowLeft") {
      this.scroller.pageLeft();
    }
  };

  handleResize = ({ width }) => {
    if (width !== this.state.containerWidth) {
      this.setState({ containerWidth: width })
    }
  };

  fetchPage = (after = null) => {
    const { subreddit } = this.state;

    return fetch(encodeURI(`https://www.reddit.com/r/${subreddit}/hot.json?count=25&after=${after}`))
      .then(response => response.json())
      .then(json => {
        return json.data.children
          .map(post => post.data)
          .filter(({ preview, thumbnail }) => {
            const hasPreview = preview && preview.enabled;
            const thumbnailIsUrl = thumbnail.startsWith("http");

            return hasPreview && thumbnailIsUrl;
          });
      })
      .catch(() => {
        console.error("Invalid subreddit");
      });
  };

  onSubredditUpdate = (subreddit) => {
    if (!subreddit || subreddit === this.state.subreddit) return;

    this.setState({ subreddit, index: 0 });
  };

  loadMore = () => {
    const results = this.fetchPage(this.lastName);

    results.then(slides => {
      this.setState({ slides: this.state.slides.concat(slides) });
    });
  };

  render() {
    const { slides, index, containerWidth, slidesToShow } = this.state;

    return (
      <div>
        <h1>Async demo</h1>

        <Slider
          index={index}
          className="slider"
          slides={slides}
          width={containerWidth}
          height={250}
          slidesToShow={slidesToShow}
          onScroll={this.scroller.update}
          onArrow={this.handleArrowKey}
          onResize={this.handleResize}
          scrollable
          swipeable
        >
          {({ slide, index }) => (
            <a
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="slide"
              style={{
                backgroundImage: `url(${slide.thumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="slideContent">
                <span className="title">{slide.title}</span>
              </div>
            </a>
          )}
        </Slider>

        <button onClick={(e) => this.scroller.pageLeft()}>{'<<<'}</button>
        <button onClick={(e) => this.scroller.slideLeft()}>{'<'}</button>
        <InputBox onUpdate={this.scroller.update}>{index}</InputBox>
        <button onClick={(e) => this.scroller.slideRight()}>{'>'}</button>
        <button onClick={(e) => this.scroller.pageRight()}>{'>>>'}</button>

        <div className={"subreddit"}>
          <label>Subreddit: /r/</label>
          <InputBox onUpdate={this.onSubredditUpdate}>{this.state.subreddit}</InputBox>
          <button onClick={this.loadMore}>Load more</button>
        </div>
      </div>
    );
  }
}

export default App;
