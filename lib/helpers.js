'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react'),
    d3 = require('d3'),
    _ = require('lodash');

var limitsPropNames = ['maxX', 'maxY', 'minX', 'minY'];

var isInvalidLimit = function isInvalidLimit(value) {
    return _.isUndefined(value) || value === Infinity || value === -Infinity;
};

var helpers = {
    normalizeSeries: function normalizeSeries(props) {
        var maxX = -Infinity,
            maxY = -Infinity,
            minX = Infinity,
            minY = Infinity;

        var series = _.map(props.series, function (series) {

            var data = _.map(series.data, function (item, index) {

                var d;
                if (!props.seriesNormalized) {
                    d = {};
                    if (_.isNumber(item)) {
                        d.x = index;
                        d.y = item;
                    } else if (_.isArray(item)) {
                        d.x = item[0];
                        d.y = item[1];
                    } else {
                        d = item || {};
                        if (_.isUndefined(d.x)) {
                            d.x = index;
                        }
                    }
                } else {
                    d = item;
                }
                if (_.isUndefined(props.maxX)) {
                    maxX = Math.max(maxX, d.x || 0);
                }
                if (_.isUndefined(props.maxY)) {
                    maxY = Math.max(maxY, d.y || 0);
                }
                if (_.isUndefined(props.minX)) {
                    minX = Math.min(minX, d.x || 0);
                }
                if (_.isUndefined(props.minY)) {
                    minY = Math.min(minY, d.y || 0);
                }

                return d;
            });

            return _.defaults({ data: data }, series);
        });
        if (_.isEmpty(series)) {
            series = undefined;
        }
        if (!_.isUndefined(props.maxX)) {
            maxX = props.maxX;
        }
        if (!_.isUndefined(props.maxY)) {
            maxY = props.maxY;
        }
        if (!_.isUndefined(props.minX)) {
            minX = props.minX;
        }
        if (!_.isUndefined(props.minY)) {
            minY = props.minY;
        }

        return _.omitBy({
            seriesNormalized: true,
            series: series,
            maxX: maxX,
            maxY: maxY,
            minX: minX,
            minY: minY
        }, isInvalidLimit);
    },
    normalizeNumber: function normalizeNumber(number) {
        var absolute = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        if (_.isString(number)) {
            if (number.substr(-1, 1) === '%') {
                number = (parseFloat(number) || 0) / 100 * absolute;
            } else if (number === 'left' || number === 'top') {
                number = 0;
            } else if (number === 'right' || number === 'bottom') {
                number = 1;
            } else if (number === 'middle' || number === 'center') {
                number = 0.5;
            } else {
                number = parseFloat(number) || 0;
            }
        }
        var absNumber = Math.abs(number);
        if (absNumber > 0 && absNumber <= 1) {
            number = number * absolute;
        }
        return number;
    },
    getCoords: function getCoords(position, layerWidth, layerHeight) {
        var width = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
        var height = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];


        if (_.isString(position)) {
            position = position.split(' ');
        }
        if (_.isArray(position)) {
            position = _.map(position, function (pos) {
                return pos.toLowerCase ? pos.toLowerCase() : pos;
            });
            var _position = position;

            var _position2 = _slicedToArray(_position, 2);

            var x = _position2[0];
            var y = _position2[1];

            if (['top', 'bottom', 'middle'].indexOf(position[0]) !== -1) {
                y = position[0];
            }
            if (['left', 'right', 'center'].indexOf(position[1]) !== -1) {
                x = position[1];
            }
            if (_.isString(x)) {
                if (x === 'left') {
                    x = 0;
                } else if (x === 'right') {
                    x = layerWidth - width;
                } else if (x === 'center') {
                    x = (layerWidth - width) / 2;
                } else {
                    x = helpers.normalizeNumber(x, layerWidth);
                }
            } else if (_.isUndefined(x)) {
                x = 0;
            }
            if (_.isString(y)) {
                if (y === 'top') {
                    y = 0;
                } else if (y === 'bottom') {
                    y = layerHeight - height;
                } else if (y === 'middle') {
                    y = (layerHeight - height) / 2;
                } else {
                    y = helpers.normalizeNumber(y, layerHeight);
                }
            } else if (_.isUndefined(y)) {
                y = 0;
            }
            return { x: x, y: y };
        }
    },
    proxyChildren: function proxyChildren(children) {
        var seriesProps = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var extraProps = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


        var limits = _.pick(seriesProps, limitsPropNames);
        seriesProps = helpers.normalizeSeries(seriesProps);
        var limitsCalculated = _.pick(seriesProps, limitsPropNames);
        var _seriesProps = seriesProps;
        var series = _seriesProps.series;


        return React.Children.map(children, function (child) {

            if (!child) {
                return child;
            }

            var props = {};
            _.assign(props, child.props);
            _.defaultsDeep(props, _.isFunction(extraProps) ? extraProps(child) : extraProps);

            var childLimits = _.pick(child.props, limitsPropNames);
            var childSeriesProps = helpers.normalizeSeries(_.defaults(child.props, {
                layerWidth: props.layerWidth,
                layerHeight: props.layerHeight
            }));
            var childLimitsCalculated = _.pick(childSeriesProps, limitsPropNames);

            _.defaults(props, childLimits, limits, childLimitsCalculated, limitsCalculated);

            if (!child.props.series) {
                if (_.isUndefined(child.props.seriesIndex)) {
                    props.series = series;
                } else if (_.isNumber(child.props.seriesIndex)) {
                    props.series = [series[child.props.seriesIndex]];
                } else if (_.isArray(child.props.seriesIndex)) {
                    props.series = _.map(child.props.seriesIndex, function (index) {
                        return series[index];
                    });
                } else if (_.isFunction(child.props.seriesIndex)) {
                    props.series = _.filter(series, child.props.seriesIndex);
                }
            } else {
                props.series = childSeriesProps.series;
            }
            props.seriesNormalized = true;

            props = _.omitBy(props, _.isUndefined);

            return React.cloneElement(child, props);
        });
    },


    transforms: {
        stack: function stack(props, options) {
            var _ref = options || {};

            var normalize = _ref.normalize;
            var series = props.series;
            var seriesNormalized = props.seriesNormalized;
            var maxX = props.maxX;
            var maxY = props.maxY;
            var minX = props.minX;
            var minY = props.minY;


            var stackedY = [],
                lowestY = [];
            series = _.map(series, function (series) {
                var newSeries = {};
                newSeries.data = _.map(series.data, function (point, pointIndex) {
                    stackedY[pointIndex] = stackedY[pointIndex] || 0;
                    lowestY[pointIndex] = _.isUndefined(lowestY[pointIndex]) && stackedY[pointIndex];
                    var newPoint = {
                        y0: stackedY[pointIndex],
                        y: stackedY[pointIndex] + point.y
                    };
                    stackedY[pointIndex] = newPoint.y;

                    return _.defaults(newPoint, point);
                });
                return _.defaults(newSeries, series);
            });
            minY = _.min(lowestY);
            var stackedMaxY = _.max(stackedY);
            maxY = Math.max(stackedMaxY, maxY);

            if (normalize) {

                var ratios = _.map(stackedY, function (y) {
                    return stackedMaxY / y;
                });
                series = _.map(series, function (series) {
                    var newSeries = {};
                    newSeries.data = _.map(series.data, function (point, pointIndex) {
                        var newPoint = {
                            y0: point.y0 * ratios[pointIndex],
                            y: point.y * ratios[pointIndex]
                        };
                        return _.defaults(newPoint, point);
                    });
                    return _.defaults(newSeries, series);
                });
            }

            return {
                series: series,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY
            };
        },
        stackNormalized: function stackNormalized(props) {
            return helpers.transforms.stack(props, {
                normalize: true
            });
        },
        sort: function sort(props, options) {
            var _ref2 = options || {};

            var direction = _ref2.direction;

            direction = ('' + direction).toLowerCase() || 'asc';

            var series = props.series;
            var seriesNormalized = props.seriesNormalized;
            var maxX = props.maxX;
            var maxY = props.maxY;
            var minX = props.minX;
            var minY = props.minY;


            series = _.map(series, function (series) {
                var newSeries = {};
                newSeries.data = _.sortBy(series.data, 'y');
                if (direction === 'desc') {
                    newSeries.data.reverse();
                }
                newSeries.data = _.map(newSeries.data, function (point, pointIndex) {
                    var newPoint = {
                        realX: point.x,
                        x: pointIndex
                    };
                    return _.defaults(newPoint, point);
                });
                newSeries.data = _.sortBy(newSeries.data, 'realX');
                return _.defaults(newSeries, series);
            });

            return {
                series: series,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY
            };
        },
        unstack: function unstack(props) {
            var series = props.series;
            var seriesNormalized = props.seriesNormalized;
            var maxX = props.maxX;
            var maxY = props.maxY;
            var minX = props.minX;
            var minY = props.minY;


            series = _.map(series, function (series) {
                var newSeries = {};
                newSeries.data = _.map(series.data, function (point) {
                    var newPoint = {
                        y0: 0
                    };
                    return _.defaults(newPoint, point);
                });
                return _.defaults(newSeries, series);
            });

            return {
                series: series,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY
            };
        },
        transpose: function transpose(props) {
            var series = props.series;
            var seriesNormalized = props.seriesNormalized;
            var minX = props.minX;
            var maxY = props.maxY;
            var minY = props.minY;


            var maxX = 0;
            var newSeries = [];
            _.forEach(series, function (series, seriesIndex) {
                _.forEach(series.data, function (point, pointIndex) {
                    newSeries[pointIndex] = newSeries[pointIndex] || { data: [] };
                    maxX = Math.max(maxX, seriesIndex);
                    newSeries[pointIndex].data[seriesIndex] = _.defaults({
                        realX: point.x,
                        x: seriesIndex
                    }, point);
                });
            });

            return {
                series: newSeries,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY
            };
        },
        rotate: function rotate(props) {
            var series = props.series;
            var seriesNormalized = props.seriesNormalized;
            var minX = props.minX;
            var maxX = props.maxX;
            var maxY = props.maxY;
            var minY = props.minY;
            var scaleX = props.scaleX;
            var scaleY = props.scaleY;
            var _scaleX = scaleX;
            var paddingLeft = _scaleX.paddingLeft;
            var paddingRight = _scaleX.paddingRight;
            var _scaleY = scaleY;
            var paddingTop = _scaleY.paddingTop;
            var paddingBottom = _scaleY.paddingBottom;

            scaleX = _.cloneDeep(scaleX);
            scaleY = _.cloneDeep(scaleY);
            scaleX.paddingLeft = paddingTop;
            scaleX.paddingRight = paddingBottom;
            scaleX.swap = !scaleX.swap;
            scaleY.paddingTop = paddingLeft;
            scaleY.paddingBottom = paddingRight;
            scaleY.swap = !scaleY.swap;
            scaleY.direction = -1;

            return {
                series: series,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY,
                scaleX: scaleX,
                scaleY: scaleY
            };
        },
        reverse: function reverse(_ref3) {
            var series = _ref3.series;
            var seriesNormalized = _ref3.seriesNormalized;
            var minX = _ref3.minX;
            var maxX = _ref3.maxX;
            var maxY = _ref3.maxY;
            var minY = _ref3.minY;

            if (_.isArray(series)) {
                series = _.cloneDeep(series).reverse();
            }
            return {
                series: series,
                seriesNormalized: seriesNormalized,
                maxX: maxX,
                maxY: maxY,
                minX: minX,
                minY: minY
            };
        }
    },

    transform: function transform(props, method) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        if (!_.isArray(method)) {
            method = [method];
        }

        return _.reduce(method, function (props, method) {
            if (_.isString(method)) {
                if (helpers.transforms[method]) {
                    return _.defaults(helpers.transforms[method](props, options), props);
                } else {
                    return props;
                }
            } else if (_.isFunction(method)) {
                return _.defaults(method(props, options), props);
            } else if (_.isObject(method)) {
                return helpers.transform(props, method.method, method.options);
            } else {
                return props;
            }
        }, props);
    },
    value: function value(attribute, args) {
        if (_.isArray(attribute)) {
            var result;
            _.forEach(attribute, function (attr) {
                attr = _.isFunction(attr) ? attr(args) : attr;
                if (_.isPlainObject(attr) && _.isUndefined(attr._owner) && _.isUndefined(attr.props)) {
                    result = _.defaults(result || {}, attr);
                } else if (!_.isUndefined(attr)) {
                    result = attr;
                    return false;
                }
            });
            return result;
        } else {
            return _.isFunction(attribute) ? attribute(args) : attribute;
        }
    },
    colorFunc: function colorFunc(colors) {
        if (_.isFunction(colors)) {
            return colors;
        } else if (_.isEmpty(colors)) {
            return d3.scale.category20();
        } else if (_.isString(colors)) {
            return d3.scale[colors]();
        } else {
            return d3.scale.ordinal().range(colors);
        }
    },


    propTypes: {
        series: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string,
            color: React.PropTypes.string,
            opacity: React.PropTypes.number,
            style: React.PropTypes.object,
            data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.arrayOf(React.PropTypes.number), React.PropTypes.shape({
                x: React.PropTypes.number,
                y: React.PropTypes.number,
                color: React.PropTypes.string,
                opacity: React.PropTypes.number,
                style: React.PropTypes.object
            })]))
        }))
    }

};

module.exports = helpers;