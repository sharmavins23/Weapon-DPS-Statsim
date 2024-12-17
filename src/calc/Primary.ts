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
    simulationTime: number; // Total time of the simulation
    timeResolution: number; // Seconds per tick

    DPS: number; // Damage per second
    damagePerShot: number; // Average damage per shot
    effectiveCritRate: number; // Effective critical hit rate
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

    isShot: boolean;
    isCrit: boolean;
}

interface iSingleBulletDamageOutput {
    damage: number;

    isCrit: boolean;
}

// ===== Damage calculation ====================================================

function calculateSingleBulletDamage(
    weapon: PrimaryWeapon,
): iSingleBulletDamageOutput {
    // * Compute quantization factor (scale)
    let baseIPS =
        weapon.damage.impact + weapon.damage.puncture + weapon.damage.slash;
    let quantizationFactor = baseIPS / 16.0; // Quantization factor

    // * Quantize elements
    let quantizedDamage = {
        impact:
            Math.round(weapon.damage.impact / quantizationFactor) *
            quantizationFactor,
        puncture:
            Math.round(weapon.damage.puncture / quantizationFactor) *
            quantizationFactor,
        slash:
            Math.round(weapon.damage.slash / quantizationFactor) *
            quantizationFactor,

        heat:
            Math.round(weapon.damage.heat / quantizationFactor) *
            quantizationFactor,
        cold:
            Math.round(weapon.damage.cold / quantizationFactor) *
            quantizationFactor,
        electricity:
            Math.round(weapon.damage.electricity / quantizationFactor) *
            quantizationFactor,
        toxin:
            Math.round(weapon.damage.toxin / quantizationFactor) *
            quantizationFactor,

        blast:
            Math.round(weapon.damage.blast / quantizationFactor) *
            quantizationFactor,
        radiation:
            Math.round(weapon.damage.radiation / quantizationFactor) *
            quantizationFactor,
        gas:
            Math.round(weapon.damage.gas / quantizationFactor) *
            quantizationFactor,
        magnetic:
            Math.round(weapon.damage.magnetic / quantizationFactor) *
            quantizationFactor,
        viral:
            Math.round(weapon.damage.viral / quantizationFactor) *
            quantizationFactor,
        corrosive:
            Math.round(weapon.damage.corrosive / quantizationFactor) *
            quantizationFactor,
    };

    // * Sum quantized values
    let totalDamage =
        quantizedDamage.impact +
        quantizedDamage.puncture +
        quantizedDamage.slash +
        quantizedDamage.heat +
        quantizedDamage.cold +
        quantizedDamage.electricity +
        quantizedDamage.toxin +
        quantizedDamage.blast +
        quantizedDamage.radiation +
        quantizedDamage.gas +
        quantizedDamage.magnetic +
        quantizedDamage.viral +
        quantizedDamage.corrosive;

    // * Apply critical hits
    let criticalChanceDecimal = weapon.critical.chance / 100.0;
    // Handle super crits (yellow, orange, red crits)
    let criticalChanceDecimalOnesPlace = Math.floor(criticalChanceDecimal);
    let criticalChanceDecimalRemainder =
        criticalChanceDecimal - criticalChanceDecimalOnesPlace;
    let isHigherCrit = Math.random() < criticalChanceDecimalRemainder;
    // Calculate the multiplier
    let criticalMultiplier = weapon.critical.multiplier;
    if (isHigherCrit) {
        criticalMultiplier *= criticalChanceDecimalOnesPlace + 1;
    } else {
        criticalMultiplier *= criticalChanceDecimalOnesPlace;
    }
    // Quantize the critical multiplier
    let quantizedCriticalMultiplier =
        Math.round(criticalMultiplier / (32.0 / 4095.0)) * (32.0 / 4095.0);
    // Apply the multiplier to the total damage
    totalDamage *= Math.max(
        quantizedCriticalMultiplier,
        // (Ignoring bugs) crits may never subtract damage
        1.0,
    );

    return {
        damage: totalDamage,
        isCrit: quantizedCriticalMultiplier > 1.0,
    };
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

    // Flags for tracking
    let isShot = false;
    let isCrit = false;

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
        let singleBulletDamage = calculateSingleBulletDamage(weapon);
        let totalShotDamage = singleBulletDamage.damage * weapon.multishot;
        totalDamageInflictedThisTick += totalShotDamage;

        // Update some counters
        isShot = true;
        isCrit = singleBulletDamage.isCrit;
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
        isShot: isShot,
        isCrit: isCrit,
    };
}

export function runPrimarySimulation(
    weapon: PrimaryWeapon,
    input: SimInput,
): SimOutput {
    let numTicks: number = input.simulationTime / input.timeResolution;

    // Prepare our objects for the simulation
    let data: SimDataPoint[] = [];
    let stacks: ISimStack[] = [];
    let params: ISimParams = {};
    let stack: ISimStack = {
        isReloading: false,
        lastReloadTime: 0.0,

        isRecoiling: false,
        lastRecoilTime: 0.0,

        ammoInMagazine: weapon.ammo.magazineSize,
    };

    // Prepare our counters for metadata
    let numShots = 0;
    let numCrits = 0;

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
        // Save the datapoint
        data.push(output.data);
        // Save the stack
        stacks.push(stack);

        // Update some counters that we use
        if (output.isShot) {
            numShots += 1;
        }
        if (output.isCrit) {
            numCrits += 1;
        }

        // Propagate this tick's output data to the next tick
        previousData = output.data;
        // Propagate this tick's output stack to the next tick
        stack = output.stack;
    }

    // Return data points
    return {
        data: data,
        metadata: {
            simulationTime: input.simulationTime,
            timeResolution: input.timeResolution,

            DPS: data[data.length - 1].cumulative / input.simulationTime,
            damagePerShot: data[data.length - 1].cumulative / numShots,
            effectiveCritRate: (numCrits / numShots) * 100.0,
        },
    };
}
