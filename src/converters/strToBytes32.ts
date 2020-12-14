export const strToBytes32 = (n: string): string => '0x' + Buffer.from(n).toString('hex').padEnd(64, '0');
