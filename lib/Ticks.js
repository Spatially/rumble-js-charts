'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Renders ticks (labels and lines) for axis (x and y).
 *
 * @example ../docs/examples/Ticks.md
 */
var Ticks = React.createClass({

    displayName: 'Ticks',

    propTypes: {
        style: React.PropTypes.object,
        opacity: React.PropTypes.number,
        className: React.PropTypes.string,

        axis: React.PropTypes.string,
        position: React.PropTypes.string,

        tickVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        tickAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        tickStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),

        label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.node, React.PropTypes.func]),
        labelVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        labelAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        labelFormat: React.PropTypes.func,

        lineVisible: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.func]),
        lineAttributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineStyle: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        lineLength: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),
        lineOffset: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string, React.PropTypes.func]),

        ticks: React.PropTypes.oneOfType([
        // ticks factory
        React.PropTypes.func,
        // how many ticks to show
        React.PropTypes.number,
        // settings
        React.PropTypes.shape({
            maxTicks: React.PropTypes.number,
            minDistance: React.PropTypes.number,
            distance: React.PropTypes.number
        }),
        // ticks themselves
        React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number,
            label: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string, React.PropTypes.node]),
            labelStyle: React.PropTypes.object,
            labelAttributes: React.PropTypes.object,
            lineStyle: React.PropTypes.object,
            lineAttributes: React.PropTypes.object,
            lineLength: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
            lineOffset: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
        })]))]),

        scaleX: React.PropTypes.object,
        scaleY: React.PropTypes.object,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        minX: React.PropTypes.number,
        maxX: React.PropTypes.number,
        minY: React.PropTypes.number,
        maxY: React.PropTypes.number
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            axis: 'x',
            tickVisible: true,
            labelVisible: true,
            lineVisible: true,
            lineLength: 5,
            lineOffset: 0
        };
    },


    // helpers

    generateTicks: function generateTicks(config) {
        var props = this.props;
        var axis = props.axis;
        var maxX = props.maxX;
        var maxY = props.maxY;
        var minX = props.minX;
        var minY = props.minY;
        var maxTicks = config.maxTicks;
        var minDistance = config.minDistance;
        var distance = config.distance;


        var max = axis === 'y' ? maxY : maxX;
        var min = axis === 'y' ? minY : minX;
        var length = max - min;

        if (_.isUndefined(minDistance)) {
            minDistance = Math.min(1, length);
        }

        if (_.isUndefined(maxTicks)) {
            maxTicks = Math.min((length + minDistance) / minDistance, 5);
        }

        if (_.isUndefined(distance)) {
            distance = Math.max(minDistance, length / maxTicks);
            distance = Math.ceil(distance / minDistance) * minDistance;
        }

        return _.range(min, max + minDistance, distance);
    },


    // render

    renderTick: function renderTick(ticksLength, tick, index) {
        var props = this.props;
        var x = this.x;
        var y = this.y;
        var position = this.position;
        var axis = props.axis;
        var className = props.className;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var tickStyle = props.tickStyle;
        var tickAttributes = props.tickAttributes;
        var tickVisible = props.tickVisible;


        if (_.isNumber(tick)) {
            tick = _defineProperty({}, axis, tick);
        }

        tickVisible = helpers.value(tickVisible, { index: index, ticksLength: ticksLength, tick: tick, props: props });

        if (!tickVisible) {
            return;
        }

        var pX = axis === 'x' ? x(tick.x) : helpers.normalizeNumber(position, layerWidth);
        var pY = axis === 'y' ? y(tick.y) : helpers.normalizeNumber(position, layerHeight);

        var transform = scaleX.swap || scaleY.swap ? 'translate(' + pY + ',' + pX + ')' : 'translate(' + pX + ',' + pY + ')';
        var labelAttributes = props.labelAttributes;


        tickAttributes = helpers.value(tickAttributes, { index: index, ticksLength: ticksLength, tick: tick, props: props });
        tickStyle = helpers.value(tickStyle, { index: index, ticksLength: ticksLength, tick: tick, props: props });

        return React.createElement(
            'g',
            _extends({
                key: index, style: tickStyle,
                className: className && className + '-tick ' + className + '-tick-' + index,
                transform: transform
            }, tickAttributes),
            this.renderLabel(ticksLength, tick, index),
            this.renderLine(ticksLength, tick, index)
        );
    },
    renderLabel: function renderLabel(ticksLength, tick, index) {
        var props = this.props;
        var className = props.className;
        var axis = props.axis;
        var labelStyle = props.labelStyle;
        var labelFormat = props.labelFormat;
        var labelVisible = props.labelVisible;
        var labelAttributes = props.labelAttributes;
        var label = props.label;


        labelVisible = helpers.value(labelVisible, { index: index, ticksLength: ticksLength, tick: tick, props: props });
        if (labelVisible) {

            labelAttributes = helpers.value([tick.labelAttributes, labelAttributes], { index: index, ticksLength: ticksLength, tick: tick, props: props });
            labelStyle = helpers.value([tick.labelStyle, labelStyle], { index: index, ticksLength: ticksLength, tick: tick, props: props });

            label = helpers.value([tick.label, label, tick[axis]], { index: index, ticksLength: ticksLength, tick: tick, props: props });
            labelFormat = helpers.value(labelFormat, label) || label;

            var transform = labelAttributes.transform ? labelAttributes.transform : '';

            if (_.isString(label) || _.isNumber(label)) {
                label = React.createElement(
                    'text',
                    _extends({
                        style: labelStyle,
                        className: className && className + '-label ' + className + '-label-' + index,
                        transform: transform
                    }, labelAttributes),
                    labelFormat
                );
            }
            return label;
        }
    },
    renderLine: function renderLine(ticksLength, tick, index) {
        var props = this.props;
        var horizontal = this.horizontal;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var className = props.className;
        var lineVisible = props.lineVisible;
        var lineAttributes = props.lineAttributes;
        var lineStyle = props.lineStyle;
        var lineLength = props.lineLength;
        var lineOffset = props.lineOffset;

        var line = void 0;
        lineVisible = helpers.value(lineVisible, { index: index, ticksLength: ticksLength, tick: tick, props: props });
        if (lineVisible) {

            lineAttributes = helpers.value([tick.lineAttributes, lineAttributes], { index: index, ticksLength: ticksLength, tick: tick, props: props });
            lineStyle = helpers.value([tick.lineStyle, lineStyle], { index: index, ticksLength: ticksLength, tick: tick, props: props });

            lineLength = helpers.normalizeNumber(helpers.value([tick.lineLength, lineLength], { index: index, ticksLength: ticksLength, tick: tick, props: props }), horizontal ? layerWidth : layerHeight);
            lineOffset = helpers.normalizeNumber(helpers.value([tick.lineOffset, lineOffset], { index: index, ticksLength: ticksLength, tick: tick, props: props }), horizontal ? layerWidth : layerHeight);

            var d = horizontal ? 'M' + lineOffset + ',0 h' + lineLength : 'M0,' + lineOffset + ' v' + lineLength;

            line = React.createElement('path', _extends({
                style: lineStyle,
                className: className && className + '-line ' + className + '-line-' + index,
                d: d
            }, lineAttributes));
        }
        return line;
    },


    render: function render() {
        var props = this.props;
        var className = props.className;
        var position = props.position;
        var scaleX = props.scaleX;
        var scaleY = props.scaleY;
        var axis = props.axis;
        var style = props.style;
        var ticks = props.ticks;


        this.x = scaleX.factory(props);
        this.y = scaleY.factory(props);
        this.horizontal = axis === 'y' && !scaleX.swap && !scaleY.swap || axis === 'x' && (scaleX.swap || scaleY.swap);
        this.position = position || (axis === 'x' ? scaleX.swap || scaleY.swap ? 'top' : 'bottom' : 'left');

        ticks = helpers.value([ticks], props);
        if (_.isNumber(ticks)) {
            ticks = { maxTicks: ticks };
        }
        ticks = ticks || {};
        if (_.isPlainObject(ticks)) {
            ticks = this.generateTicks(ticks);
        }

        return React.createElement(
            'g',
            { className: className, style: style, opacity: props.opacity },
            _.map(ticks, this.renderTick.bind(this, ticks.length))
        );
    }

});

module.exports = Ticks;