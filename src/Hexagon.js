// import React, { PropTypes, Component } from "react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { hexbin } from "d3-hexbin";

console.log("first")
// class Hexagon extends Component {
const Hexagon = (props) => {
    // const { hexPixelRadius, fillColor, content } = this.props;
    const { hexPixelRadius, fillColor, content } = props;
    
    // const hexWidth = this.props.hexPixelRadius * 2 * Math.sin(Math.PI / 3);
    // const hexHeight = this.props.hexPixelRadius * 2;
    const hexWidth = hexPixelRadius * 2 * Math.sin(Math.PI / 3);
    const hexHeight =hexPixelRadius * 2;
    return (
      <div
        onClick={(e) => console.log(e.currentTartget)}
        style={{
          width: hexWidth,
          height: hexHeight,
          position: "relative",
          top: -hexHeight / 2,
          left: -hexWidth / 2,
        }}
      >
        <svg
          style={{ position: "relative", overflow: "visible", zIndex: 99 }}
          width={hexWidth}
          height={hexHeight}
        >
          <path
            stroke={"red"}
            strokeWidth={1}
            d={hexbin().hexagon(hexPixelRadius)}
            fill={fillColor}
            opacity={0.9}
            transform={`translate(${hexWidth / 2}, ${hexHeight / 2})`}
          ></path>
        </svg>
        <div
          style={{
            color: "blue",
            fontSize: "1.5em",
            position: "absolute",
            top: 0,
            left: 0,
            textAlign: "center",
            width: hexWidth,
            height: hexHeight,
            zIndex: 100,
          }}
          onClick={() => {}}
        >
          <span
            style={{
              borderRadius: "1em",
              backgroundColor: "white",
              lineHeight: `${hexHeight}px`,
              padding: ".5em",
              opacity: 0.5,
            }}
          >
            {content}
          </span>
        </div>
      </div>
    );
  };

Hexagon.propTypes = {
  hexPixelRadius: PropTypes.number.isRequired,
  fillColor: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired,
};

export default Hexagon;
