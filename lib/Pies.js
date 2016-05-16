'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    helpers = require('./helpers');

var maxAngle = 2 * Math.PI;

/**
 * Renders pies for you pie chart or donut chart
 *
 * @example ../docs/examples/Pies.md
 */
var Pies = React.createClass({

    displayName: 'Pies',

    propTypes: {
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        innerRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        cornerRadius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        innerPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        groupPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        combined: React.PropTypes.bool,
        startAngle: React.PropTypes.number,
        endAngle: React.PropTypes.number,
        padAngle: React.PropTypes.number,
        gradientStep: React.PropTypes.number,

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        pieVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        pieAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        pieStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        pieWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),

        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: helpers.propTypes.series,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            pieVisible: true,
            startAngle: 0,
            endAngle: maxAngle,
            padAngle: 0,
            innerRadius: 0,
            cornerRadius: 0,
            groupPadding: 0,
            innerPadding: 0,
            position: 'center middle',
            gradientStep: 0.01
        };
    },


    // helpers

    getOuterRadius: function getOuterRadius(props) {
        return Math.min(props.layerWidth, props.layerHeight) / 2;
    },
    getInnerRadius: function getInnerRadius(props) {
        return helpers.normalizeNumber(props.innerRadius, this.getOuterRadius(props));
    },
    getPaddings: function getPaddings(props) {
        var innerPadding = props.innerPadding;
        var groupPadding = props.groupPadding;

        var outerRadius = this.getOuterRadius(props);
        innerPadding = helpers.normalizeNumber(innerPadding, outerRadius) || 0;
        groupPadding = helpers.normalizeNumber(groupPadding, outerRadius) || 0;
        return {
            innerPadding: innerPadding,
            groupPadding: groupPadding
        };
    },
    getPieWidth: function getPieWidth(x, props) {
        var pieWidth = props.pieWidth;

        var _getPaddings = this.getPaddings(props);

        var innerPadding = _getPaddings.innerPadding;
        var groupPadding = _getPaddings.groupPadding;

        if (pieWidth) {
            return helpers.normalizeNumber(pieWidth, this.getOuterRadius(props));
        } else {
            var baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                var seriesCount = _.isEmpty(props.series) ? 1 : props.series.length;
                return (baseWidth - groupPadding) / seriesCount - innerPadding;
            }
        }
    },


    // render

    renderArcPart: function renderArcPart(_ref) {
        var startAngle = _ref.startAngle;
        var endAngle = _ref.endAngle;
        var maxAngle = _ref.maxAngle;
        var pathProps = _ref.pathProps;
        var arc = _ref.arc;
        var key = _ref.key;

        var pathList = [];
        var lapIndex = 0;
        while (endAngle >= 4 * Math.PI) {
            endAngle -= 2 * Math.PI;
            if (endAngle < startAngle) {
                startAngle -= 2 * Math.PI;
            }
        }
        var lapsCount = Math.abs((endAngle - startAngle) / maxAngle);
        while (lapIndex < lapsCount) {

            var d = arc({
                startAngle: startAngle,
                endAngle: Math.min(startAngle + maxAngle, endAngle)
            });
            startAngle += maxAngle;

            pathList.push(React.createElement('path', _extends({
                key: '' + key + lapIndex
            }, pathProps, {
                d: d
            })));

            lapIndex++;
        }
        return pathList;
    },
    renderArc: function renderArc(startAngle, endAngle, radius, pieWidth, seriesIndex, pointIndex, point) {
        var _this = this;

        var props = this.props;
        var className = props.className;
        var pieVisible = props.pieVisible;
        var pieAttributes = props.pieAttributes;
        var pieStyle = props.pieStyle;
        var groupStyle = props.groupStyle;
        var cornerRadius = props.cornerRadius;

        var series = props.series[seriesIndex];

        pieVisible = helpers.value(pieVisible, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        if (!pieVisible) {
            return;
        }

        var halfWidth = pieWidth / 2;

        cornerRadius = helpers.value(cornerRadius, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        var arc = d3.svg.arc().cornerRadius(helpers.normalizeNumber(cornerRadius, pieWidth)).padRadius(10).innerRadius(radius - halfWidth).outerRadius(radius + halfWidth);

        var fillColor = point.color || series.color || this.color(seriesIndex);
        if (_.isArray(fillColor) && _.uniq(fillColor).length === 1) {
            fillColor = fillColor[0];
        }

        pieStyle = helpers.value([point.style, series.style, pieStyle], { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        pieAttributes = helpers.value(pieAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        // Used for setting `transform` (positioning) on the <path>
        var position = props.position;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;

        var innerRadius = this.getInnerRadius(props);
        var outerRadius = this.getOuterRadius(props);
        var coords = helpers.getCoords(position || '', layerWidth, layerHeight, outerRadius * 2, outerRadius * 2);
        var transform = 'translate(' + (coords.x + outerRadius) + ',' + (coords.y + outerRadius) + ')';

        var pathProps = _.assign({
            style: pieStyle,
            fill: fillColor,
            fillOpacity: point.opacity,
            transform: transform
        }, pieAttributes);

        var pathList = [];
        // fill color interpolation
        if (_.isArray(fillColor)) {
            (function () {

                var interpolateAngle = d3.interpolate(startAngle, endAngle);
                _.forEach(fillColor, function (color, index) {

                    if (index === fillColor.length - 1) {
                        return;
                    }

                    var interpolateFillColor = d3.interpolate(color, fillColor[index + 1]);
                    var step = 1 / ((endAngle - startAngle) / _this.props.gradientStep);

                    _.forEach(_.range(0, 1, step), function (i) {

                        pathProps.fill = interpolateFillColor(i);
                        var angleIndex = (index + i) / (fillColor.length - 1);
                        pathList = pathList.concat(_this.renderArcPart({
                            startAngle: interpolateAngle(angleIndex),
                            endAngle: interpolateAngle(angleIndex + step),
                            maxAngle: maxAngle,
                            pathProps: pathProps,
                            arc: arc,
                            key: i
                        }));
                    });
                });
            })();
        } else {

            pathList = this.renderArcPart({
                startAngle: startAngle,
                endAngle: endAngle,
                maxAngle: maxAngle,
                pathProps: pathProps,
                arc: arc,
                key: pointIndex
            });
        }

        groupStyle = helpers.value(groupStyle, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        return React.createElement(
            'g',
            {
                key: pointIndex,
                className: className && className + '-pie ' + className + '-pie-' + pointIndex,
                style: groupStyle },
            pathList
        );
    },


    render: function render() {
        var _this2 = this;

        var props = this.props;
        var className = props.className;
        var style = props.style;
        var minX = props.minX;
        var maxX = props.maxX;
        var minY = props.minY;
        var maxY = props.maxY;
        var position = props.position;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var colors = props.colors;
        var opacity = props.opacity;


        var innerRadius = this.getInnerRadius(props);
        var outerRadius = this.getOuterRadius(props);

        var radialScale = d3.scale.linear().range([outerRadius, innerRadius]).domain(props.scaleX.direction >= 0 ? [minX - 0.5, maxX + 0.5] : [maxX + 0.5, minX - 0.5]);

        var circularScale = d3.scale.linear().range([props.startAngle, props.endAngle]).domain(props.scaleY.direction >= 0 ? [minY, maxY] : [maxY, minY]);

        var series = props.series;

        var _getPaddings2 = this.getPaddings(props);

        var innerPadding = _getPaddings2.innerPadding;

        var pieWidth = this.getPieWidth(radialScale, props);
        var _startAngle = circularScale(0);
        this.color = helpers.colorFunc(colors);

        var halfPadAngle = props.padAngle / 2 || 0;

        return React.createElement(
            'g',
            { className: className, style: style, opacity: opacity },
            _.map(series, function (series, index) {
                var seriesVisible = props.seriesVisible;
                var seriesAttributes = props.seriesAttributes;
                var seriesStyle = props.seriesStyle;


                seriesVisible = helpers.value(seriesVisible, { seriesIndex: index, series: series, props: props });
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, { seriesIndex: index, series: series, props: props });
                seriesStyle = helpers.value(seriesStyle, { seriesIndex: index, series: series, props: props });

                var deltaRadial = 0;
                if (!props.combined) {
                    deltaRadial = pieWidth * index - (props.series.length - 1) * 0.5 * pieWidth + (index - (props.series.length - 1) / 2) * innerPadding;
                }

                return React.createElement(
                    'g',
                    _extends({
                        key: index,
                        className: className && className + '-series ' + className + '-series-' + index,
                        style: seriesStyle,
                        opacity: series.opacity
                    }, seriesAttributes),
                    _.map(series.data, function (point, pointIndex) {
                        var startAngle = (point.y0 ? circularScale(point.y0) : _startAngle) + halfPadAngle;
                        var endAngle = circularScale(point.y) - halfPadAngle;
                        var radius = radialScale(point.x) - deltaRadial * (props.scaleX.direction || 1);

                        return _this2.renderArc(startAngle, endAngle, radius, pieWidth, index, pointIndex, point);
                    })
                );
            })
        );
    }

});

module.exports = Pies;