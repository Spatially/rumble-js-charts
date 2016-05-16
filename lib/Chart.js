'use strict';

var React = require('react'),
    d3 = require('d3'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Every chart should start with `<Chart />` component. It serves to set sizes (`width` and `height`)
 * and to wrap all another components:
 * - [Graphics](#Graphics)
 * - [Wrappers](#Wrappers)
 * - [Helpers](#Helpers)
 *
 * Also read more about [hidden props](#Magic&#x20;&&#x20;hidden&#x20;props).
 *
 * @example ../docs/examples/Chart.md
 */
var Chart = React.createClass({

  displayName: 'Chart',

  propTypes: {
    /**
     * Chart width (pixels)
     */
    width: React.PropTypes.number.isRequired,
    /**
     * Chart height (pixels)
     */
    height: React.PropTypes.number.isRequired,
    /**
     * An array of series objects. Read more [about series](#Series). (or docs/series.md)
     */
    series: helpers.propTypes.series,
    /**
     * It can be change to `"g"`, if you want to include your chart inside another svg graphic.
     */
    tag: React.PropTypes.string,
    /**
     * Rumble-charts components (one or more) or any other valid svg tag
     * (i.e. `<defs>`, `<g>`, `<rect>`, `<circle>` etc)
     */
    children: React.PropTypes.node,
    /**
     * Optional limit, affects on how graphics will be drawn. It's calculated automatically based on
     * `series` you've supplied, but sometimes you will need to define it by yourself.
     * Especially it relates to `minY` property. Very often you have to set it as `minY={0}`.
     */
    minX: React.PropTypes.number,
    /**
     * See above
     */
    maxX: React.PropTypes.number,
    /**
     * See above
     */
    minY: React.PropTypes.number,
    /**
     * See above
     */
    maxY: React.PropTypes.number,
    /**
     * X-scale (horizontal) attributes. For better understanding see examples below.
     */
    scaleX: React.PropTypes.shape({
      /**
       * 1 or -1, default value is 1
       */
      direction: React.PropTypes.number,
      /**
       * Padding at the start of the scale domain, default value is 0.5
       */
      paddingStart: React.PropTypes.number,
      /**
       * Padding at the end of the scale domain, default value is 0.5
       */
      paddingEnd: React.PropTypes.number,
      /**
       * Left padding in pixels, default value is 0
       */
      paddingLeft: React.PropTypes.number,
      /**
       * Right padding in pixels, default value is 0
       */
      paddingRight: React.PropTypes.number,
      factory: React.PropTypes.func,
      swap: React.PropTypes.boolean
    }),
    /**
     * Y-scale (vertical) attributes. For better understanding see examples below.
     */
    scaleY: React.PropTypes.shape({
      /**
       * 1 or -1, default value is 1
       */
      direction: React.PropTypes.number,
      /**
       * Padding at the start of the scale domain, default value is 0
       */
      paddingStart: React.PropTypes.number,
      /**
       * Padding at the end of the scale domain, default value is 0
       */
      paddingEnd: React.PropTypes.number,
      /**
       * Top padding in pixels, default value is 0
       */
      paddingTop: React.PropTypes.number,
      /**
       * Bottom padding in pixels, default value is 0
       */
      paddingBottom: React.PropTypes.number,
      factory: React.PropTypes.func,
      swap: React.PropTypes.boolean
    }),

    layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
  },

  getDefaultProps: function getDefaultProps() {
    return {
      series: [],
      tag: 'svg'
    };
  },


  // render

  render: function render() {

    var children = helpers.proxyChildren(this.props.children, this.props, {
      layerWidth: this.props.width,
      layerHeight: this.props.height,
      scaleX: _.defaults({}, this.props.scaleX, {
        direction: 1,
        paddingStart: 0.5,
        paddingEnd: 0.5,
        paddingLeft: 0,
        paddingRight: 0,
        factory: function factory(props) {
          var _props$scaleX = props.scaleX;
          var paddingStart = _props$scaleX.paddingStart;
          var paddingEnd = _props$scaleX.paddingEnd;
          var paddingLeft = _props$scaleX.paddingLeft;
          var paddingRight = _props$scaleX.paddingRight;
          var direction = _props$scaleX.direction;
          var swap = _props$scaleX.swap;
          var layerWidth = props.layerWidth;
          var layerHeight = props.layerHeight;

          if (swap) {
            layerWidth = layerHeight;
          }
          var minX = props.minX - paddingStart;
          var maxX = props.maxX + paddingEnd;

          return d3.scale.linear().range([helpers.normalizeNumber(paddingLeft, layerWidth), layerWidth - helpers.normalizeNumber(paddingRight, layerWidth)]).domain(direction >= 0 ? [minX, maxX] : [maxX, minX]);
        }
      }),
      scaleY: _.defaults({}, this.props.scaleY, {
        direction: 1,
        paddingStart: 0,
        paddingEnd: 0,
        paddingTop: 0,
        paddingBottom: 0,
        factory: function factory(props) {
          var _props$scaleY = props.scaleY;
          var paddingStart = _props$scaleY.paddingStart;
          var paddingEnd = _props$scaleY.paddingEnd;
          var paddingBottom = _props$scaleY.paddingBottom;
          var paddingTop = _props$scaleY.paddingTop;
          var direction = _props$scaleY.direction;
          var swap = _props$scaleY.swap;
          var layerWidth = props.layerWidth;
          var layerHeight = props.layerHeight;

          if (swap) {
            layerHeight = layerWidth;
          }
          var minY = props.minY - paddingStart;
          var maxY = props.maxY + paddingEnd;

          return d3.scale.linear().range([layerHeight - helpers.normalizeNumber(paddingBottom, layerHeight), helpers.normalizeNumber(paddingTop, layerHeight)]).domain(direction >= 0 ? [minY, maxY] : [maxY, minY]);
        }
      })
    });

    var Tag = this.props.tag;

    return React.createElement(
      Tag,
      this.props,
      children
    );
  }

});

module.exports = Chart;