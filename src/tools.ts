export function mergeObjects<A extends object, B extends object>(a: A, b: B): A & B {
    const result = { ...b };
    Object.assign(result, a);
    return result as A & B;
}

export function formatTime(timestamp: string) {
    return new Date(timestamp).toISOString();
}

