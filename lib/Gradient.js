'use strict';

var React = require('react'),
    _ = require('./_');

var counter = 0;

var propTypePoint = React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]));

var Gradient = React.createClass({

    displayName: 'Gradient',

    propTypes: {
        type: React.PropTypes.oneOf(['linear', 'radial']),
        spreadMethod: React.PropTypes.oneOf(['pad', 'repeat', 'reflect']),
        gradientUnits: React.PropTypes.oneOf(['userSpaceOnUse', 'objectBoundingBox']),
        gradientTransform: React.PropTypes.string,
        // for linear gradient
        from: propTypePoint,
        to: propTypePoint,
        // for radial gradient
        canter: propTypePoint,
        focalPoint: propTypePoint,
        radius: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
    },

    // init

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'linear',
            idPrefix: 'chartGradient',
            gradientUnits: 'objectBoundingBox',
            spreadMethod: 'pad',
            // for linear gradient
            from: ['0%', '0%'],
            to: ['100%', '0%'],
            // for radial gradient
            center: ['50%', '50%']
        };
    },


    // helpers

    getId: function getId() {
        if (this.props.id) {
            return this.props.id;
        }
        if (!this._id) {
            counter++;
            this._id = this.props.idPrefix + counter;
        }
        return this._id;
    },
    getLink: function getLink() {
        return 'url(#' + this.getId() + ')';
    },


    // render

    renderRadial: function renderRadial() {
        var _props = this.props;
        var center = _props.center;
        var focalPoint = _props.focalPoint;
        var radius = _props.radius;
        var gradientUnits = _props.gradientUnits;
        var spreadMethod = _props.spreadMethod;
        var gradientTransform = _props.gradientTransform;
        var cx = _props.cx;
        var cy = _props.cy;
        var fx = _props.fx;
        var fy = _props.fy;
        var r = _props.r;


        var _cx = _.isUndefined(center) || _.isUndefined(center[0]) ? cx : center[0];
        var _cy = _.isUndefined(center) || _.isUndefined(center[1]) ? cy : center[1];
        var _fx = _.isUndefined(focalPoint) || _.isUndefined(focalPoint[0]) ? fx : focalPoint[0];
        var _fy = _.isUndefined(focalPoint) || _.isUndefined(focalPoint[1]) ? fy : focalPoint[1];
        var _r = _.isUndefined(radius) ? r : radius;

        return React.createElement(
            'radialGradient',
            {
                id: this.getId(),
                gradientUnits: gradientUnits, gradientTransform: gradientTransform, spreadMethod: spreadMethod,
                cx: _cx, cy: _cy, fx: _fx, fy: _fy, r: _r },
            this.props.children
        );
    },
    renderLinear: function renderLinear() {
        var _props2 = this.props;
        var from = _props2.from;
        var to = _props2.to;
        var gradientUnits = _props2.gradientUnits;
        var spreadMethod = _props2.spreadMethod;
        var gradientTransform = _props2.gradientTransform;
        var x1 = _props2.x1;
        var y1 = _props2.y1;
        var x2 = _props2.x2;
        var y2 = _props2.y2;


        var _x1 = _.isUndefined(from) || _.isUndefined(from[0]) ? x1 : from[0];
        var _y1 = _.isUndefined(from) || _.isUndefined(from[1]) ? y1 : from[1];
        var _x2 = _.isUndefined(to) || _.isUndefined(to[0]) ? x2 : to[0];
        var _y2 = _.isUndefined(to) || _.isUndefined(to[1]) ? y2 : to[1];

        return React.createElement(
            'linearGradient',
            {
                id: this.getId(),
                gradientUnits: gradientUnits, gradientTransform: gradientTransform, spreadMethod: spreadMethod,
                x1: _x1, y1: _y1, x2: _x2, y2: _y2 },
            this.props.children
        );
    },
    render: function render() {
        var type = this.props.type;


        if (type === 'radial') {
            return this.renderRadial();
        } else {
            return this.renderLinear();
        }
    }
});

module.exports = Gradient;