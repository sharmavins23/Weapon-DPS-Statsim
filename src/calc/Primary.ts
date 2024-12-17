import {
    ISimOutput,
    ISimParams,
    ISimStack,
    SimDataPoint,
    SimInput,
    SimOutput,
    iSingleBulletDamageOutput,
} from "@/calc/SimTypes";
import { calculateSlashProcBleedDamage, iSlashProc } from "@/calc/status/Slash";
import { getRandomStatusProc } from "@/calc/status/Status";
import { calculateToxinProcDamage, iToxinProc } from "@/calc/status/Toxin";
import { PrimaryWeapon } from "@/data/weapons/primary/PrimaryWeapon";

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

function runSingleTick(
    weapon: PrimaryWeapon,
    time: number,
    previous: SimDataPoint,
    params: ISimParams,
    stack: ISimStack,
): ISimOutput {
    let newStack = { ...stack };

    // Flags for tracking
    let numShots = 0;
    let numCrits = 0;
    let numStatuses = 0;
    let numSlashTicks = 0;
    let numToxinTicks = 0;

    // Keep track of the damage we inflicted this tick
    let totalDamageInflictedThisTick = 0;

    // STATUSES!
    if (stack.procs.slash.length > 0) {
        let newSlashProcs: iSlashProc[] = [];

        // Iterate through all of the procs
        for (let i = 0; i < stack.procs.slash.length; i++) {
            // Get the proc
            let proc = stack.procs.slash[i];
            // Check if the proc has 0 ticks
            if (proc.ticks <= 0) {
                // Skip this proc
                continue;
            }
            // Check if the proc has hit a damage tick
            else if (time - proc.time >= 1.0) {
                // Deal the damage
                totalDamageInflictedThisTick += proc.damage;
                // Decrement the ticks
                proc.ticks -= 1;
                // Update the time
                proc.time = time;
                // Count it
                numSlashTicks += 1;

                // Add it to the new list
                newSlashProcs.push(proc);
            } else {
                // Otherwise, keep the proc
                newSlashProcs.push(proc);
            }
        }

        // Update the stack
        newStack.procs.slash = newSlashProcs;
    }
    if (stack.procs.toxin.length > 0) {
        let newToxinProcs: iToxinProc[] = [];

        // Iterate through all of the procs
        for (let i = 0; i < stack.procs.toxin.length; i++) {
            // Get the proc
            let proc = stack.procs.toxin[i];
            // Check if the proc has 0 ticks
            if (proc.ticks <= 0) {
                // Skip this proc
                continue;
            }
            // Check if the proc has hit a damage tick
            else if (time - proc.time >= 1.0) {
                // Deal the damage
                totalDamageInflictedThisTick += proc.damage;
                // Decrement the ticks
                proc.ticks -= 1;
                // Update the time
                proc.time = time;
                // Count it
                numToxinTicks += 1;

                // Add it to the new list
                newToxinProcs.push(proc);
            } else {
                // Otherwise, keep the proc
                newToxinProcs.push(proc);
            }
        }

        // Update the stack
        newStack.procs.toxin = newToxinProcs;
    }

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
        let numberOfBullets = Math.floor(weapon.multishot);
        let multishotRemainder = weapon.multishot - numberOfBullets;
        if (Math.random() < multishotRemainder) {
            numberOfBullets += 1;
        }
        numShots = numberOfBullets;
        // Each shot independently rolls for crits
        for (let i = 0; i < numberOfBullets; i++) {
            let singleBulletDamage = calculateSingleBulletDamage(weapon);
            if (singleBulletDamage.isCrit) numCrits += 1;
            totalDamageInflictedThisTick += singleBulletDamage.damage;

            // Roll for status procs
            let statusProcChance = weapon.statusChance / 100.0;
            let numStatusProcs = Math.floor(statusProcChance);
            let procChanceRemainder = statusProcChance - numStatusProcs;
            if (Math.random() < procChanceRemainder) {
                numStatusProcs += 1;
            }
            // We roll for each status proc individually
            for (let i = 0; i < numStatusProcs; i++) {
                // Get the proc
                let statusChosen = getRandomStatusProc(weapon.damage);

                if (statusChosen === "slash") {
                    newStack.procs.slash.push({
                        damage: calculateSlashProcBleedDamage(weapon),
                        ticks: 6,
                        time: time,
                    });
                } else if (statusChosen === "toxin") {
                    newStack.procs.toxin.push({
                        damage: calculateToxinProcDamage(weapon),
                        ticks: 6,
                        time: time,
                    });
                }

                // Count the status application
                numStatuses += 1;
            }
        }
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
        numShots: numShots,
        numCrits: numCrits,
        numStatuses: numStatuses,
        numSlashTicks: numSlashTicks,
        numToxinTicks: numToxinTicks,
    };
}

export async function runPrimarySimulation(
    weapon: PrimaryWeapon,
    input: SimInput,
): Promise<SimOutput> {
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

        procs: {
            slash: [],
            toxin: [],
        },
    };

    // Prepare our counters for metadata
    let numShots = 0;
    let numCrits = 0;
    let numStatuses = 0;
    let numSlashTicks = 0;
    let numToxinTicks = 0;

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

        // Update some counters that we use
        numShots += output.numShots;
        numCrits += output.numCrits;
        numStatuses += output.numStatuses;
        numSlashTicks += output.numSlashTicks;
        numToxinTicks += output.numToxinTicks;

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
            effectiveStatusRate: (numStatuses / numShots) * 100.0,
            numStatusProcs: numStatuses,
            numSlashTicks: numSlashTicks,
            numToxinTicks: numToxinTicks,
        },
    };
}
