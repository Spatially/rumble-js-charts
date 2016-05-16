'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Renders bars for your bar chart.
 *
 * @example ../docs/examples/Bars.md
 */
var Bars = React.createClass({

    displayName: 'Bars',

    propTypes: {
        className: React.PropTypes.string,
        /**
         * Colors
         */
        colors: React.PropTypes.oneOfType([React.PropTypes.oneOf(['category10', 'category20', 'category20b', 'category20c']), React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.func]),
        opacity: React.PropTypes.number,
        style: React.PropTypes.object,

        combined: React.PropTypes.bool,
        groupPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        innerPadding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        seriesVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        seriesAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        seriesStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        groupStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        barVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        barAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        barStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        barWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        seriesIndex: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.array, React.PropTypes.func]),
        series: helpers.propTypes.series,
        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            groupPadding: 0,
            innerPadding: 0,
            colors: 'category20',
            seriesVisible: true,
            barVisible: true
        };
    },


    // helpers

    getPaddings: function getPaddings() {
        var props = this.props;
        var innerPadding = props.innerPadding;
        var groupPadding = props.groupPadding;
        var layerWidth = props.layerWidth;

        innerPadding = helpers.value(innerPadding, props);
        innerPadding = helpers.normalizeNumber(innerPadding, layerWidth);
        groupPadding = helpers.value(groupPadding, props);
        groupPadding = helpers.normalizeNumber(groupPadding, layerWidth);
        return {
            innerPadding: innerPadding,
            groupPadding: groupPadding
        };
    },
    getBarWidth: function getBarWidth() {
        var props = this.props;
        var x = this.x;
        var barWidth = props.barWidth;
        var layerWidth = props.layerWidth;

        var _getPaddings = this.getPaddings(props);

        var innerPadding = _getPaddings.innerPadding;
        var groupPadding = _getPaddings.groupPadding;

        if (barWidth) {
            barWidth = helpers.value(barWidth, props);
            return helpers.normalizeNumber(barWidth, layerWidth);
        } else {
            var baseWidth = Math.abs(x(1) - x(0));
            if (props.combined) {
                return baseWidth - innerPadding;
            } else {
                return (baseWidth - groupPadding) / (props.series || []).length - innerPadding;
            }
        }
    },


    // render

    renderSeries: function renderSeries(series, index) {
        var _this = this;

        var x = this.x;
        var y = this.y;
        var barWidth = this.barWidth;
        var props = this.props;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var className = props.className;
        var seriesVisible = props.seriesVisible;
        var seriesStyle = props.seriesStyle;
        var seriesAttributes = props.seriesAttributes;


        seriesVisible = helpers.value(seriesVisible, { seriesIndex: index, series: series, props: props });
        if (!seriesVisible) {
            return;
        }

        seriesAttributes = helpers.value(seriesAttributes, { seriesIndex: index, series: series, props: props });
        seriesStyle = helpers.value(seriesStyle, { seriesIndex: index, series: series, props: props });

        var deltaX = 0;
        if (!props.combined) {
            deltaX = barWidth * index - ((props.series || []).length - 1) * 0.5 * barWidth + (index - ((props.series || []).length - 1) / 2) * this.innerPadding;
        }

        return React.createElement(
            'g',
            _extends({
                key: index,
                className: className && className + '-series ' + className + '-series-' + index,
                opacity: series.opacity,
                style: seriesStyle
            }, seriesAttributes),
            series && _.map(series.data, function (point, pointIndex) {
                var y0 = point.y0 ? y(point.y0) : _this._y0;
                var y1 = y(point.y);
                var x1 = x(point.x) + deltaX * (scaleX.direction || 1);

                if (scaleX.swap || scaleY.swap) {
                    return _this.renderBar(y1, x1, y0 - y1, barWidth, index, pointIndex, point);
                } else {
                    return _this.renderBar(x1, y1, barWidth, y0 - y1, index, pointIndex, point);
                }
            })
        );
    },
    renderBar: function renderBar(x, y, width, height, seriesIndex, pointIndex, point) {
        var props = this.props;
        var className = props.className;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var barVisible = props.barVisible;
        var barAttributes = props.barAttributes;
        var barStyle = props.barStyle;
        var groupStyle = props.groupStyle;

        var series = props.series[seriesIndex];

        barVisible = helpers.value(barVisible, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        if (!barVisible) {
            return;
        }

        groupStyle = helpers.value(groupStyle, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });

        var transform = 'translate(' + x + ',' + y + ')';

        var d = scaleX.swap || scaleY.swap ? 'M0,' + -height / 2 + ' h' + width + ' v' + height + ' h' + -width + ' Z' : 'M' + -width / 2 + ',0 v' + height + ' h' + width + ' v' + -height + ' Z';

        barAttributes = helpers.value(barAttributes, { seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props });
        barStyle = helpers.value([point.style, series.style, barStyle], {
            seriesIndex: seriesIndex, pointIndex: pointIndex, point: point, series: series, props: props
        });

        return React.createElement(
            'g',
            {
                key: pointIndex,
                className: className && className + '-bar ' + className + '-bar-' + pointIndex,
                style: groupStyle,
                transform: transform },
            React.createElement('path', _extends({
                style: barStyle,
                fill: point.color || series.color || this.color(seriesIndex),
                fillOpacity: point.opacity,
                d: d
            }, barAttributes))
        );
    },


    render: function render() {
        var props = this.props;
        var className = props.className;
        var style = props.style;
        var colors = props.colors;
        var opacity = props.opacity;


        this.x = props.scaleX.factory(props);
        this.y = props.scaleY.factory(props);

        var domainX = this.x.domain();
        var naturalDirection = domainX[1] > domainX[0];
        if (domainX[0] === props.minX || domainX[0] === props.maxX) {
            this.x.domain([domainX[0] + (naturalDirection ? -0.5 : 0.5), domainX[1]]);
            domainX = this.x.domain();
        }
        if (domainX[1] === props.minX || domainX[1] === props.maxX) {
            this.x.domain([domainX[0], domainX[1] + (naturalDirection ? 0.5 : -0.5)]);
        }

        this.innerPadding = this.getPaddings().innerPadding;
        this.barWidth = this.getBarWidth();
        this._y0 = this.y(0);
        this.color = helpers.colorFunc(colors);

        return React.createElement(
            'g',
            {
                className: className,
                style: style,
                opacity: opacity },
            _.map(props.series, this.renderSeries)
        );
    }

});

module.exports = Bars;