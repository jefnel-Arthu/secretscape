import { describe, expect, it } from 'vitest';
import { calculateDistanceKm } from './geo';

describe('calculateDistanceKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(calculateDistanceKm(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0);
  });

  it('returns roughly 111 km for 1 degree of latitude', () => {
    const dist = calculateDistanceKm(48, 0, 49, 0);
    expect(dist).toBeGreaterThan(110);
    expect(dist).toBeLessThan(112);
  });

  it('approximates the Paris-Lyon distance (~391 km)', () => {
    const dist = calculateDistanceKm(48.8566, 2.3522, 45.764, 4.8357);
    expect(dist).toBeGreaterThan(385);
    expect(dist).toBeLessThan(400);
  });

  it('rounds to 1 decimal place', () => {
    const dist = calculateDistanceKm(0, 0, 1, 1);
    const decimal = String(dist).split('.')[1] ?? '';
    expect(decimal.length).toBeLessThanOrEqual(1);
  });
});
