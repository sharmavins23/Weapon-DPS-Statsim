export interface PrimaryWeapon {
    name: string;
    rivenDisposition: number;

    fireRate: number; // Attacks per second
    reloadTime: number; // Seconds

    ammo: {
        cost: number; // Ammo per shot
        magazineSize: number; // Bullets
    };

    damage: {
        impact: number;
        puncture: number;
        slash: number;

        heat: number;
        cold: number;
        electricity: number;
        toxin: number;

        blast: number;
        radiation: number;
        gas: number;
        magnetic: number;
        viral: number;
        corrosive: number;
    };

    critical: {
        chance: number; // Percentage, not decimal
        multiplier: number;
    };

    multishot: number;

    statusChance: number; // Percentage, not decimal
}
