// five digit Live ID as integer
export const active_event_live_ids: Set<number> = new Set([22119]);

// five digit Live ID => unix timestamp in ms
export const limited_song_deadlines: {[liveId: number]: number} = {};
