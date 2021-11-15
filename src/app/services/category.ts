export class Category {
    id: number;
    name: string;
    behaviors: Behavior[]
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.behaviors = [];
    }

    addBehavior(b: Behavior) {
        this.behaviors.push(b);
    }
};

export class Behavior {
    id: number;
    description: string;
    constructor(id, desc) {
        this.id = id;
        this.description = desc;
    }
}

export class Characteristic {
    id: number;
    behaviorID: number;
    description: string;
    countryRes: string;
    constructor(id, behaviorID, desc, countryRes) {
        this.id = id;
        this.behaviorID = behaviorID;
        this.description = desc;
        this.countryRes = countryRes;
    }

    createCopy(extra, countryRes) {
        return new Characteristic(this.id, this.behaviorID, this.description + extra, countryRes);
    }
}