'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

/**
 * Renders lines for your line chart.
 *
 * @example ../docs/examples/Lines.md
 */
var Lines = React.createClass({

    displayName: 'Lines',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        opacity: React.PropTypes.number,

        asAreas: React.PropTypes.bool,
        interpolation: React.PropTypes.oneOf(['linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone']),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        lineAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        lineWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: helpers.propTypes.series
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            colors: 'category20',
            interpolation: 'monotone',
            seriesVisible: true,
            lineVisible: true,
            lineWidth: 3
        };
    },


    // render

    render: function render() {
        var _this = this;

        var props = this.props;
        var className = props.className;
        var style = props.style;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var asAreas = props.asAreas;
        var colors = props.colors;
        var series = props.series;
        var opacity = props.opacity;


        var rotate = scaleX.swap || scaleY.swap;

        var x = scaleX.factory(props);
        var y = scaleY.factory(props);

        var _y0 = y(0);
        var color = helpers.colorFunc(colors);

        return React.createElement(
            'g',
            { className: className, style: style, opacity: opacity },
            _.map(series, function (series, index) {
                var seriesVisible = props.seriesVisible;
                var seriesStyle = props.seriesStyle;
                var seriesAttributes = props.seriesAttributes;
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
                    var line = void 0;
                    if (rotate) {
                        line = asAreas ? d3.svg.area().x0(function (point) {
                            return point.y0 ? y(point.y0) : _y0;
                        }).x1(function (point) {
                            return y(point.y);
                        }) : d3.svg.line().x(function (point) {
                            return y(point.y);
                        });

                        line.y(function (point) {
                            return x(point.x);
                        });
                    } else {
                        line = asAreas ? d3.svg.area().y0(function (point) {
                            return point.y0 ? y(point.y0) : _y0;
                        }).y1(function (point) {
                            return y(point.y);
                        }) : d3.svg.line().y(function (point) {
                            return y(point.y);
                        });

                        line.x(function (point) {
                            return x(point.x);
                        });
                    }

                    var lineColor = series.color || color(index);

                    line.defined(function (point) {
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

module.exports = Lines;