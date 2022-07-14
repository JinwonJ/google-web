import React, { Component } from "react";
import "./App.css";

import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import Hexbin from "./Hexbin.js";

import fakeStoreLatLngData from "./data/generated-data.json";

const MAP_PIXEL_HEIGHT = 600;
const HEX_PIXEL_RADIUS = 50;

class App extends Component {
  constructor() {
    super();
    this.state = {
      isMarkerOn: false,
    };
    this.toggleMarker = this.toggleMarker.bind(this);
  }
  toggleMarker() {
    this.setState({
      isMarkerOn: !this.state.isMarkerOn,
    });
  }
  render() {
    return (
      <div className="App">
        <GoogleMapLoader
          query={{ libraries: "geometry,drawing,places,visualization" }}
          containerElement={
            <div style={{ width: "100%", height: MAP_PIXEL_HEIGHT }} />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={22}
              options={{ mapTypeControl: false }}
              defaultCenter={{ lat: 37.520398, lng: 126.878935 }}
              // "lat": 37.520398,
              // "lng": 126.878935
              onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())}
            >
              <Hexbin
                hexPixelRadius={HEX_PIXEL_RADIUS}
                mapPixelHeight={MAP_PIXEL_HEIGHT}
                data={fakeStoreLatLngData}
                colorRange={["white", "rgb(255, 255, 255)"]}
              />
              {this.state.isMarkerOn
                ? fakeStoreLatLngData
                    .map((point) => ({ position: point }))
                    .map((obj, idx) => <Marker key={idx} {...obj} />)
                : null}
            </GoogleMap>
          }
        />
        <button style={{ margin: 25, padding: 10 }} onClick={this.toggleMarker}>
          Toggle Markers
        </button>
      </div>
    );
  }
}

export default App;