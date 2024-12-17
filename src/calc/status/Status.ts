export function getRandomStatusProc(damage: { [key: string]: number }): string {
    const totalDamage = Object.values(damage).reduce(
        (sum, value) => sum + value,
        0,
    );
    const randomValue = Math.random() * totalDamage;
    let cumulative = 0;

    for (const [type, value] of Object.entries(damage)) {
        cumulative += value;
        if (randomValue <= cumulative) {
            return type;
        }
    }

    // Fallback in case of rounding errors
    return Object.keys(damage)[0];
}
