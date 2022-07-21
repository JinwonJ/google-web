import React, { useState, useEffect } from "react";
import { OverlayView } from "@react-google-maps/api";
import { hexbin } from "d3-hexbin";
import { scaleLinear } from "d3-scale";
import { interpolateLab } from "d3-interpolate";
import { max } from "d3-array";
import Hexagon from "./Hexagon.js";
import PropTypes from "prop-types";

const google = window.google;

const latLngToPoint = (projection, latLng) => {
  return typeof latLng.lat === "function"
    ? projection.fromLatLngToPoint(latLng)
    : projection.fromLatLngToPoint(new google.maps.LatLng(latLng));
};

const pointToLatLng = (projection, point) => {
  return projection.fromPointToLatLng(new google.maps.Point(point.x, point.y));
};

// class Hexbin extends Component {
const Hexbin = () => {
  const [currentZoom, setCurrentZoom] = useState(this.mapRef.getZoom());
  const [mapRef, setmapRef] = useState(window.google.maps.Map);
  const [currentBounds, setCurrentBounds] = useState(0);
  const [currentProjection, setCurrentProjection] = useState(0);

  // this.mapRef = window.google.maps.Map;

  const mapDragendListener = mapRef.addListener(
    "dragend",
    this.handleBoundsChange
  );
  const mapZoomListener = mapRef.addListener(
    "zoom_changed",
    this.handleZoomChange
  );

  const fuck = () => {
    setTimeout(
      () => setCurrentBounds(mapRef.getBounds()),
      setCurrentProjection(mapRef.getProjection()),
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
        this.props.hexPixelRadius) /
      this.props.mapPixelHeight
    );
  };
  const convertLatLngToPoint = (latlng) => {
    return latLngToPoint(currentProjection, latlng);
  };
  const handleBoundsChange = () => {
    this.setState({
      currentBounds: this.mapRef.getBounds(),
    });
  };
  const handleZoomChange = () => {
    this.setState({
      currentZoom: this.mapRef.getZoom(),
      currentBounds: this.mapRef.getBounds(),
    });
  };
  const makeNewColorScale = (hexagons) => {
    return scaleLinear()
      .domain([0, max(hexagons.map((hexagon) => hexagon.length))])
      .range(this.props.colorRange)
      .interpolate(interpolateLab);
  };
  const makeNewHexbinGenerator = (hexPointRadius) => {
    return hexbin().radius(hexPointRadius);
  };
  const makeNewHexagons = () => {
    if (!this.props.data) {
      return [];
    }

    let hexbinGenerator;

    const hexPointRadiusNew = this.calculateHexPointRadius();
    hexbinGenerator = this.makeNewHexbinGenerator(hexPointRadiusNew);

    hexbinGenerator.x((d) => d.x);
    hexbinGenerator.y((d) => d.y);

    let hexagons = hexbinGenerator(
      this.props.data.map(this.convertLatLngToPoint)
    );
  };
  let hexagons = [];
  let colorScale;

  if (currentProjection) {
    hexagons = this.makeNewHexagons();
    colorScale = this.makeNewColorScale(hexagons);
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
              mapHolderRef={this.props.mapHolderRef}
              position={pointToLatLng(currentProjection, hexagon)}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              key={hexagon.id}
            >
              <Hexagon
                hexPixelRadius={this.props.hexPixelRadius}
                fillColor={colorScale(hexagon.length)}
                content={hexagon.length}
              />
            </OverlayView>
          );
        })}
    </div>
  );
};

export default Hexbin;

Hexbin.propTypes = {
  colorRange: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hexPixelRadius: PropTypes.number.isRequired,
  mapPixelHeight: PropTypes.number.isRequired,
};
