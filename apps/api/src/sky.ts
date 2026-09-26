/**
 * Deterministic sky geometry for the observer experience. This module never
 * invents celestial positions: fixed equatorial coordinates come from a
 * versioned catalog; moving bodies must arrive as computed horizontal
 * coordinates from a separate ephemeris adapter.
 */

export interface Observer {
  latitudeDeg: number;
  longitudeDeg: number; // East-positive, WGS84-style geographic longitude.
  observedAt: Date;
}

export interface HorizontalPosition {
  azimuthDeg: number; // North 0°, east 90°, clockwise.
  altitudeDeg: number; // Geometric horizon 0°; no refraction correction.
}

export type SkyTarget = {
  id: string;
  name: string;
  kind: 'star' | 'planet' | 'moon' | 'other';
  sourceId: string;
  sourceVersion: string;
  visualMagnitude?: number;
} & (
  | { frame: 'equatorial'; rightAscensionDeg: number; declinationDeg: number }
  | { frame: 'horizontal'; position: HorizontalPosition }
);

export interface Pointing extends HorizontalPosition {
  /** 1σ-like sensor estimate, used for selection only; not a calibrated probability. */
  uncertaintyDeg: number;
  /** Radius about the screen center within which the user is selecting. */
  selectionRadiusDeg: number;
}

export interface TargetMatch {
  target: SkyTarget;
  position: HorizontalPosition;
  separationDeg: number;
}

export type SkyResolution =
  | { status: 'needs-calibration' | 'no-candidates'; matches: [] }
  | {
      status: 'out-of-field' | 'matched' | 'ambiguous';
      matches: TargetMatch[];
    };

const radians = (degrees: number): number => (degrees * Math.PI) / 180;
const degrees = (angle: number): number => (angle * 180) / Math.PI;
const wrapDegrees = (angle: number): number => ((angle % 360) + 360) % 360;
const clamp = (number: number, low: number, high: number): number =>
  Math.max(low, Math.min(high, number));

function assertNumber(
  value: number,
  label: string,
  min: number,
  max: number
): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${label} must be finite and within [${min}, ${max}]`);
  }
}

function assertObserver(observer: Observer): void {
  assertNumber(observer.latitudeDeg, 'latitudeDeg', -90, 90);
  assertNumber(observer.longitudeDeg, 'longitudeDeg', -180, 180);
  if (
    !(observer.observedAt instanceof Date) ||
    !Number.isFinite(observer.observedAt.getTime())
  ) {
    throw new RangeError('observedAt must be a valid Date');
  }
}

function assertHorizontal(position: HorizontalPosition): void {
  assertNumber(position.azimuthDeg, 'azimuthDeg', 0, 360);
  assertNumber(position.altitudeDeg, 'altitudeDeg', -90, 90);
}

/** Approximate mean sidereal direction. Adequate for a first pointing
 * candidate filter, not astrometry, spacecraft navigation, or final accuracy
 * claims. Proper motion, parallax, nutation, precession and refraction are not
 * applied. A production catalog adapter must define its coordinate epoch. */
export function equatorialToHorizontal(
  observer: Observer,
  rightAscensionDeg: number,
  declinationDeg: number
): HorizontalPosition {
  assertObserver(observer);
  assertNumber(rightAscensionDeg, 'rightAscensionDeg', 0, 360);
  assertNumber(declinationDeg, 'declinationDeg', -90, 90);

  const julianDay = observer.observedAt.getTime() / 86_400_000 + 2_440_587.5;
  const centuries = (julianDay - 2_451_545) / 36_525;
  const gmstDeg =
    280.46061837 +
    360.98564736629 * (julianDay - 2_451_545) +
    0.000387933 * centuries ** 2 -
    centuries ** 3 / 38_710_000;
  const hourAngle = radians(
    wrapDegrees(gmstDeg + observer.longitudeDeg - rightAscensionDeg)
  );
  const latitude = radians(observer.latitudeDeg);
  const declination = radians(declinationDeg);
  const east = -Math.cos(declination) * Math.sin(hourAngle);
  const north =
    Math.sin(declination) * Math.cos(latitude) -
    Math.cos(declination) * Math.cos(hourAngle) * Math.sin(latitude);
  const up =
    Math.sin(declination) * Math.sin(latitude) +
    Math.cos(declination) * Math.cos(hourAngle) * Math.cos(latitude);

  return {
    azimuthDeg: wrapDegrees(degrees(Math.atan2(east, north))),
    altitudeDeg: degrees(Math.asin(clamp(up, -1, 1))),
  };
}

export function angularSeparationDeg(
  a: HorizontalPosition,
  b: HorizontalPosition
): number {
  assertHorizontal(a);
  assertHorizontal(b);
  const altitudeA = radians(a.altitudeDeg);
  const altitudeB = radians(b.altitudeDeg);
  const cosine =
    Math.sin(altitudeA) * Math.sin(altitudeB) +
    Math.cos(altitudeA) *
      Math.cos(altitudeB) *
      Math.cos(radians(a.azimuthDeg - b.azimuthDeg));
  return degrees(Math.acos(clamp(cosine, -1, 1)));
}

/**
 * Ranks candidates by actual spherical separation, never by AI text or image
 * similarity. Ambiguity is explicit when two candidates fit within the sensor
 * uncertainty; the caller must let the observer select or calibrate.
 */
export function resolveSkyPointing(
  observer: Observer,
  pointing: Pointing,
  targets: readonly SkyTarget[]
): SkyResolution {
  assertObserver(observer);
  assertHorizontal(pointing);
  assertNumber(pointing.uncertaintyDeg, 'uncertaintyDeg', 0, 180);
  assertNumber(pointing.selectionRadiusDeg, 'selectionRadiusDeg', 0.1, 90);
  if (pointing.uncertaintyDeg > 15)
    return { status: 'needs-calibration', matches: [] };
  if (targets.length === 0) return { status: 'no-candidates', matches: [] };

  const seen = new Set<string>();
  const ranked = targets
    .map((target): TargetMatch => {
      if (
        !target.id ||
        !target.name ||
        !target.sourceId ||
        !target.sourceVersion ||
        seen.has(target.id)
      ) {
        throw new TypeError(
          'targets need unique IDs, names, source IDs, and source versions'
        );
      }
      seen.add(target.id);
      if (
        target.visualMagnitude !== undefined &&
        !Number.isFinite(target.visualMagnitude)
      ) {
        throw new RangeError('visualMagnitude must be finite');
      }
      const position =
        target.frame === 'equatorial'
          ? equatorialToHorizontal(
              observer,
              target.rightAscensionDeg,
              target.declinationDeg
            )
          : target.position;
      assertHorizontal(position);
      return {
        target,
        position,
        separationDeg: angularSeparationDeg(pointing, position),
      };
    })
    // Float error around exactly 0° must not discard a horizon candidate.
    .filter((match) => match.position.altitudeDeg >= -1e-9)
    .sort(
      (a, b) =>
        a.separationDeg - b.separationDeg ||
        a.target.id.localeCompare(b.target.id)
    );

  const matches = ranked.filter(
    (match) => match.separationDeg <= pointing.selectionRadiusDeg
  );
  if (matches.length === 0)
    return { status: 'out-of-field', matches: ranked.slice(0, 3) };
  const plausible = matches.filter(
    (match) =>
      match.separationDeg <= matches[0].separationDeg + pointing.uncertaintyDeg
  );
  return {
    status: plausible.length > 1 ? 'ambiguous' : 'matched',
    matches: matches.slice(0, 3),
  };
}
