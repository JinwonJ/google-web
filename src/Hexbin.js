// import React, { Component, PropTypes } from 'react';
import React, { Component } from "react";
import { OverlayView, GoogleMap } from "@react-google-maps/api";
import { hexbin } from "d3-hexbin";
import { scaleLinear } from "d3-scale";
import { interpolateLab } from "d3-interpolate";
import { max } from "d3-array";
import Hexagon from "./Hexagon.js";
import PropTypes from "prop-types";

const google = window.google;

// expects latLng = { lat: 0, lng: 0 }
// outputs { x: 0, y: 0 }
function latLngToPoint(projection, latLng) {
  // check if it is already a google.maps.LatLng object
  return typeof latLng.lat === "function"
    ? projection.fromLatLngToPoint(latLng)
    : projection.fromLatLngToPoint(new google.maps.LatLng(latLng));
}

// expects point = { x: 0, y: 0 }
// outputs google latLng object
function pointToLatLng(projection, point) {
  return projection.fromPointToLatLng(new google.maps.Point(point.x, point.y));
}

export default class Hexbin extends Component {
  constructor(props) {
    super(props);

    // method binding
    this.calculateHexPointRadius = this.calculateHexPointRadius.bind(this);
    this.convertLatLngToPoint = this.convertLatLngToPoint.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.handleBoundsChange = this.handleBoundsChange.bind(this);
    this.makeNewColorScale = this.makeNewColorScale.bind(this);
    this.makeNewHexagons = this.makeNewHexagons.bind(this);
    this.makeNewHexbinGenerator = this.makeNewHexbinGenerator.bind(this);

    this.mapRef = window.google.maps.Map.addListener;
  }
  componentWillUnmount() {
  }
  calculateHexPointRadius() {
    return (
      ((latLngToPoint(
        this.state.currentProjection,
        this.state.currentBounds.getSouthWest()
      ).y -
        latLngToPoint(
          this.state.currentProjection,
          this.state.currentBounds.getNorthEast()
        ).y) *
        this.props.hexPixelRadius) /
      this.props.mapPixelHeight
    );
  }
  convertLatLngToPoint(latlng) {
    return latLngToPoint(this.state.currentProjection, latlng);
  }
  handleBoundsChange() {
    this.setState({
      currentBounds: this.mapRef.getBounds(),
    });
  }
  handleZoomChange() {
    this.setState({
      currentZoom: this.mapRef.getZoom(),
      currentBounds: this.mapRef.getBounds(),
    });
  }
  makeNewColorScale(hexagons) {
    return scaleLinear()
      .domain([0, max(hexagons.map((hexagon) => hexagon.length))])
      .range(this.props.colorRange)
      .interpolate(interpolateLab);
  }
  makeNewHexbinGenerator(hexPointRadius) {
    return hexbin().radius(hexPointRadius);
  }
  makeNewHexagons() {
    let hexagons;
    if (!this.props.data) {
      return [];
    }

    let hexbinGenerator;

    const hexPointRadiusNew = this.calculateHexPointRadius();
    hexbinGenerator = this.makeNewHexbinGenerator(hexPointRadiusNew);

    // set x and y accessors
    hexbinGenerator.x((d) => d.x);
    hexbinGenerator.y((d) => d.y);

    hexagons = hexbinGenerator(this.props.data.map(this.convertLatLngToPoint));
    return hexagons.map((hexagon, idx) => {
      hexagon.id = idx;
      return hexagon;
    }); // in order to give unique keys
  }
  render() {
    let hexagons = [];
    let colorScale;

    if (this.state.currentProjection) {
      hexagons = this.makeNewHexagons();
      colorScale = this.makeNewColorScale(hexagons);
    }

    return (
      <div>
        {hexagons
          .filter((hexagon) =>
            this.state.currentBounds.contains(
              pointToLatLng(this.state.currentProjection, hexagon)
            )
          )
          .map((hexagon) => {
            return (
              <OverlayView
                mapHolderRef={this.props.mapHolderRef}
                position={pointToLatLng(this.state.currentProjection, hexagon)}
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
  }
}

Hexbin.propTypes = {
  colorRange: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  hexPixelRadius: PropTypes.number.isRequired,
  mapPixelHeight: PropTypes.number.isRequired,
};
