import React, { Component } from 'react'

import Header from '../components/header'
import Map from '../components/map'

class Home extends Component {
  render(){
    return(
      <div>
        <Header
          title='Mapster'
        />
        <Map
          container='map'
          style='mapbox://styles/mapbox/traffic-night-v2'
          zoom={18}
          classNameStyle='mapContainer'
          accessToken='pk.eyJ1IjoiZGlpaGZpbGlwZSIsImEiOiJjaXptMzJrdjMwMW9tMzNvYzRxNm9sanZ4In0.4jxzjvGPYQANir1HHO3JmQ'
        />
      </div>
    )
  }
}

export default Home
