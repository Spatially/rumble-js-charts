'use strict';

var React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Creates a new layer using specific `width` and `height` at specific `position`. It's useful when
 * you have two or more graphics on the same chart. Or in case you to have a margins.
 *
 * @example ../docs/examples/Layer.md
 */
var Layer = React.createClass({

    displayName: 'Layer',

    propTypes: {
        className: React.PropTypes.string,
        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
        series: React.PropTypes.array
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            width: '100%',
            height: '100%',
            position: 'middle center'
        };
    },


    // helpers

    getWidth: function getWidth() {
        var _props = this.props;
        var width = _props.width;
        var layerWidth = _props.layerWidth;

        return helpers.normalizeNumber(width, layerWidth);
    },
    getHeight: function getHeight() {
        var _props2 = this.props;
        var height = _props2.height;
        var layerHeight = _props2.layerHeight;

        return helpers.normalizeNumber(height, layerHeight);
    },
    getCoords: function getCoords() {
        var _props3 = this.props;
        var position = _props3.position;
        var layerWidth = _props3.layerWidth;
        var layerHeight = _props3.layerHeight;

        return helpers.getCoords(position, layerWidth, layerHeight, this.getWidth(), this.getHeight());
    },


    // render

    render: function render() {
        var _props4 = this.props;
        var className = _props4.className;
        var scaleX = _props4.scaleX;
        var scaleY = _props4.scaleY;
        var style = _props4.style;


        var layerWidth = this.getWidth();
        var layerHeight = this.getHeight();

        var _getCoords = this.getCoords();

        var x = _getCoords.x;
        var y = _getCoords.y;

        var transform = [];
        transform.push('translate(' + x + ',' + y + '' + ')');
        transform = transform.join(' ') + (style && style.transform ? ' ' + style.transform : '');

        var children = helpers.proxyChildren(this.props.children, this.props, {
            layerWidth: layerWidth,
            layerHeight: layerHeight,
            scaleX: scaleX,
            scaleY: scaleY
        });

        return React.createElement(
            'g',
            { className: className, style: style, transform: transform },
            children
        );
    }

});

module.exports = Layer;