export type Nullable<T> = T | null | undefined;
export type KeyObject<T> = T extends {} ? T[keyof T] : never;
