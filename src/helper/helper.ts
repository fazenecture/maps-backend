import MapsDB from "../db/db";
import { Coord, ICalculateDistKmObj, IKdNode } from "../types/types";

export default class MapsHelper extends MapsDB {
  private readonly R = 6371;

  private readonly toRad = (deg: number) => (deg * Math.PI) / 180;

  protected calculateDistKm = ({
    from_lat,
    from_long,
    to_lat,
    to_long,
  }: ICalculateDistKmObj): number => {
    const dLat = this.toRad(to_lat - from_lat);
    const dLng = this.toRad(to_long - from_long);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(from_lat)) *
        Math.cos(this.toRad(to_lat)) *
        Math.sin(dLng / 2) ** 2;
    return 2 * this.R * Math.asin(Math.sqrt(a));
  };

  private readonly distKmCoords = (a: Coord, b: Coord) =>
    this.calculateDistKm({
      from_lat: a[1],
      from_long: a[0],
      to_lat: b[1],
      to_long: b[0],
    });

  private readonly buildKd = (
    idxs: number[],
    depth: number,
    pts: Coord[]
  ): IKdNode | undefined => {
    if (!idxs.length) return undefined;
    const axis = (depth % 2) as 0 | 1;
    idxs.sort((a, b) => pts[a][axis] - pts[b][axis]);
    const mid = idxs.length >> 1;

    return {
      idx: idxs[mid],
      axis,
      left: this.buildKd(idxs.slice(0, mid), depth + 1, pts),
      right: this.buildKd(idxs.slice(mid + 1), depth + 1, pts),
    };
  };

  private nnSearch = (
    node: IKdNode | undefined,
    target: Coord,
    best: { idx: number; d: number },
    pts: Coord[],
    visited: boolean[]
  ): { idx: number; d: number } => {
    if (!node) return best;

    if (!visited[node.idx]) {
      const d = this.distKmCoords(target, pts[node.idx]);
      if (d < best.d) best = { idx: node.idx, d };
    }

    const axis = node.axis;
    const diff = target[axis] - pts[node.idx][axis];
    const first = diff < 0 ? node.left : node.right;
    const second = diff < 0 ? node.right : node.left;

    best = this.nnSearch(first, target, best, pts, visited);

    if (Math.abs(diff) < best.d)
      best = this.nnSearch(second, target, best, pts, visited);

    return best;
  };

  public salesmanRoute(points: Coord[]) {
    const n = points.length;
    if (n < 2) return { orderedCoords: points, totalKm: 0 };

    const kdRoot = this.buildKd([...points.keys()], 0, points);

    const visited = Array(n).fill(false);
    const path: number[] = [0];
    visited[0] = true;

    for (let step = 1; step < n - 1; step++) {
      const last = path[path.length - 1];
      const { idx: next } = this.nnSearch(
        kdRoot,
        points[last],
        { idx: -1, d: Infinity },
        points,
        visited
      );
      path.push(next);
      visited[next] = true;
    }
    path.push(n - 1);

    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 1; i < n - 2; i++) {
        for (let k = i + 1; k < n - 1; k++) {
          const a = path[i - 1],
            b = path[i],
            c = path[k],
            d = path[k + 1];

          const delta =
            this.distKmCoords(points[a], points[c]) +
            this.distKmCoords(points[b], points[d]) -
            this.distKmCoords(points[a], points[b]) -
            this.distKmCoords(points[c], points[d]);

          if (delta < -1e-6) {
            for (let l = 0, r = k - i; l < r; l++, r--)
              [path[i + l], path[i + r]] = [path[i + r], path[i + l]];
            improved = true;
          }
        }
      }
    }

    const orderedCoords = path.map((i) => points[i]);
    const totalKm = orderedCoords
      .slice(1)
      .reduce(
        (sum, cur, i) => sum + this.distKmCoords(orderedCoords[i], cur),
        0
      );

    return { orderedCoords, totalKm };
  }
}
