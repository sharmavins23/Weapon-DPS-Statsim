import { iSlashProc } from "@/calc/status/Slash";
import { iToxinProc } from "@/calc/status/Toxin";

// ===== Consumed by frontend ==================================================

// Input data for the simulation
export interface SimInput {
    simulationTime: number; // Total time of the simulation
    timeResolution: number; // Seconds per tick
}

// Singular data point from the simulation.
export interface SimDataPoint {
    time: number;
    damage: number;
    cumulative: number;
}

// Output metadata (calculated)
export interface SimMetadata {
    simulationTime: number; // Total time of the simulation
    timeResolution: number; // Seconds per tick

    DPS: number; // Damage per second
    damagePerShot: number; // Average damage per shot

    effectiveCritRate: number; // Effective critical hit rate

    effectiveStatusRate: number; // Effective status proc rate
    numStatusProcs: number; // Number of status procs
    numSlashTicks: number; // Number of ticks from slash procs
    numToxinTicks: number; // Number of ticks from toxin procs
}

// Overall output from the sim. Consumed by front-end.
export interface SimOutput {
    data: SimDataPoint[];
    metadata: SimMetadata;
}

// ===== Internal to the simulation ============================================

// Passed-in parameters won't change between ticks
export interface ISimParams {}

// Internal data (reference) that may change between ticks
export interface ISimStack {
    isReloading: boolean; // Reloading after last shot
    lastReloadTime: number; // Time of last reload

    isRecoiling: boolean; // Recoil after last shot
    lastRecoilTime: number; // Time of last recoil

    ammoInMagazine: number; // Bullets left in magazine

    procs: {
        slash: iSlashProc[];

        toxin: iToxinProc[];
    };
}

// Internal to the function, used for passing the (reference) data between ticks
export interface ISimOutput {
    data: SimDataPoint;
    stack: ISimStack;

    numShots: number;

    numCrits: number;

    numStatuses: number;
    numSlashTicks: number;
    numToxinTicks: number;
}

export interface iSingleBulletDamageOutput {
    damage: number;

    isCrit: boolean;
}
