import React from 'react'
import BSroll from 'better-scroll'

class BetterScroll extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  }

  initScroll() {
    if (!this.refs.wrapper) {
      return
    }
    console.log(this.refs.wrapper)
    this.scroll = new BSroll(this.refs.wrapper, {
      probeType: this.props.probeType,
      click: this.props.click
    })
    console.log(this.scroll)
    // if(this.props.listenScroll) {
    //   let me = this
    //   this.scroll.on('scroll', pos => {
    //     me.handleScroll
    //   })
    // }
  }

  enable() {
    this.scroll && this.scroll.enable()
  }

  disable() {
    this.scroll && this.scroll.disable()
  }

  refresh() {
    this.scroll && this.scroll.refresh()
  }

  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }

  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  render() {
    return <div ref="wrapper">{this.props.children()}</div>
  }
}

export default BetterScroll
