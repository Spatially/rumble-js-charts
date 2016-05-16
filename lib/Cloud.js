'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    d3 = require('d3'),
    cloud = require('d3-cloud'),
    helpers = require('./helpers');

/**
 * Renders cloud of tags/keywords. Uses [d3-cloud](https://www.npmjs.com/package/d3-cloud) for calculations.
 * Please notice, `series` data points should have `label` attribute. See example below.
 *
 * @example ../docs/examples/Cloud.md
 */
var Cloud = React.createClass({

    displayName: 'Cloud',

    propTypes: {
        className: React.PropTypes.string,
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,

        font: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        minFontSize: React.PropTypes.number,
        maxFontSize: React.PropTypes.number,
        fontStyle: React.PropTypes.oneOfType([React.PropTypes.oneOf(['normal', 'italic', 'oblique', 'inherit']), React.PropTypes.func]),
        fontWeight: React.PropTypes.oneOfType([React.PropTypes.oneOf(['normal', 'bold', 'bolder', 'lighter', 'normal', '100', '200', '300', '400', '500', '600', '700', '800', '900']), React.PropTypes.func]),
        /**
         * Angle in degrees
         */
        rotate: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
        /**
         * Type of spiral used for positioning words. This can either be one of the two
         * built-in spirals, "archimedean" and "rectangular", or an arbitrary spiral
         * generator can be used, of the following form
         */
        spiral: React.PropTypes.oneOfType([React.PropTypes.oneOf(['archimedean', 'rectangular']), React.PropTypes.func]),
        padding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.func]),
        random: React.PropTypes.func,

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,

        labelVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: helpers.propTypes.series,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number
    },

    // init

    getInitialState: function getInitialState() {
        return {
            labels: [],
            series: []
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            colors: 'category20',
            seriesVisible: true,
            labelVisible: true,

            font: 'serif',
            minFontSize: 10,
            maxFontSize: 100,
            fontStyle: 'normal',
            fontWeight: 'normal',
            rotate: 0,
            spiral: 'archimedean',
            padding: 1,
            random: Math.random
        };
    },


    // helpers

    buildCloud: function buildCloud(props) {
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var series = props.series;
        var font = props.font;
        var fontStyle = props.fontStyle;
        var fontWeight = props.fontWeight;
        var rotate = props.rotate;
        var spiral = props.spiral;
        var padding = props.padding;
        var random = props.random;


        var scale = d3.scale.linear().range([props.minFontSize, props.maxFontSize]).domain([props.minY, props.maxY]);

        var words = _.reduce(series, function (words, _ref, seriesIndex) {
            var data = _ref.data;

            _.forEach(data, function (point, pointIndex) {
                words.push(_.defaults({
                    text: point.label,
                    size: point.y,
                    seriesIndex: seriesIndex,
                    pointIndex: pointIndex
                }, point));
            });
            return words;
        }, []);

        cloud().size([layerWidth, layerHeight]).words(words).font(font).fontStyle(fontStyle).fontWeight(fontWeight).rotate(rotate).spiral(spiral).padding(padding).random(random).timeInterval(15).fontSize(function (d) {
            return scale(d.size);
        }).on('end', function (series, labels) {
            labels = _.map(_.groupBy(labels, 'seriesIndex'), function (labels) {
                return _.sortBy(labels, 'pointIndex');
            });
            this.setState({ series: series, labels: labels });
        }.bind(this, series)).start();
    },


    // lifecycle

    componentWillMount: function componentWillMount() {
        try {
            this.buildCloud(this.props);
        } catch (e) {
            console.warn(e);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        try {
            this.buildCloud(nextProps);
        } catch (e) {
            console.warn(e);
        }
    },


    // render

    render: function render() {
        var props = this.props;
        var state = this.state;
        var className = props.className;
        var style = props.style;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var opacity = props.opacity;


        var color = helpers.colorFunc(props.colors);

        return React.createElement(
            'g',
            {
                className: className, style: style, opacity: opacity,
                transform: 'translate(' + layerWidth / 2 + ',' + layerHeight / 2 + ')' },
            _.map(state.series, function (series, seriesIndex) {
                var seriesVisible = props.seriesVisible;
                var seriesStyle = props.seriesStyle;
                var seriesAttributes = props.seriesAttributes;


                seriesVisible = helpers.value(seriesVisible, { seriesIndex: seriesIndex, series: series, props: props });
                if (!seriesVisible) {
                    return;
                }

                seriesAttributes = helpers.value(seriesAttributes, { seriesIndex: seriesIndex, series: series, props: props });
                seriesStyle = helpers.value(seriesStyle, { seriesIndex: seriesIndex, series: series, props: props });

                return React.createElement(
                    'g',
                    _extends({
                        key: seriesIndex,
                        className: className && className + '-series ' + className + '-series-' + seriesIndex,
                        style: seriesStyle,
                        opacity: series.opacity
                    }, seriesAttributes),
                    _.map(series.data, function (point, pointIndex) {
                        var labelVisible = props.labelVisible;
                        var labelAttributes = props.labelAttributes;
                        var labelStyle = props.labelStyle;

                        var label = state.labels[seriesIndex][pointIndex];
                        if (!label) {
                            return;
                        }

                        labelVisible = helpers.value(labelVisible, {
                            seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, label: label, series: series, props: props
                        });

                        if (!labelVisible) {
                            return;
                        }

                        labelAttributes = helpers.value(labelAttributes, {
                            seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, label: label, series: series, props: props
                        });
                        labelStyle = helpers.value([point.style, series.style, labelStyle], { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, label: label, series: series, props: props });

                        return React.createElement(
                            'g',
                            {
                                key: pointIndex,
                                className: className && className + '-label ' + className + '-label-' + +pointIndex,
                                style: {
                                    fontSize: label.size + 'px',
                                    fontFamily: label.font
                                } },
                            React.createElement(
                                'text',
                                _extends({
                                    transform: 'translate(' + label.x + ',' + label.y + '),rotate(' + label.rotate + ')',
                                    fill: point.color || series.color || color(seriesIndex),
                                    fillOpacity: point.opacity,
                                    textAnchor: 'middle',
                                    style: labelStyle
                                }, labelAttributes),
                                label.text
                            )
                        );
                    })
                );
            })
        );
    }

});

module.exports = Cloud;