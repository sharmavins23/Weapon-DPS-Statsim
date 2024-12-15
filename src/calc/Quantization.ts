import { Elements, IPS } from "formats/Damage";

export function quantizeIPS(
    ips: IPS,
    scale: number,
    enableQuantization: boolean = true
) {
    if (!enableQuantization) return ips;

    return {
        impact: Math.round(ips.impact / scale) * scale,
        puncture: Math.round(ips.puncture / scale) * scale,
        slash: Math.round(ips.slash / scale) * scale,
    };
}

export function quantizeElements(
    elements: Elements,
    scale: number,
    enableQuantization: boolean = true
) {
    if (!enableQuantization) return elements;

    return {
        heat: Math.round(elements.heat / scale) * scale,
        cold: Math.round(elements.cold / scale) * scale,
        electricity: Math.round(elements.electricity / scale) * scale,
        toxin: Math.round(elements.toxin / scale) * scale,

        blast: Math.round(elements.blast / scale) * scale,
        radiation: Math.round(elements.radiation / scale) * scale,
        gas: Math.round(elements.gas / scale) * scale,
        magnetic: Math.round(elements.magnetic / scale) * scale,
        viral: Math.round(elements.viral / scale) * scale,
        corrosive: Math.round(elements.corrosive / scale) * scale,
    };
}

export function quantizeCritMultiplier(
    critMultiplier: number,
    enableQuantization: boolean = true
) {
    if (!enableQuantization) return critMultiplier;

    return Math.round(critMultiplier / (32 / 4095)) * (32 / 4095);
}
