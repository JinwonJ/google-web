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
import Hexbin from "./Hexbin2.js";
// import Hexbin from "./Hexbin.js";
import fakeStoreLatLngData from "./data/generated-data.json";
import "./reset.css";

const center = {
  lat: 35.1516847,
  lng: 126.842175,
};
console.log(fakeStoreLatLngData)
function MyComponent() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(window.screen.height);

  const MAP_PIXEL_HEIGHT = 100;
  const HEX_PIXEL_RADIUS = 40;

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
        mapContainerStyle={{
          height: height,
        }}
        center={center}
        zoom={11}>
        <Hexbin
          hexPixelRadius={HEX_PIXEL_RADIUS}
          mapPixelHeight={MAP_PIXEL_HEIGHT}
          data={fakeStoreLatLngData}
          colorRange={["white", "rgb(255, 255, 255)"]}>
        </Hexbin>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MyComponent);
