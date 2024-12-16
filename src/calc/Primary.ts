import { PrimaryWeapon } from "@/data/weapons/primary/PrimaryWeapon";

// ===== Exported enumerations =================================================

export interface SimDataPoint {
    time: number;
    damage: number;
}

export interface SimMetadata {
    data: SimDataPoint[];
    runtime: number;
}

// ===== Simulation functions ==================================================

function runSingleTick(
    weapon: PrimaryWeapon,
    tick: number,
    timeResolution: number,
): SimDataPoint {
    return {
        time: tick * timeResolution,
        damage: 10 * tick,
    };
}

export function runPrimarySimulation(
    weapon: PrimaryWeapon,
    numSeconds: number = 10,
): SimDataPoint[] {
    let timeResolution: number = 0.01;
    let numTicks: number = numSeconds / timeResolution;

    // Run simulation
    let data: SimDataPoint[] = [];
    for (let i = 0; i <= numTicks; i++) {
        data.push(runSingleTick(weapon, i, timeResolution));
    }

    return data;
}
