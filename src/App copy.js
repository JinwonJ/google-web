import React, { Component } from "react";
import "./App.css";

import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import Hexbin from "./Hexbin.js";

import fakeStoreLatLngData from "./data/generated-data.json";

const MAP_PIXEL_HEIGHT = 600;
//hexagon size control
const HEX_PIXEL_RADIUS = 40;

class App extends Component {
  constructor() {
    super();
    this.state = {
      isMarkerOn: true,
    };
    this.toggleMarker = this.toggleMarker.bind(this);
  }
  toggleMarker() {
    this.setState({
      isMarkerOn: !this.state.isMarkerOn,
    });
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    return (
      <div className="App">
        <LoadScript
          query={{ libraries: "geometry,drawing,places,visualization" }}
          containerElement={
            <div style={{ width: "100%", height: MAP_PIXEL_HEIGHT }} />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={19}
              options={{ mapTypeControl: true }}
              defaultCenter={{ lat: 35.1513807, lng: 126.9147898 }}
              // defaultCenter={{ lat: 37.520398, lng: 126.878935 }}
              // "lat": 37.520398,
              // "lng": 126.878935
              onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())}
            >
              <Hexbin
                hexPixelRadius={HEX_PIXEL_RADIUS}
                mapPixelHeight={MAP_PIXEL_HEIGHT}
                data={fakeStoreLatLngData}
                // mapHolderRef={object.GoogleMap}
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
