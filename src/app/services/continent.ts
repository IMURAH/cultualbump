import { Characteristic } from './category';


export class Continent {
    name: string;
    id: number;    
    countries: Country[];
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.countries = [];
    }

    addCountry(country: Country) {
        this.countries.push(country);
    }
}
  
export class Country {
    name: string;
    id: number;
    lattitude: number;
    longitude: number;
    resourse: string;
    characteristics: Characteristic[];
    constructor(name, id, lat, long, res) {
        this.name = name;
        this.id = id;
        this.lattitude = lat;
        this.longitude = long;
        this.resourse = res;
        this.characteristics = [];
    }

    addCharacteristic(char) {
        this.characteristics.push(char);
    }

    getCharacteristicByBehavior(behav) {
        return this.characteristics.find(function(c) {
            return c.behaviorID == behav.id;
        })
    }
}