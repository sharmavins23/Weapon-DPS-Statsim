export interface SimOutput {
    dps: number;
    shotCount: number;
    averageDamagePerShot: number;
    effectiveCritRate: number;
}

export interface ShotOutput {
    damage: number;
    isCrit: boolean;
}
