import geohash from "ngeohash";

export const GEO_HASH_PRECISION = 8; // ≈ 38 m

export const encodeHash = (lat: number, lng: number) =>
  geohash.encode(lat, lng, GEO_HASH_PRECISION);

export const neighborSet = (lat: number, lng: number) => {
  const centre = encodeHash(lat, lng);
  return [centre, ...geohash.neighbors(centre)];
};
