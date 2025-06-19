declare type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
declare type ValueOf<T> = T[keyof T]