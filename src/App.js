import React, { useState, useEffect } from "react";
import "./App.css";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import Hexbin from "./Hexbin.js";
import fakeStoreLatLngData from "./data/generated-data.json";

const MAP_PIXEL_HEIGHT = 600;
const HEX_PIXEL_RADIUS = 40;

const App = () => {
  const [isMarkerOn, setIsMarkerOn] = useState(false);
  const [defaultCenter, setDefaultCenter] = useState({
    lat: 35.1513807,
    lng: 126.9147898,
  });

  const toggleMarker = () => {
    setIsMarkerOn((old) => !old);
  };

  useEffect(() => {
    console.log(window.GoogleMap);
  }, []);

  return (
    <div className="App">
      <LoadScript
        googleMapsApiKey="AIzaSyCymZURqRBA50tKljubkLjBxzPsnMtCyZ8"
        query={{ libraries: "geometry,drawing,places,visualization" }}
        containerElement={
          <div style={{ width: "100%", height: MAP_PIXEL_HEIGHT }} />
        }
        googleMapElement={
          <GoogleMap
            defaultZoom={19}
            options={{ mapTypeControl: true }}
            defaultCenter={defaultCenter}
            onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())}
          >
            <Hexbin
              hexPixelRadius={HEX_PIXEL_RADIUS}
              mapPixelHeight={MAP_PIXEL_HEIGHT}
              data={fakeStoreLatLngData}
              colorRange={["white", "rgb(255, 255, 255)"]}
            />
            {isMarkerOn
              ? fakeStoreLatLngData
                  .map((point) => ({ position: point }))
                  .map((obj, idx) => <Marker key={idx} {...obj} />)
              : null}
          </GoogleMap>
        }
      />
      <button style={{ margin: 25, padding: 10 }} onClick={toggleMarker}>
        Toggle Markers
      </button>
    </div>
  );
};

export default App;
