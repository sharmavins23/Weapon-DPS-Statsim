import { PrimaryWeapon } from "@/data/weapons/primary/PrimaryWeapon";

export const Braton: PrimaryWeapon = {
    name: "Braton",
    rivenDisposition: 1.35,

    fireRate: 8.75,
    reloadTime: 2.0,

    ammo: {
        cost: 1,
        magazineSize: 45,
    },

    damage: {
        impact: 7.92,
        puncture: 7.92,
        slash: 8.16,

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

    critical: {
        chance: 12.0,
        multiplier: 1.6,
    },

    multishot: 1.0,

    statusChance: 6.0,
};
