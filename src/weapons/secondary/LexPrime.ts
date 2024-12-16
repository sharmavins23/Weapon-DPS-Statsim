import { SimOutput } from "@/calc/SimOutput";
import {
    Secondary,
    SecondaryFiringModes,
    SecondaryStats,
} from "@/formats/Secondary";

export class LexPrime extends Secondary {
    stats: Partial<Record<SecondaryFiringModes, SecondaryStats>>;

    constructor() {
        super("Lex Prime");

        this.stats = {
            [SecondaryFiringModes.PRIMARY]: {
                accuracy: 16.0,
                critical: {
                    chance: 25.0,
                    multiplier: 2.0,
                },
                fireRate: 2.08,
                magazine: {
                    cost: 1,
                    size: 8,
                    max: 210,
                },
                multishot: 1.0,
                reload: 2.35,
                statusChance: 25.0,
                ips: {
                    impact: 18.0,
                    puncture: 144.0,
                    slash: 18.0,
                },
                elements: {
                    heat: 0.0,
                    cold: 0.0,
                    electricity: 0.0,
                    toxin: 0.0,
                    blast: 0.0,
                    radiation: 0.0,
                    gas: 0.0,
                    magnetic: 0.0,
                    viral: 0.0,
                    corrosive: 0.0,
                },
            },
            [SecondaryFiringModes.INCARNON]: {
                accuracy: 16.0,
                critical: {
                    chance: 35.0,
                    multiplier: 3.0,
                },
                fireRate: 0.67,
                magazine: {
                    cost: 1,
                    size: 20,
                    max: 20,
                },
                multishot: 1.0,
                reload: 3.0,
                statusChance: 44.0,
                ips: {
                    impact: 400.0,
                    puncture: 0.0,
                    slash: 0.0,
                },
                elements: {
                    heat: 0.0,
                    cold: 0.0,
                    electricity: 0.0,
                    toxin: 0.0,
                    blast: 0.0,
                    radiation: 800.0,
                    gas: 0.0,
                    magnetic: 0.0,
                    viral: 0.0,
                    corrosive: 0.0,
                },
            },
        };
    }

    simulateDPS(enableQuantization: boolean = true): SimOutput {
        // Get our stats
        let stats = {
            primary: this.stats[SecondaryFiringModes.PRIMARY]!,
            incarnon: this.stats[SecondaryFiringModes.INCARNON]!,
        };

        let timestep = 0.01;
        let totalSimTime = 1_000_000.0;
        let lastFiredTime = -999.0;
        let isRecoiling = false;
        let reloadTriggeredTime = -999.0;
        let isReloading = false;

        let remainingAmmoInMag = stats.primary.magazine.size;

        let totalDamageDealt = 0.0;
        let totalNumberOfShots = 0;
        let totalNumberOfCrits = 0;

        // Compute status effects
        let statusEffects = [];

        // Simulate for many seconds
        for (let time = 0.0; time < totalSimTime; time += timestep) {
            // Skip if recoiling
            if (isRecoiling) {
                // If we're done recoiling, reset the flag
                if (time - lastFiredTime >= 1.0 / stats.primary.fireRate) {
                    isRecoiling = false;
                }
                continue;
            }

            // Skip if reloading
            if (isReloading) {
                // If we're done reloading, reset the flag
                if (time - reloadTriggeredTime >= stats.primary.reload) {
                    isReloading = false;
                    remainingAmmoInMag = stats.primary.magazine.size;
                } else continue;
            }

            // If we're out of ammo, trigger reload
            if (remainingAmmoInMag <= 0) {
                isReloading = true;
                reloadTriggeredTime = time;
                continue;
            }

            // If we can fire, fire!
            if (!isRecoiling && !isReloading) {
                // Fire the primary
                let rawDamageOnShot = this.calculateRawDamagePerShot(
                    SecondaryFiringModes.PRIMARY,
                    enableQuantization
                );
                totalDamageDealt += rawDamageOnShot.damage;
                totalNumberOfShots++;
                totalNumberOfCrits += rawDamageOnShot.isCrit ? 1 : 0;

                // Update last fired time
                lastFiredTime = time;

                // Start recoiling
                isRecoiling = true;

                // Reduce ammo
                remainingAmmoInMag -= stats.primary.magazine.cost;
            }
        }

        return {
            dps: totalDamageDealt / totalSimTime,
            shotCount: totalNumberOfShots,
            averageDamagePerShot: totalDamageDealt / totalNumberOfShots,
            effectiveCritRate: totalNumberOfCrits / totalNumberOfShots,
        };
    }
}
