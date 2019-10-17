export type ReadOnly<T> = {
    readonly [P in keyof T]: T[P]
}


export type Partial<T> = {
    [P in keyof T]?: T[P]
}


export type Nullable<T> = {
    [P in keyof T]: T[P] | null
}


export type Proxy<T> = {
    get(): T
    set(value: T): void
}


export type Pick<T, K extends keyof T> = {
    [P in K]: T[P]
}


export type Record<K extends string, T> = {
    [P in K]: T
}
