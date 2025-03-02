/* eslint-disable no-undef */
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';

import { Area, AreaChart, Brush, CartesianAxis, Tooltip, XAxis, YAxis } from '../../src';

describe('AreaChart', () => {
  const data = [
    { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 300, pv: 4567, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 1398, amt: 2400 },
    { name: 'Page D', uv: 200, pv: 9800, amt: 2400 },
    { name: 'Page E', uv: 278, pv: 3908, amt: 2400 },
    { name: 'Page F', uv: 189, pv: 4800, amt: 2400 },
  ];

  test('Renders 2 path in simple AreaChart', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data}>
        <Area type="monotone" dataKey="uv" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-area')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-area-curve')).toHaveLength(1);
  });

  test('Renders 1 dot when data only have one element', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data.slice(0, 1)}>
        <Area type="monotone" dataKey="uv" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-area')).toHaveLength(0);
    expect(container.querySelectorAll('.recharts-area-curve')).toHaveLength(0);
    expect(container.querySelectorAll('.recharts-area-dot')).toHaveLength(1);
  });

  test('Renders empty path when all the datas are null', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data}>
        <Area type="monotone" dataKey="any" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    const areaPath = container.querySelectorAll('.recharts-area-area');
    const curvePath = container.querySelectorAll('.recharts-area-curve');

    expect(areaPath).toHaveLength(1);
    expect(curvePath).toHaveLength(1);
    areaPath.forEach(m => {
      expect(m).not.toHaveAttribute('d');
    });
    curvePath.forEach(m => {
      expect(m).not.toHaveAttribute('d');
    });
  });

  test.skip('Renders customized active dot when activeDot is set to be a ReactElement', () => {
    // eslint-disable-next-line react/prop-types
    const ActiveDot = ({ cx, cy }) => <circle cx={cx} cy={cy} r={10} className="customized-active-dot" />;
    const { container } = render(
      <AreaChart width={400} height={400} data={data}>
        <Area activeDot={<ActiveDot />} type="monotone" dataKey="uv" stroke="#ff7300" fill="#ff7300" />
        <Tooltip />
      </AreaChart>,
    );

    fireEvent.mouseEnter(container, { clientX: 200, clientY: 200 });
    // fireEvent.mouseEnter(container.querySelector('.recharts-curve'));

    expect(container.querySelectorAll('.recharts-active-dot')).toHaveLength(1);
  });

  //   it('Renders customized active dot when activeDot is set to be a function', () => {
  //     const renderActiveDot = ({ cx, cy }) => <circle cx={cx} cy={cy} r={10} className="customized-active-dot" />;
  //     const wrapper = mount(
  //       <AreaChart width={100} height={50} data={data}>
  //         <Area
  //           isAnimationActive={false}
  //           activeDot={renderActiveDot}
  //           type="monotone"
  //           dataKey="uv"
  //           stroke="#ff7300"
  //           fill="#ff7300"
  //         />
  //         <Tooltip />
  //       </AreaChart>
  //     );

  //     wrapper.setState({
  //       isTooltipActive: true,
  //       activeTooltipIndex: 4,
  //       activeTooltipLabel: 4,
  //       activeTooltipCoord: {
  //         x: 95,
  //         y: 21,
  //       },
  //     });

  //     expect(wrapper.find('.customized-active-dot').length).to.equal(1);
  //   });

  test('Renders 4 path in a stacked AreaChart', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data}>
        <Area type="monotone" dataKey="uv" stackId="test" stroke="#ff7300" fill="#ff7300" />
        <Area type="monotone" dataKey="pv" stackId="test" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-area')).toHaveLength(2);
    expect(container.querySelectorAll('.recharts-area-curve')).toHaveLength(2);
  });

  test('Renders 4 path in a vertical AreaChart', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Area type="monotone" dataKey="uv" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-area')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-area-curve')).toHaveLength(1);
  });

  test('Renders dots and labels when dot is setted to true', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={data}>
        <Area isAnimationActive={false} type="monotone" dot label dataKey="uv" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-dots')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-area-dot')).toHaveLength(6);
    expect(container.querySelectorAll('.recharts-label-list')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-label')).toHaveLength(6);
  });

  test('Render empty when data is empty', () => {
    const { container } = render(
      <AreaChart width={100} height={50} data={[]}>
        <Area type="monotone" dot label dataKey="uv" stroke="#ff7300" fill="#ff7300" />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area')).toHaveLength(0);
  });

  describe('<AreaChart /> - Pure Rendering', () => {
    const pureElements = [Area];

    const spies = [];
    // CartesianAxis is what is actually render for XAxis and YAxis
    let axisSpy;

    // spy on each pure element before each test, and restore the spy afterwards
    beforeEach(() => {
      pureElements.forEach((el, i) => {
        spies[i] = sinon.spy(el.prototype, 'render');
      });
      axisSpy = sinon.spy(CartesianAxis.prototype, 'render');
    });
    afterEach(() => {
      pureElements.forEach((el, i) => spies[i].restore());
      axisSpy.restore();
    });

    // protect against the future where someone might mess up our clean rendering
    test('should only render Area once when the mouse enters and moves', () => {
      const chart = (
        <AreaChart width={400} height={400} data={data}>
          <Area isAnimationActive={false} type="monotone" dot label dataKey="uv" />
          <Tooltip />
          <XAxis />
          <YAxis />
          <Brush />
        </AreaChart>
      );
      const { container } = render(chart);

      spies.forEach(el => expect(el.callCount).toEqual(1));
      expect(axisSpy.callCount).toEqual(2);

      fireEvent.mouseEnter(container, { clientX: 30, clientY: 200 });
      fireEvent.mouseMove(container, { clientX: 200, clientY: 200 });
      fireEvent.mouseLeave(container);

      spies.forEach(el => expect(el.callCount).toEqual(1));
      expect(axisSpy.callCount).toEqual(2);
    });

    // protect against the future where someone might mess up our clean rendering
    test.skip("should only render Area once when the brush moves but doesn't change start/end indices", () => {
      const onBrushChangeMock = jest.fn();
      render(
        <AreaChart width={400} height={400} data={data}>
          <Area isAnimationActive={false} type="monotone" dot label dataKey="uv" />
          <Tooltip />
          <XAxis />
          <YAxis />
          <Brush onChange={onBrushChangeMock} />
        </AreaChart>,
      );

      spies.forEach(el => expect(el.callCount).toEqual(1));
      expect(axisSpy.callCount).toEqual(2);

      // onBrushChangeMock.mock.calls[0]({ startIndex: 0, endIndex: data.length - 1 });
      // wrapper.instance().handleBrushChange({ startIndex: 0, endIndex: data.length - 1 });
      // spies.forEach(el => expect(el.callCount).toEqual(1));
      // expect(axisSpy.callCount).toEqual(2);
    });
  });
});
