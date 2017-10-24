export const wrap = (index, length) => (length + (index % length)) % length;
export const clamp = (index, min, max) => Math.max(min, Math.min(index, max));
