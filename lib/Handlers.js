'use strict';

var React = require('react'),
    ReactDOM = require('react-dom'),
    _ = require('lodash'),
    helpers = require('./helpers');

/**
 * Helps to use mouse events. For now supports only "`onMouseMove`" and "`onMouseLeave`".
 * 
 * This component will be improved and simplified in the future.
 *
 * @example ../docs/examples/Handlers.md
 */
var Handlers = React.createClass({

    displayName: 'Handlers',

    propTypes: {
        className: React.PropTypes.string,
        series: React.PropTypes.array,
        sensitivity: React.PropTypes.number,
        optimized: React.PropTypes.bool,
        onMouseMove: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool]),
        onMouseLeave: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.bool])
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            sensitivity: Infinity,
            optimized: true
        };
    },


    // helpers

    updatePoint0: function updatePoint0() {
        var target = ReactDOM.findDOMNode(this.rect);
        var rect = target.getBoundingClientRect();
        this.left = rect.left;
        this.top = rect.top;
    },
    updateScales: function updateScales() {
        var props = this.props;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;

        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.scaleX = scaleX.factory(props);
        this.scaleY = scaleY.factory(props);

        var xDomain = this.x.domain();
        var xRange = this.x.range();
        this.x.domain(xRange);
        this.x.range(xDomain);

        var yDomain = this.y.domain();
        var yRange = this.y.range();
        this.y.domain(yRange);
        this.y.range(yDomain);

        this.ratio = Math.abs((this.y(1) - this.y(0)) / (this.x(1) - this.x(0)));
    },


    // handlers

    handleMouseMove: function handleMouseMove(event) {
        var _this = this;

        this.updatePoint0();

        var clientX = event.clientX;
        var clientY = event.clientY;
        var left = this.left;
        var top = this.top;
        var props = this.props;
        var onMouseMove = props.onMouseMove;
        var series = props.series;
        var sensitivity = props.sensitivity;
        var optimized = props.optimized;

        var realX = clientX - left;
        var realY = clientY - top;
        var x = this.x(realX);
        var y = this.y(realY);

        var closestPoints = [];
        var minDistance = sensitivity;
        _.forEach(series, function (series, seriesIndex) {
            _.forEach(series.data, function (point, pointIndex) {
                var distance = Math.sqrt(Math.pow(Math.abs(point.x - x) * (_this.ratio || 1), 2) + Math.pow(Math.abs(point.y - y), 2));
                if (!optimized || distance <= minDistance) {
                    minDistance = distance;
                    closestPoints.push({
                        seriesIndex: seriesIndex,
                        pointIndex: pointIndex,
                        point: point,
                        distance: distance
                    });
                }
            });
        });
        closestPoints = _.sortBy(closestPoints, 'distance');

        onMouseMove({
            clientX: realX,
            clientY: realY,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            x: x,
            y: y,
            closestPoints: closestPoints,
            originalEvent: event
        });
    },


    // render

    render: function render() {
        var _this2 = this;

        var props = this.props;
        var className = props.className;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var onMouseMove = props.onMouseMove;
        var onMouseLeave = props.onMouseLeave;


        this.updateScales();

        var children = helpers.proxyChildren(props.children, props, {
            layerWidth: layerWidth,
            layerHeight: layerHeight,
            scaleX: scaleX,
            scaleY: scaleY
        });

        return React.createElement(
            'g',
            {
                className: className,
                onMouseMove: onMouseMove && this.handleMouseMove,
                onMouseLeave: onMouseLeave
            },
            React.createElement('rect', {
                ref: function ref(_ref) {
                    return _this2.rect = _ref;
                },
                x: 0, y: 0, width: layerWidth, height: layerHeight,
                fill: 'transparent', stroke: 'transparent' }),
            children
        );
    }
});

module.exports = Handlers;