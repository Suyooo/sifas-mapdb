// Trackers for layouting note gimmick markers
// There is one global tracker (unfiltered view) and one local tracker for each gimmick (filtered view).
// When adding a marker, check for the first open layer from the top, and reserve a range around the position

const MARKER_PADDING = 0.002;

class LayerTracker {
    ranges: [number, number, number][] = [];

    addRange(gimmickNo: number, start: number, end: number) {
        const merged: Set<number> = new Set();
        let i = 0;
        for (const other of this.ranges) {
            if (other[1] < start) continue;
            else if (other[0] > end) break;

            if (other[0] <= end && other[1] >= start) {
                merged.add(i);
                start = Math.min(start, other[0]);
                end = Math.max(end, other[1]);
            }
        }

        const newRanges = this.ranges.filter((_, i) => !merged.has(i));
        newRanges.push([start, end, gimmickNo]);
        newRanges.sort((a, b) => a[0] - b[0]);
        this.ranges = newRanges;
    }

    isRangeFree(ignoreGimmickNo: number | null, start: number, end: number) {
        for (const other of this.ranges) {
            if (other[1] < start || other[2] === ignoreGimmickNo) continue;
            else if (other[0] > end) return true;

            if (other[0] <= end && other[1] >= start) {
                return false;
            }
        }
        return true;
    }
}

export class MarkerTracker {
    layers: LayerTracker[] = [new LayerTracker()];

    addMarker(gimmickNo: number, start: number, end?: number): number {
        end = (end === undefined ? start : end) + MARKER_PADDING;
        start = start - MARKER_PADDING;

        let i = this.layers.length - 1;
        while (i >= 0 && this.layers[i].isRangeFree(gimmickNo, start, end)) {
            i--;
        }
        i += 1;
        while (i < this.layers.length && !this.layers[i].isRangeFree(null, start, end)) {
            i++;
        }

        if (i >= this.layers.length) {
            this.layers.push(new LayerTracker());
        }
        this.layers[i].addRange(gimmickNo, start, end);
        return i;
    }

    size(): number {
        return this.layers.length;
    }
}