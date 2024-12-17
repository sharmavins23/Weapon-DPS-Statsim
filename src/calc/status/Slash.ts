import { PrimaryWeapon } from "@/data/weapons/primary/PrimaryWeapon";

export interface iSlashProc {
    damage: number;
    ticks: number; // Number of ticks remaining
    time: number; // Time of last tick
}

export function calculateSlashProcBleedDamage(weapon: PrimaryWeapon): number {
    let baseDamage =
        weapon.damage.impact +
        weapon.damage.puncture +
        weapon.damage.slash +
        weapon.damage.heat +
        weapon.damage.cold +
        weapon.damage.electricity +
        weapon.damage.toxin +
        weapon.damage.blast +
        weapon.damage.radiation +
        weapon.damage.gas +
        weapon.damage.magnetic +
        weapon.damage.viral +
        weapon.damage.corrosive;
    let bleedDamage = 0.35 * baseDamage;
    return bleedDamage;
}
