

export function convertToMap<T>(data: Record<string, any>, ModelClass: new (data: any) => T): Map<string, T> {
    return new Map<string, T>(
        Object.entries(data).map(([key, value]) => [key, new ModelClass(value)])
    );
}