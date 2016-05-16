'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

/**
 * Renders radial lines for your radar chart
 *
 * @example ../docs/examples/RadialLines.md
 */
var RadialLines = React.createClass({

    displayName: 'RadialLines',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.arrayOf(React.PropTypes.number), React.PropTypes.shape({
                x: React.PropTypes.number,
                y: React.PropTypes.number
            })]))
        })),
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        opacity: React.PropTypes.number,
        asAreas: React.PropTypes.bool,
        innerRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        startAngle: React.PropTypes.number,
        endAngle: React.PropTypes.number,
        interpolation: React.PropTypes.oneOf(['linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone']),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        lineAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func])
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            innerRadius: 0,
            position: 'center middle',
            interpolation: 'cardinal-closed'
        };
    },


    // helpers

    getOuterRadius: function getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    },
    getInnerRadius: function getInnerRadius(props) {
        return helpers.normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    },


    render: function render() {
        var _this = this;

        var props = this.props;
        var className = props.className;
        var style = props.style;
        var asAreas = props.asAreas;
        var colors = props.colors;
        var minX = props.minX;
        var maxX = props.maxX;
        var minY = props.minY;
        var maxY = props.maxY;
        var position = props.position;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var opacity = props.opacity;


        var innerRadius = this.getInnerRadius(props);
        var outerRadius = this.getOuterRadius(props);

        var radialScale = d3.scale.linear().range([innerRadius, outerRadius]).domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        var circularScale = d3.scale.linear().range([props.startAngle, props.endAngle]).domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        var series = props.series;


        var _radius0 = radialScale(0);

        var coords = helpers.getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);

        var transform = 'translate(' + (coords.x + outerRadius) + ',' + (coords.y + outerRadius) + ')';

        var color = helpers.colorFunc(colors);

        return React.createElement(
            'g',
            {
                className: className, style: style,
                opacity: opacity,
                transform: transform },
            _.map(series, function (series, index) {
                var seriesVisible = props.seriesVisible;
                var seriesAttributes = props.seriesAttributes;
                var seriesStyle = props.seriesStyle;
                var lineVisible = props.lineVisible;
                var lineStyle = props.lineStyle;
                var lineAttributes = props.lineAttributes;
                var lineWidth = props.lineWidth;


                seriesVisible = helpers.value(seriesVisible, { seriesIndex: index, series: series, props: props });
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, { seriesIndex: index, series: series, props: props });
                seriesStyle = helpers.value(seriesStyle, { seriesIndex: index, series: series, props: props });

                var linePath = void 0;
                lineVisible = helpers.value(lineVisible, { seriesIndex: index, series: series, props: props });
                if (lineVisible) {
                    var line = asAreas ? d3.svg.area.radial().innerRadius(function (point) {
                        return point.y0 ? radialScale(point.y0) : _radius0;
                    }).outerRadius(function (point) {
                        return radialScale(point.y);
                    }) : d3.svg.line.radial().radius(function (point) {
                        return radialScale(point.y);
                    });

                    var lineColor = series.color || color(index);

                    line.angle(function (point) {
                        return circularScale(point.x);
                    }).defined(function (point) {
                        return _.isNumber(point.y);
                    }).interpolate(_this.props.interpolation);

                    lineAttributes = helpers.value(lineAttributes, { seriesIndex: index, series: series, props: props });
                    lineStyle = helpers.value([series.style, lineStyle], { seriesIndex: index, series: series, props: props });
                    lineWidth = helpers.value(lineWidth, { seriesIndex: index, series: series, props: props });

                    linePath = React.createElement('path', _extends({
                        style: lineStyle,
                        fill: asAreas ? lineColor : 'transparent',
                        stroke: asAreas ? 'transparent' : lineColor,
                        strokeWidth: lineWidth,
                        d: line(series.data)
                    }, lineAttributes));
                }

                return React.createElement(
                    'g',
                    _extends({
                        key: index,
                        className: className && className + '-series ' + className + '-series-' + index,
                        style: seriesStyle,
                        opacity: series.opacity
                    }, seriesAttributes),
                    linePath
                );
            })
        );
    }

});

module.exports = RadialLines;