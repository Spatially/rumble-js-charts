'use strict';

var React = require('react');

var DropShadow = React.createClass({

    displayName: 'DropShadow',

    propTypes: {
        id: React.PropTypes.string.isRequired,
        dx: React.PropTypes.number,
        dy: React.PropTypes.number,
        blurDeviation: React.PropTypes.number,
        blurIn: React.PropTypes.oneOf(['SourceAlpha', 'SourceGraphic', 'BackgroundImage', 'BackgroundAlpha', 'FillPaint', 'StrokePaint'])
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            dx: 1,
            dy: 1,
            blurDeviation: 4,
            blurIn: 'SourceAlpha'
        };
    },


    // render

    render: function render() {
        var html = '\n<filter id="' + this.props.id + '">\n    <feGaussianBlur in="' + this.props.blurIn + '" stdDeviation="' + this.props.blurDeviation + '" />\n    <feOffset dx="' + this.props.dx + '" dy="' + this.props.dy + '" />\n    <feMerge>\n        <feMergeNode />\n        <feMergeNode in="SourceGraphic" />\n    </feMerge>\n</filter>\n          ';

        return React.createElement('g', { dangerouslySetInnerHTML: { __html: html } });
    }

});

module.exports = DropShadow;