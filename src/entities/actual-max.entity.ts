export enum ActualMaxAttribute {
    HP,
    Shield
}

export class ActualMaxEntity {
    current: number;
    max: number;
    attribute: ActualMaxAttribute;

    constructor(attribute: ActualMaxAttribute, current: number, max?: number) {
        this.current = current;
        this.max = max || current;

        this.attribute = attribute;
    }

    set(value: number, max?: number) {
        if (max) {
            this.max = max;
        }

        this.current = Math.max(0, Math.min(value, this.max));
    }
}
