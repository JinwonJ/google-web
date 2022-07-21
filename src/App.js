// import React, { useState, useEffect } from "react";
// import "./App.css";
// import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
// import Hexbin from "./Hexbin.js";
// import fakeStoreLatLngData from "./data/generated-data.json";

// const MAP_PIXEL_HEIGHT = 600;
// const HEX_PIXEL_RADIUS = 40;

// const App = () => {
//   const [isMarkerOn, setIsMarkerOn] = useState(false);
//   const [defaultCenter, setDefaultCenter] = useState({
//     lat: 35.1513807,
//     lng: 126.9147898,
//   });

//   const toggleMarker = () => {
//     setIsMarkerOn((old) => !old);
//   };

//   useEffect(() => {
//     console.log(window.GoogleMap);
//   }, []);

//   return (
//     <div className="App">
//       <LoadScript
//         googleMapsApiKey="AIzaSyCymZURqRBA50tKljubkLjBxzPsnMtCyZ8">
//           <GoogleMap
//             zoom={17}
//             // options={{ mapTypeControl: true }}
//             defaultCenter={defaultCenter}
//             onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())}
//           >
//           {/* <Hexbin
//             hexPixelRadius={HEX_PIXEL_RADIUS}
//             mapPixelHeight={MAP_PIXEL_HEIGHT}
//             data={fakeStoreLatLngData}
//             colorRange={["white", "rgb(255, 255, 255)"]}
//           /> */}
//             {/* {isMarkerOn
//               ? fakeStoreLatLngData
//                   .map((point) => ({ position: point }))
//                   .map((obj, idx) => <Marker key={idx} {...obj} />)
//               : null} */}
//           </GoogleMap>
//           </LoadScript>
//       <button style={{ margin: 25, padding: 10 }} onClick={toggleMarker}>
//         Toggle Markers
//       </button>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import Hexbin from "./Hexbin.js";
import fakeStoreLatLngData from "./data/generated-data.json";

const MAP_PIXEL_HEIGHT = 600;
const HEX_PIXEL_RADIUS = 40;
import "./reset.css";
const INITIAL_VIEW = {
  viewState: {},
};

const center = {
  lat: 35.1516847,
  lng: 126.842175,
};

function MyComponent() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(window.screen.height);

  const ref = useRef(null);
  useEffect(() => {
    setWidth(window.screen.width);
    setHeight(window.screen.height);

    // console.log(ref);
    // console.log(window.GoogleMap)
  }, []);
  return (
    <LoadScript googleMapsApiKey="AIzaSyCymZURqRBA50tKljubkLjBxzPsnMtCyZ8">
      <GoogleMap
        onClick={(e) => console.log(e)}
        onDragEnd={(e) => console.log("드래그했다")}
        onZoomChanged={(e) => console.log("줌바꿨다")}
        mapContainerStyle={{
          height: height,
        }}
        center={center}
        zoom={17}
      >
        {/* <Hexbin
          hexPixelRadius={HEX_PIXEL_RADIUS}
          mapPixelHeight={MAP_PIXEL_HEIGHT}
          data={fakeStoreLatLngData}
          colorRange={["white", "rgb(255, 255, 255)"]}
        /> */}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MyComponent);
