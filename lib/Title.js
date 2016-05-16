'use strict';

var React = require('react'),
    _ = require('./_'),
    helpers = require('./helpers');

/**
 * Renders title (text or everything else) at specified `position`.
 *
 * @example ../docs/examples/Title.md
 */
var Title = React.createClass({

    displayName: 'Title',

    propTypes: {
        className: React.PropTypes.string,
        style: React.PropTypes.object,

        width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        position: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),

        children: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string, React.PropTypes.node]).isRequired,
        layerWidth: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        layerHeight: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
        series: React.PropTypes.array
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            position: 'top center'
        };
    },


    // render

    render: function render() {
        var props = this.props;
        var className = props.className;
        var position = props.position;
        var layerWidth = props.layerWidth;
        var layerHeight = props.layerHeight;
        var width = props.width;
        var height = props.height;
        var children = props.children;

        var currentStyle = _.assign({}, props.style);

        var _ref = helpers.getCoords(position, layerWidth, layerHeight, width, height) || {};

        var x = _ref.x;
        var y = _ref.y;


        var transform = 'translate(' + x + ',' + y + ')';

        return React.createElement(
            'g',
            { className: className, style: currentStyle, transform: transform },
            _.isString(children) ? React.createElement(
                'text',
                null,
                children
            ) : _.isFunction(children) ? children(props) : children
        );
    }
});

module.exports = Title;