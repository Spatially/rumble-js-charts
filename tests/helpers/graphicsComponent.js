'use strict';

const enzyme = require('enzyme');
const _ = require('lodash');
const d3 = require('d3');
const Chart = require('../../lib/Chart');
const generateRandomSeries = require('./generateRandomSeries');
const visibleProps = require('./visibleProps');
const attributesProps = require('./attributesProps');
const styleProps = require('./styleProps');
const later = require('./later');

module.exports = function (Component, options = {}) {
    options = _.defaults({}, options, {
        deepestTag: 'path',
        renderMethod: 'shallow',
        oneDeepestTagPerSeries: false,
        pointStyling: false,
        delay: 0,
        pointGroupClassName: '', // dot, bar
        colorProperty: 'fill', // fill, stroke
        defaultProps: {
            colors: 'category20'
        },
        visibleProperties: {
            seriesVisible: ['g', 'series']
        },
        attributesProperties: {
            seriesAttributes: ['g', 'series']
        },
        styleProperties: {
            seriesStyle: ['g', 'series']
        },
        chartWidth: 100,
        chartHeight: 100
    });

    const delayed = function (callback) {
        return later(callback, options.delay);
    };
    const render = _.isFunction(options.renderMethod) ?
        options.renderMethod(enzyme) :
        enzyme[options.renderMethod];

    let {seriesNumbers3x5, seriesArrays3x5, seriesObjects3x5} = options;
    const {chartWidth, chartHeight} = options;

    if (!seriesNumbers3x5) {
        seriesNumbers3x5 = generateRandomSeries(3, 5, {type: 'numbers'});
    }
    if (!seriesArrays3x5) {
        seriesArrays3x5 = generateRandomSeries(3, 5, {type: 'array'});
    }
    if (!seriesObjects3x5) {
        seriesObjects3x5 = generateRandomSeries(3, 5, {type: 'object'});
    }

    describe('Graphics renderer component', () => {

        describe('should support series property', () => {

            describe('data', () => {

                pit('as an array of numbers', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

                pit('as an array of [x,y] pairs', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesArrays3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

                pit('as an array of {x,y} objects', () => {
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                        <Component />
                    </Chart>);
                    return delayed(() => {
                        checkNormalizedSeries(wrapper.find(Component).prop('series'), 3, 5);
                    });
                });

            });

            describe('color', () => {
                pit('as a string', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].color = 'violet';
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component/>
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find(options.deepestTag).first();
                        expect(path.prop(options.colorProperty)).toEqual('violet');
                    });
                });

                // TODO:
                xit('as an array of strings for gradient', () => {
                });
            });

            describe('opacity', () => {
                pit('as a number', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].opacity = 0.85;
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component className='chart'/>
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find('g.chart-series').first();
                        expect(path.prop('opacity')).toEqual('0.85');
                    });
                });
            });

            describe('style', () => {
                pit('as an object', () => {
                    const series = _.cloneDeep(seriesNumbers3x5);
                    series[0].style = {
                        stroke: '#f0f',
                        fontSize: 24
                    };
                    const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                        <Component/>
                    </Chart>);
                    return delayed(() => {
                        const path = wrapper.render().find(options.deepestTag).first();
                        expect(path.prop('style')).toEqual(jasmine.objectContaining({
                            'font-size': '24px',
                            'stroke': '#f0f'
                        }));
                    });
                });
            });

            if (options.pointStyling) {
                describe('color for specific point', () => {
                    pit('as a string', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].color = 'red';
                        series[0].data[0].color = 'violet';
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component/>
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop(options.colorProperty)).toEqual('violet');
                        });
                    });

                    // TODO:
                    xit('as an array of strings for gradient', () => {
                    });
                });

                describe('opacity', () => {
                    pit('as a number', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].opacity = 0.85;
                        series[0].data[0].opacity = 0.74;
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component className='chart'/>
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop(options.colorProperty + '-opacity')).toEqual('0.74');
                        });
                    });
                });

                describe('style', () => {
                    pit('as an object', () => {
                        const series = _.cloneDeep(seriesObjects3x5);
                        series[0].style = {fill: 'red'};
                        series[0].data[0].style = {
                            stroke: '#f0f',
                            fontSize: 24
                        };
                        const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={series}>
                            <Component/>
                        </Chart>);
                        return delayed(() => {
                            const path = wrapper.render().find(options.deepestTag).first();
                            expect(path.prop('style')).toEqual(jasmine.objectContaining({
                                'font-size': '24px',
                                'stroke': '#f0f',
                                'fill': 'red'
                            }));
                        });
                    });
                });
            }

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.series({series: seriesNumbers3x5}, 'series', '', null)).toEqual(null);
                expect(Component.propTypes.series({series: seriesArrays3x5}, 'series', '', null)).toEqual(null);
                expect(Component.propTypes.series({series: seriesObjects3x5}, 'series', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('series')).toBeUndefined();
            });

            xit('should not normalize series itself', () => {
                /*
                 TODO:
                 graphics renderers don't normalize series, but Chart or any other wrapper do that,
                 that's not good to mutate child's property in the parent
                 so:
                 - don't normalize child's series
                 - or add series normalization in graphics renderer
                 or
                 we can make normalization only as a transfer method,
                 in that case graphics renderers will support just only normalized series data (object {x,y})
                 but it will increase complexity
                 but also it will increase performance
                 */
            });

        });

        describe('should support seriesIndex property', () => {

            pit('as a number', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={1}/>
                    <Component className='chart2' seriesIndex={2}/>
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(1);
                    expect(wrapper.find(Component).first().prop('series')[0].data).toEqual(seriesObjects3x5[1].data);
                    expect(wrapper.render().find('.chart2-series').length).toEqual(1);
                    expect(wrapper.find(Component).last().prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            pit('as an array of numbers', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={[0, 2]}/>
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(2);
                    expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[0].data);
                    expect(wrapper.find(Component).prop('series')[1].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            pit('as a function that filters series property', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' seriesIndex={(series, seriesIndex) => seriesIndex > 1}/>
                </Chart>);
                return delayed(() => {
                    expect(wrapper.render().find('.chart-series').length).toEqual(1);
                    expect(wrapper.find(Component).prop('series')[0].data).toEqual(seriesObjects3x5[2].data);
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.seriesIndex({seriesIndex: 1}, 'seriesIndex', '', null)).toEqual(null);
                expect(Component.propTypes.seriesIndex({seriesIndex: [0, 2]}, 'seriesIndex', '', null)).toEqual(null);
                expect(Component.propTypes.seriesIndex({
                    seriesIndex: (series, seriesIndex) => seriesIndex > 1
                }, 'seriesIndex', '', null)).toEqual(null);
            });

            pit('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                return delayed(() => {
                    expect(wrapper.find(Component).prop('seriesIndex')).toBeUndefined();
                });
            });

        });

        describe('should support className property', () => {

            pit('should render proper class names', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart'/>
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.length).toEqual(1);
                    const series = root.find('g.chart-series');
                    expect(series.length).toEqual(3);
                    const series0 = root.find('g.chart-series.chart-series-0');
                    expect(series0.length).toEqual(1);
                    if (options.pointGroupClassName) {
                        const points = root.find('.chart-' + options.pointGroupClassName);
                        expect(points.length).toEqual(3 * 5);
                        const points0 = root.find('.chart-' + options.pointGroupClassName + '-0');
                        expect(points0.length).toEqual(3);
                    }
                    const path = series0.find(options.deepestTag);
                    // we have at least 1 or 5 paths
                    expect(path.length).not.toBeLessThan(options.oneDeepestTagPerSeries ? 1 : 5);
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.className({className: 'chart'}, 'className', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('className')).toBeUndefined();
            });

        });

        describe('should support style property', () => {

            pit('should render style in the root element', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}>
                    <Component className='chart' style={{fill: 'red'}}/>
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.prop('style').fill).toEqual('red');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.style({style: {fill: 'red'}}, 'style', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('style')).toBeUndefined();
            });

        });

        describe('should support colors property', () => {

            pit('can be name of predefined color schema', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors='category10'/>
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    const colors = d3.scale.category10().domain(_.range(3));
                    expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                    expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
                });
            });

            pit('can be array', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={['red', 'green', 'blue']}/>
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    const colors = d3.scale.ordinal().range(['red', 'green', 'blue']).domain(_.range(3));
                    expect(paths.first().prop(options.colorProperty)).toEqual(colors(0));
                    expect(paths.last().prop(options.colorProperty)).toEqual(colors(2));
                });
            });

            pit('can be function or d3 scale', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' colors={seriesIndex => '#fff00' + seriesIndex}/>
                </Chart>);
                return delayed(() => {
                    const paths = wrapper.render().find(options.deepestTag);
                    expect(paths.first().prop(options.colorProperty)).toEqual('#fff000');
                    expect(paths.last().prop(options.colorProperty)).toEqual('#fff002');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.colors({colors: 'category20b'}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: ['red', 'blue']}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: seriesIndex => '#fff00' + seriesIndex}, 'colors', '', null)).toEqual(null);
                expect(Component.propTypes.colors({colors: d3.scale.category10()}, 'colors', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('colors')).toEqual(options.defaultProps.colors);
            });

        });

        describe('should support opacity property', () => {

            pit('should apply opacity attribute to the root element', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}>
                    <Component className='chart' opacity={0.9}/>
                </Chart>);
                return delayed(() => {
                    const root = wrapper.render().find('g.chart');
                    expect(root.prop('opacity')).toEqual('0.9');
                });
            });

            it('should be correctly defined in propTypes', () => {
                expect(Component.propTypes.opacity({opacity: 0.9}, 'opacity', '', null)).toEqual(null);
            });

            it('should have no default value', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
                expect(wrapper.find(Component).prop('opacity')).toBeUndefined();
            });

        });

        visibleProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            props: options.visibleProperties
        });

        attributesProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            props: options.attributesProperties
        });

        styleProps(Component, {
            renderMethod: options.renderMethod,
            chartWidth,
            chartHeight,
            seriesObjects3x5,
            props: options.styleProperties
        });

        describe('should receive some properties from the parent', () => {

            it('layerWidth and layerHeight', () => {
                const wrapper = render(<Chart width={chartWidth + 23} height={chartHeight * 3}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('layerWidth')).toEqual(chartWidth + 23);
                expect(chart.prop('layerHeight')).toEqual(chartHeight * 3);
            });

            it('minimums and maximums for each axis', () => {
                const minY = _.min(_.map(seriesNumbers3x5, series => _.min(series.data)));
                const maxY = _.max(_.map(seriesNumbers3x5, series => _.max(series.data)));

                const wrapper = render(<Chart width={chartWidth} height={chartHeight} series={seriesNumbers3x5}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('minX')).toEqual(0);
                expect(chart.prop('maxX')).toEqual(4);
                expect(chart.prop('minY')).toEqual(minY);
                expect(chart.prop('maxY')).toEqual(maxY);
            });

            it('scaleX and scaleY', () => {
                const wrapper = render(<Chart width={chartWidth} height={chartHeight}>
                    <Component />
                </Chart>);
                const chart = wrapper.find(Component);
                expect(chart.prop('scaleX').direction).toEqual(jasmine.any(Number));
                expect(chart.prop('scaleX').factory).toEqual(jasmine.any(Function));
                expect(chart.prop('scaleY').direction).toEqual(jasmine.any(Number));
                expect(chart.prop('scaleY').factory).toEqual(jasmine.any(Function));
            });

        });

        it('should have no children', () => {
            const html1 = render(<Chart width={chartWidth} height={chartHeight}
                                        series={seriesObjects3x5}><Component/></Chart>).html();
            const html2 = render(<Chart width={chartWidth} height={chartHeight} series={seriesObjects3x5}><Component>
                <g>
                    <text />
                </g>
            </Component></Chart>).html();
            expect(html1).toEqual(html2);
        });

        it('should have some default properties', () => {
            const wrapper = render(<Chart width={chartWidth} height={chartHeight}><Component /></Chart>);
            expect(wrapper.find(Component).props()).toEqual(jasmine.objectContaining(options.defaultProps));
        });

    });

    function checkNormalizedSeries(series, seriesCount, pointsCount) {
        expect(series.length).toEqual(seriesCount);
        let seriesIndex = _.random(seriesCount - 1);
        expect(series[seriesIndex].data.length).toEqual(pointsCount);
        _.forEach(_.range(3), () => {
            let seriesIndex = _.random(seriesCount - 1);
            let pointIndex = _.random(pointsCount - 1);
            expect(series[seriesIndex].data[pointIndex].x).toEqual(pointIndex);
            expect(series[seriesIndex].data[pointIndex].y).toEqual(jasmine.any(Number));
        });
    }

};
