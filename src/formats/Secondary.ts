import { Elements, IPS } from "formats/Damage";
import {
    quantizeCritMultiplier,
    quantizeElements,
    quantizeIPS,
} from "calc/Quantization";

// ===== Type definitions ======================================================

export interface SecondaryStats {
    accuracy: number;
    critical: {
        chance: number;
        multiplier: number;
    };
    fireRate: number;
    magazine: {
        cost: number;
        size: number;
        max: number;
    };
    multishot: number;
    reload: number;
    statusChance: number;
    ips: IPS;
    elements: Elements;
}

export enum SecondaryFiringModes {
    PRIMARY,
    INCARNON,
}

// ===== Class definition ======================================================

export abstract class Secondary {
    name: string;
    abstract stats: Partial<Record<SecondaryFiringModes, SecondaryStats>>;

    constructor(name: string) {
        this.name = name;
    }

    calculateRawDamagePerShot(
        mode: SecondaryFiringModes = SecondaryFiringModes.PRIMARY,
        enableQuantization: boolean = true
    ): number {
        // * Get the stats
        if (!this.stats[mode]) throw new Error("Invalid firing mode");
        let stats: SecondaryStats = this.stats[mode]!;

        // * Compute scale
        let baseIPS = stats.ips.impact + stats.ips.puncture + stats.ips.slash;
        let scale = baseIPS / 16; // Quantization factor

        // * Quantize elements
        let quantizedElements = quantizeElements(
            stats.elements,
            scale,
            enableQuantization
        );

        // * Quantize IPS
        let quantizedIPS = quantizeIPS(stats.ips, scale, enableQuantization);

        // * Add above
        let totalIPS =
            quantizedIPS.impact + quantizedIPS.puncture + quantizedIPS.slash;
        let totalEle =
            quantizedElements.heat +
            quantizedElements.cold +
            quantizedElements.electricity +
            quantizedElements.toxin +
            quantizedElements.blast +
            quantizedElements.radiation +
            quantizedElements.gas +
            quantizedElements.magnetic +
            quantizedElements.viral +
            quantizedElements.corrosive;
        let totalDamage = totalIPS + totalEle;

        // * Apply other multipliers
        // Critical hits
        let totalCritChance = stats.critical.chance / 100.0;
        let quantizedCritMulti = quantizeCritMultiplier(
            stats.critical.multiplier,
            enableQuantization
        );
        let totalCritMulti = quantizedCritMulti;
        let avgCritMulti = 1 + totalCritChance * (totalCritMulti - 1);
        totalDamage *= avgCritMulti;

        return totalDamage;
    }

    abstract simulateDPS(enableQuantization: boolean): number;
}
