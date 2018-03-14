export const wrap = (index, length) => index > length ? 0 : index;
export const clamp = (index, min, max) => Math.max(min, Math.min(index, max));
