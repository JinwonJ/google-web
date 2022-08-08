import React, { useState, useEffect } from "react";
import { OverlayView } from "@react-google-maps/api";
import { hexbin } from "d3-hexbin";
import { scaleLinear } from "d3-scale";
import { interpolateLab } from "d3-interpolate";
import { max } from "d3-array";
import Hexagon from './Hexagon.js';
import PropTypes from "prop-types";

// const google = window.google;

const latLngToPoint = (projection, latLng) => {
  return typeof latLng.lat === "function"
    ? projection.fromLatLngToPoint(latLng)
    : projection.fromLatLngToPoint(google.maps.LatLng(latLng));
};

const pointToLatLng = (projection, point) => {
  return projection.fromPointToLatLng(google.maps.Point(point.x, point.y));
};


const Hexbin = () => {
  const [currentZoom, setCurrentZoom] = useState(google.maps.getZoom);
  const [currentBounds, setCurrentBounds] = useState(0);
  const [currentProjection, setCurrentProjection] = useState(0);
  

  const mapDragendListener = google.maps.addListener
    "dragend",
    handleBoundsChange
  ;

  const mapZoomListener = google.maps.addListener
    "zoom_changed",
    handleZoomChange
  ;

  const fuck = () => {
    setTimeout(
      () => setCurrentBounds(google.maps.getBounds),
      setCurrentProjection(google.maps.getProjection),
      500
    );
  };

  const componentWillUnmount = () => {
    google.maps.event.removeListener(mapZoomListener);
    google.maps.event.removeListener(mapDragendListener);
  };
  useEffect(() => {
    fuck();
    return () => componentWillUnmount();
  }, []);

  const calculateHexPointRadius = () => {
    return (
      ((latLngToPoint(currentProjection, currentBounds.getSouthWest()).y -
        latLngToPoint(currentProjection, currentBounds.getNorthEast()).y) *
        hexPixelRadius) /
      mapPixelHeight
    );
  };
  const convertLatLngToPoint = (latlng) => {
    return latLngToPoint(currentProjection, latlng);
  };
  const handleBoundsChange = () => {
    setState({
      currentBounds: google.maps.getBounds,
    });
  };
  const handleZoomChange = () => {
    setState({
      currentZoom: google.maps.getZoom,
      currentBounds: google.maps.getBounds,
    });
  };
  const makeNewColorScale = (hexagons) => {
    return scaleLinear()
      .domain([0, max(hexagons.map((hexagon) => hexagon.length))])
      .range(colorRange)
      .interpolate(interpolateLab);
  };
  const makeNewHexbinGenerator = (hexPointRadius) => {
    return hexbin().radius(hexPointRadius);
  };
  const makeNewHexagons = () => {
    if (!data) {
      return [];
    }

    let hexbinGenerator;

    const hexPointRadiusNew = calculateHexPointRadius();
    hexbinGenerator = makeNewHexbinGenerator(hexPointRadiusNew);

    hexbinGenerator.x((d) => d.x);
    hexbinGenerator.y((d) => d.y);

    hexagons = hexbinGenerator(
      props.data.map(convertLatLngToPoint)
    );
    return hexagon.map((hexagon, idx) => {
      hexagon.id = idx;
      return hexagon;
    });
  }
  let hexagons = [];
  let colorScale;

  if (currentProjection) {
    hexagons = makeNewHexagons();
    colorScale = makeNewColorScale(hexagons);
  }
  
  return (
    <div>
      {hexagons
        .filter((hexagon) =>
          currentBounds.contains(pointToLatLng(currentProjection, hexagon))
        )
        .map((hexagon) => {
          return (
            <OverlayView
              mapHolderRef={props.mapHolderRef}
              position={pointToLatLng(currentProjection, hexagon)}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              key={hexagon.id}
            >
              <Hexagon
                hexPixelRadius={hexPixelRadius}
                fillColor={colorScale(hexagon.length)}
                content={hexagon.length}
              />
             </OverlayView>
          );
        })}
    </div>
    
  );
  
};
Hexbin.propTypes = {
  colorRange: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hexPixelRadius: PropTypes.number.isRequired,
  mapPixelHeight: PropTypes.number.isRequired,
};

export default Hexbin;