
export async function splitArrayByParity<T>(arr: T[]): Promise<[T[], T[]]> {
    // [even_indexed_array, odd_indexed_array]
    return arr.reduce((acc, current, index) => {
        if (index % 2 === 0) {
            // 偶数索引 (0, 2, 4, ...)
            acc[0].push(current);
        } else {
            // 奇数索引 (1, 3, 5, ...)
            acc[1].push(current);
        }
        return acc;
    }, [[], []] as [T[], T[]]); // 初始值是一个包含两个空数组的元组
}

export function formatLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() 返回 0-11
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}