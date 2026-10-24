import { describe, expect, it } from 'vitest';
import {
  angularSeparationDeg,
  equatorialToHorizontal,
  resolveSkyPointing,
  type Observer,
  type SkyTarget,
} from './sky.js';

// At J2000 (2000-01-01T12:00:00Z), Greenwich mean sidereal angle is
// 280.46061837°. Synthetic targets at transit and +/-90° hour angle make the
// geometry independently inspectable without relying on a live data service.
const observer: Observer = {
  latitudeDeg: 0,
  longitudeDeg: 0,
  observedAt: new Date('2000-01-01T12:00:00.000Z'),
};

const star = (id: string, ra: number): SkyTarget => ({
  id,
  name: `Synthetic ${id}`,
  kind: 'star',
  frame: 'equatorial',
  rightAscensionDeg: ra,
  declinationDeg: 0,
  sourceId: 'test-fixture',
  sourceVersion: '1',
});

describe('sky geometry', () => {
  it('places a transit target at the equatorial zenith', () => {
    const position = equatorialToHorizontal(observer, 280.46061837, 0);
    expect(position.altitudeDeg).toBeCloseTo(90, 5);
  });

  it('distinguishes rising east from setting west', () => {
    const rising = equatorialToHorizontal(observer, 10.46061837, 0);
    const setting = equatorialToHorizontal(observer, 190.46061837, 0);
    expect(rising.altitudeDeg).toBeCloseTo(0, 5);
    expect(rising.azimuthDeg).toBeCloseTo(90, 5);
    expect(setting.azimuthDeg).toBeCloseTo(270, 5);
  });

  it('uses a great-circle separation at the azimuth wrap boundary', () => {
    expect(
      angularSeparationDeg(
        { azimuthDeg: 359, altitudeDeg: 0 },
        { azimuthDeg: 1, altitudeDeg: 0 }
      )
    ).toBeCloseTo(2, 5);
  });

  it('identifies one synthetic star and does not rank below-horizon targets', () => {
    const result = resolveSkyPointing(
      observer,
      {
        azimuthDeg: 90,
        altitudeDeg: 1,
        uncertaintyDeg: 0.5,
        selectionRadiusDeg: 5,
      },
      [
        star('west', 190.46061837),
        star('east', 10.46061837),
        star('below', 100.46061837),
      ]
    );
    expect(result.status).toBe('matched');
    expect(result.matches[0]?.target.id).toBe('east');
    expect(result.matches.some((match) => match.target.id === 'below')).toBe(
      false
    );
  });

  it('requires the user to disambiguate objects inside sensor uncertainty', () => {
    const result = resolveSkyPointing(
      observer,
      {
        azimuthDeg: 90,
        altitudeDeg: 10,
        uncertaintyDeg: 3,
        selectionRadiusDeg: 8,
      },
      [
        {
          id: 'a',
          name: 'A',
          kind: 'planet',
          frame: 'horizontal',
          position: { azimuthDeg: 90, altitudeDeg: 10 },
          sourceId: 'ephemeris',
          sourceVersion: '1',
        },
        {
          id: 'b',
          name: 'B',
          kind: 'moon',
          frame: 'horizontal',
          position: { azimuthDeg: 92, altitudeDeg: 10 },
          sourceId: 'ephemeris',
          sourceVersion: '1',
        },
      ]
    );
    expect(result.status).toBe('ambiguous');
    expect(result.matches).toHaveLength(2);
  });

  it('asks for calibration when orientation uncertainty is too high', () => {
    expect(
      resolveSkyPointing(
        observer,
        {
          azimuthDeg: 90,
          altitudeDeg: 10,
          uncertaintyDeg: 16,
          selectionRadiusDeg: 8,
        },
        [star('east', 10.46061837)]
      ).status
    ).toBe('needs-calibration');
  });

  it('rejects invalid time and coordinates instead of producing plausible labels', () => {
    expect(() =>
      equatorialToHorizontal({ ...observer, observedAt: new Date('bad') }, 0, 0)
    ).toThrow(RangeError);
    expect(() =>
      equatorialToHorizontal({ ...observer, latitudeDeg: 91 }, 0, 0)
    ).toThrow(RangeError);
    expect(() => equatorialToHorizontal(observer, 0, Number.NaN)).toThrow(
      RangeError
    );
    expect(() =>
      resolveSkyPointing(
        observer,
        {
          azimuthDeg: 90,
          altitudeDeg: 10,
          uncertaintyDeg: 1,
          selectionRadiusDeg: 8,
        },
        [star('duplicate', 1), star('duplicate', 2)]
      )
    ).toThrow(TypeError);
  });
});
