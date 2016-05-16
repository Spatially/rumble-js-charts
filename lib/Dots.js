'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

var methods = {
    dots: 'renderCircle',
    dot: 'renderCircle',
    circles: 'renderCircle',
    circle: 'renderCircle',
    ellipses: 'renderEllipse',
    ellipse: 'renderEllipse',
    symbols: 'renderSymbol',
    symbol: 'renderSymbol',
    labels: 'renderLabel',
    label: 'renderLabel',
    path: 'renderPath'
};

/**
 * Renders dots for your scatter plot.
 *
 * @example ../docs/examples/Dots.md
 */
var Dots = React.createClass({

    displayName: 'Dots',

    propTypes: {
        className: React.PropTypes.string,
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,

        /**
         * Possible values: `"dot"`, `"circle"`, `"ellipse"`, `"symbol"`, `"label"`, `"path"`.
         */
        dotType: React.PropTypes.oneOfType([React.PropTypes.oneOf(_.keys(methods)), React.PropTypes.array, React.PropTypes.func]),
        dotRender: React.PropTypes.func,

        circleRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        circleAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        ellipseRadiusX: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        ellipseRadiusY: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        ellipseAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        /**
         * Possible values: `"circle"`, `"cross"`, `"diamond"`, `"square"`,
         * `"triangle-down"`, `"triangle-up"`
         */
        symbolType: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        symbolAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        path: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        pathAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        dotVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        dotAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        dotStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: helpers.propTypes.series,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            colors: 'category20',
            dotType: 'circles',
            circleRadius: 4,
            ellipseRadiusX: 6,
            ellipseRadiusY: 4,
            seriesVisible: true,
            dotVisible: true
        };
    },


    // render

    renderCircle: function renderCircle(_ref) {
        var key = _ref.key;
        var seriesIndex = _ref.seriesIndex;
        var pointIndex = _ref.pointIndex;
        var point = _ref.point;
        var dotStyle = _ref.dotStyle;
        var dotAttributes = _ref.dotAttributes;
        var props = _ref.props;
        var color = _ref.color;
        var className = props.className;
        var circleRadius = props.circleRadius;
        var circleAttributes = props.circleAttributes;

        var series = props.series[seriesIndex];

        circleRadius = helpers.value(circleRadius, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        circleAttributes = helpers.value(circleAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement('circle', _extends({
            key: key,
            className: className && className + '-circle ' + className + '-circle-' + seriesIndex + '-' + pointIndex,
            cx: 0, cy: 0, r: circleRadius,
            style: dotStyle,
            fill: point.color || series.color || color(seriesIndex),
            fillOpacity: point.opacity
        }, dotAttributes, circleAttributes));
    },
    renderEllipse: function renderEllipse(_ref2) {
        var key = _ref2.key;
        var seriesIndex = _ref2.seriesIndex;
        var pointIndex = _ref2.pointIndex;
        var point = _ref2.point;
        var dotStyle = _ref2.dotStyle;
        var dotAttributes = _ref2.dotAttributes;
        var props = _ref2.props;
        var color = _ref2.color;
        var className = props.className;
        var ellipseRadiusX = props.ellipseRadiusX;
        var ellipseRadiusY = props.ellipseRadiusY;
        var ellipseAttributes = props.ellipseAttributes;

        var series = props.series[seriesIndex];

        ellipseRadiusX = helpers.value(ellipseRadiusX, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        ellipseRadiusY = helpers.value(ellipseRadiusY, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        ellipseAttributes = helpers.value(ellipseAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement('ellipse', _extends({
            key: key,
            className: className && className + '-ellipse ' + className + '-ellipse-' + seriesIndex + '-' + pointIndex,
            cx: 0,
            cy: 0,
            rx: ellipseRadiusX,
            ry: ellipseRadiusY,
            style: dotStyle,
            fill: point.color || series.color || color(seriesIndex),
            fillOpacity: point.opacity
        }, dotAttributes, ellipseAttributes));
    },
    renderPath: function renderPath(_ref3) {
        var key = _ref3.key;
        var seriesIndex = _ref3.seriesIndex;
        var pointIndex = _ref3.pointIndex;
        var point = _ref3.point;
        var dotStyle = _ref3.dotStyle;
        var dotAttributes = _ref3.dotAttributes;
        var props = _ref3.props;
        var color = _ref3.color;
        var className = props.className;
        var path = props.path;
        var pathAttributes = props.pathAttributes;

        var series = props.series[seriesIndex];

        path = helpers.value(path, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        pathAttributes = helpers.value(pathAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement('path', _extends({
            key: key,
            className: className && className + '-path ' + className + '-path-' + seriesIndex + '-' + pointIndex,
            d: path,
            style: dotStyle,
            fill: point.color || series.color || color(seriesIndex),
            fillOpacity: point.opacity
        }, dotAttributes, pathAttributes));
    },
    renderSymbol: function renderSymbol(_ref4) {
        var key = _ref4.key;
        var seriesIndex = _ref4.seriesIndex;
        var pointIndex = _ref4.pointIndex;
        var point = _ref4.point;
        var dotStyle = _ref4.dotStyle;
        var dotAttributes = _ref4.dotAttributes;
        var props = _ref4.props;
        var color = _ref4.color;
        var className = props.className;
        var symbolType = props.symbolType;
        var symbolAttributes = props.symbolAttributes;

        var series = props.series[seriesIndex];

        symbolType = helpers.value(symbolType, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        symbolAttributes = helpers.value(symbolAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement('path', _extends({
            key: key,
            className: className && className + '-symbol ' + className + '-symbol-' + seriesIndex + '-' + pointIndex,
            d: d3.svg.symbol().type(symbolType)(point, pointIndex),
            style: dotStyle,
            fill: point.color || series.color || color(seriesIndex),
            fillOpacity: point.opacity
        }, dotAttributes, symbolAttributes));
    },
    renderLabel: function renderLabel(_ref5) {
        var key = _ref5.key;
        var seriesIndex = _ref5.seriesIndex;
        var pointIndex = _ref5.pointIndex;
        var point = _ref5.point;
        var dotStyle = _ref5.dotStyle;
        var dotAttributes = _ref5.dotAttributes;
        var props = _ref5.props;
        var color = _ref5.color;
        var className = props.className;
        var label = props.label;
        var labelAttributes = props.labelAttributes;

        var series = props.series[seriesIndex];

        label = helpers.value(label, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        labelAttributes = helpers.value(labelAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement(
            'text',
            _extends({
                key: key,
                className: className && className + '-label ' + className + '-label-' + seriesIndex + '-' + pointIndex,
                style: dotStyle,
                fill: point.color || series.color || color(seriesIndex),
                fillOpacity: point.opacity
            }, dotAttributes, labelAttributes),
            label
        );
    },
    renderDot: function renderDot(x, y, seriesIndex, pointIndex, point) {
        var _this = this;

        var props = this.props;
        var className = props.className;
        var groupStyle = props.groupStyle;
        var dotVisible = props.dotVisible;
        var dotAttributes = props.dotAttributes;
        var dotStyle = props.dotStyle;
        var dotType = props.dotType;
        var dotRender = props.dotRender;

        var series = props.series[seriesIndex];

        dotVisible = helpers.value(dotVisible, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        if (!dotVisible) {
            return;
        }

        groupStyle = helpers.value(groupStyle, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        var transform = 'translate(' + x + ',' + y + ')';

        dotType = helpers.value([dotType], { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        dotAttributes = helpers.value(dotAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, dotType: dotType, series: series, props: props });
        dotStyle = helpers.value([point.style, series.style, dotStyle], {
            seriesIndex: seriesIndex,
            pointIndex: pointIndex,
            point: point,
            dotType: dotType,
            series: series,
            props: props
        });

        var color = this.color;
        var dot = void 0;

        if (_.isString(dotType)) {
            dot = this[methods[dotType]]({ seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, dotStyle: dotStyle, dotAttributes: dotAttributes, props: props, color: color });
        } else if (_.isArray(dotType)) {
            dot = _.map(dotType, function (dotType, key) {
                return _this[methods[dotType]]({
                    key: key, seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, dotStyle: dotStyle, dotAttributes: dotAttributes, props: props, color: color
                });
            });
        } else {
            dotRender({ seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, dotStyle: dotStyle, dotAttributes: dotAttributes, props: props, color: color });
        }

        return React.createElement(
            'g',
            {
                key: pointIndex,
                className: className && className + '-dot ' + className + '-dot-' + pointIndex,
                style: groupStyle,
                transform: transform },
            dot
        );
    },


    render: function render() {
        var _this2 = this;

        var props = this.props;
        var className = props.className;
        var style = props.style;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var colors = props.colors;
        var opacity = props.opacity;


        var x = scaleX.factory(props);
        var y = scaleY.factory(props);
        var rotate = scaleX.swap || scaleY.swap;
        this.color = helpers.colorFunc(colors);

        return React.createElement(
            'g',
            { className: className, style: style, opacity: opacity },
            _.map(props.series, function (series, index) {
                var seriesVisible = props.seriesVisible;
                var seriesStyle = props.seriesStyle;
                var seriesAttributes = props.seriesAttributes;


                seriesVisible = helpers.value(seriesVisible, { seriesIndex: index, series: series, props: props });
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, { seriesIndex: index, series: series, props: props });
                seriesStyle = helpers.value(seriesStyle, { seriesIndex: index, series: series, props: props });

                return React.createElement(
                    'g',
                    _extends({
                        key: index,
                        className: className && className + '-series ' + className + '-series-' + index,
                        style: seriesStyle,
                        opacity: series.opacity
                    }, seriesAttributes),
                    _.map(series.data, function (point, pointIndex) {
                        var y1 = y(point.y);
                        var x1 = x(point.x);

                        if (rotate) {
                            return _this2.renderDot(y1, x1, index, pointIndex, point);
                        } else {
                            return _this2.renderDot(x1, y1, index, pointIndex, point);
                        }
                    })
                );
            })
        );
    }

});

module.exports = Dots;