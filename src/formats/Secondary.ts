import { Elements, IPS } from "@/formats/Damage";
import {
    quantizeCritMultiplier,
    quantizeElements,
    quantizeIPS,
} from "@/calc/Quantization";
import { SimOutput, ShotOutput } from "@/calc/SimOutput";

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
    ): ShotOutput {
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
        let critHundredsValue = Math.floor(stats.critical.chance / 100.0);
        let critRemainder = stats.critical.chance % 100.0;
        let isHightierCrit = Math.random() < critRemainder / 100.0;
        let critMulti;
        if (isHightierCrit)
            critMulti = stats.critical.multiplier * (critHundredsValue + 1);
        else critMulti = stats.critical.multiplier * critHundredsValue;
        let quantizedCritMulti = quantizeCritMultiplier(
            critMulti,
            enableQuantization
        );
        let totalCritMulti = quantizedCritMulti;
        if (isHightierCrit) totalDamage *= totalCritMulti;

        return {
            damage: totalDamage,
            isCrit: isHightierCrit,
        };
    }

    abstract simulateDPS(enableQuantization: boolean): SimOutput;
}
