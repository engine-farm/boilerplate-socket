export enum BuffType {
    Speed,
    DMG,
    Shield,
    HP,
}

export class BuffEntity {
    type: BuffType;

    valueChange: number;

    timestampEnding: number; // timestamp ending | 0 - infinity
}
