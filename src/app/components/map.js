import React, { Component } from 'react'

import PropTypes from 'prop-types'

import mapboxgl from 'mapbox-gl'

import './map.css'

import Button from './button'

class Map extends Component{
  constructor(props){
    super(props)
    this.state = {
      center: [-74.50, 40]
    }
    this.handleMap = this.handleMap.bind(this)
    this.handlePosition = this.handlePosition.bind(this)
    this.handleFlyToAPosition = this.handleFlyToAPosition.bind(this)
  }

  componentDidMount(){
    const { container, style, zoom, accessToken } = this.props
    const { center } = this.state
    this.handleMap(container, style, center, zoom, accessToken)
    this.handlePosition()
  }

  handleMap(container, style, center, zoom, accessToken){
    mapboxgl.accessToken = accessToken
    const map = new mapboxgl.Map({
      container: container,
      style: style,
      center: center,
      zoom: zoom
    })
    this.setState({
      map: map
    })
  }

  handlePosition(){
    const options = {
      enableHighAccuracy: true
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const center = [pos.coords.longitude, pos.coords.latitude]
      this.setState({
        center: center
      })
    }, (err) => {
      console.log(err)
    }, options)
  }

  handleFlyToAPosition(){
    const { center, map } = this.state
    map.flyTo({
      center: center
    })
  }
  render(){
    const { container, classNameStyle } = this.props
    return(
      <div id={container} className={classNameStyle}>
        <div className='buttonMapTrackMe'>
              <Button
                label='Me encontre'
                primary={false}
                onClickFunction={this.handleFlyToAPosition}
              />
        </div>

      </div>
    )
  }
}

const { string, number } = PropTypes

Map.propTypes = {
  container: string.isRequired,
  style: string.isRequired,
  classNameStyle: string.isRequired,
  zoom: number.isRequired,
  accessToken: string.isRequired
}

export default Map
