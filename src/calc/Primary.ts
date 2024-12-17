import { PrimaryWeapon } from "@/data/weapons/primary/PrimaryWeapon";

// ===== Exported enumerations =================================================

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
    time: number; // Total time of the simulation
    timeResolution: number; // Seconds per tick

    DPS: number; // Damage per second
}

// Overall output from the sim. Consumed by front-end.
export interface SimOutput {
    data: SimDataPoint[];
    metadata: SimMetadata;
}

// Passed-in parameters won't change between ticks
interface ISimParams {}

// Internal data (reference) that may change between ticks
interface ISimStack {
    isReloading: boolean; // Reloading after last shot
    lastReloadTime: number; // Time of last reload

    isRecoiling: boolean; // Recoil after last shot
    lastRecoilTime: number; // Time of last recoil

    ammoInMagazine: number; // Bullets left in magazine
}

// Internal to the function, used for passing the (reference) data between ticks
interface ISimOutput {
    data: SimDataPoint;
    stack: ISimStack;
}

// ===== Simulation functions ==================================================

function runSingleTick(
    weapon: PrimaryWeapon,
    time: number,
    previous: SimDataPoint,
    params: ISimParams,
    stack: ISimStack,
): ISimOutput {
    let newStack = { ...stack };

    // Keep track of the damage we inflicted this tick
    let totalDamageInflictedThisTick = 0;

    // If we're recoiling from the last shot, we can't shoot or reload
    if (stack.isRecoiling) {
        // Check if we're done recoiling
        if (time - stack.lastRecoilTime >= 1.0 / weapon.fireRate) {
            // Set recoiling to false
            newStack.isRecoiling = false;
        }
        // Otherwise, we can't do anything else
    }

    // If we're reloading, we can't shoot
    else if (stack.isReloading) {
        // Check if we're done reloading
        if (time - stack.lastReloadTime >= weapon.reloadTime) {
            // Set reloading to false, and reset the ammo in the magazine
            newStack.isReloading = false;
            newStack.ammoInMagazine = weapon.ammo.magazineSize;
        }
        // Otherwise, we can't do anything else
    }

    // If we run out of bullets, we have to start reloading
    else if (stack.ammoInMagazine <= 0) {
        // Set reloading to true, and update its time
        newStack.isReloading = true;
        newStack.lastReloadTime = time;
    }

    // If we have bullets, we can shoot
    else if (stack.ammoInMagazine > 0) {
        // Set recoiling to true, and update its time
        newStack.isRecoiling = true;
        newStack.lastRecoilTime = time;

        // Reduce the ammo in our magazine
        newStack.ammoInMagazine -= 1;

        // Increase the damage dealt
        totalDamageInflictedThisTick += weapon.damage.impact; // TODO: Calculate
    }

    // Handle any other weird edge cases
    else {
        // We've reached a case that shouldn't ever happen
        console.error("Reached an undefined point in simulator.");
    }

    // Return our damage tick
    return {
        data: {
            time: time,
            damage: totalDamageInflictedThisTick,
            cumulative: previous.cumulative + totalDamageInflictedThisTick,
        },
        stack: newStack,
    };
}

export function runPrimarySimulation(
    weapon: PrimaryWeapon,
    input: SimInput,
): SimOutput {
    let numTicks: number = input.simulationTime / input.timeResolution;

    // Prepare our objects for the simulation
    let data: SimDataPoint[] = [];
    let params: ISimParams = {};
    let stack: ISimStack = {
        isReloading: false,
        lastReloadTime: 0.0,

        isRecoiling: false,
        lastRecoilTime: 0.0,

        ammoInMagazine: weapon.ammo.magazineSize,
    };

    // Initialize the simulation with a null datapoint
    let previousData: SimDataPoint = {
        time: 0,
        damage: 0,
        cumulative: 0,
    };

    // Run simulation
    for (let i = 0; i <= numTicks; i++) {
        let time = i * input.timeResolution;
        let output: ISimOutput = runSingleTick(
            weapon,
            time,
            previousData,
            params,
            stack,
        );
        data.push(output.data);

        // Propagate this tick's output data to the next tick
        previousData = output.data;
        // Propagate this tick's output stack to the next tick
        stack = output.stack;
    }

    // Return data points
    return {
        data: data,
        metadata: {
            time: input.simulationTime,
            timeResolution: input.timeResolution,

            DPS: data[data.length - 1].cumulative / input.simulationTime,
        },
    };
}
