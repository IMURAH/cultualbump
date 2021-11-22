import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Continent, Country } from './continent'
import { Category, Behavior, Characteristic } from './category';

import { Storage } from '@ionic/storage';

@Injectable()
export class DataService {
  private http: HttpClient;
  continents: Continent[];
  homeCountry: Country;
  categories: Category[];
  client: HttpClient;

  constructor(http: HttpClient, private storage: Storage) { 
    this.continents = [];
    this.categories = [];
    this.client = http;

    this.client.get('assets/bumps.json', {})
      .subscribe(data => {
        // Split all countries into continents
        let continents = [];
        let countries = [];
        data['continent'].forEach(cont => {
          continents.push(new Continent(cont.continent_name, cont.continent_id));
        });
        data['country'].forEach(count => {
          let cont =  new Country(count.country_name, count.country_id, count.latitude, count.longitude, count.resourceName)
          continents.find(function(c) {
            return count.continent_id == c.id;
          }).addCountry(cont);
          countries.push(cont);
        });
        this.continents = continents;

        // Split all behaviors into categories
        let categories = [];
        data['category'].forEach(cat => {
          categories.push(new Category(cat.category_id, cat.category_name));
        });
        data['behavior'].forEach(behav => {
          categories.find(function(c) {
            return behav.category_id == c.id;
          }).addBehavior(new Behavior(behav.behavior_id, behav.behavior_description));
        });
        this.categories = categories;

        // Take all characteristics and put into appropriate countries
        let characteristics = [];
        data['characteristic'].forEach(char => {
          characteristics.push(new Characteristic(char.characteristics_id, char.behavior_id, char.characteristics_description, null))
        });
    
        data['nation_characteristic'].forEach(nat => {
          let count = countries.find(function(c) {
            return c.id == parseInt(nat.country_id);
          });
          let char = characteristics.find(function(c) {
            return c.id == parseInt(nat.characteristics_id);
          });
          count.addCharacteristic(char.createCopy(nat.extra_description, count.resourse));
        });
        // console.log(continents)
      });

      this.getUpdatedHomeCountry();
  }

  getAllCountries() {
    let countries = [];
    if (this.continents != undefined) {
      this.continents.forEach(cont => {
        cont.countries.forEach(count => {
          countries.push(count);
        });
      });
    }
    return countries;
  }

  getAllBehaviors() {
    let behavs = [];
    if (this.categories != undefined) {
      this.categories.forEach(cat => {
        cat.behaviors.forEach(b => {
          behavs.push(b);
        });
      });
    }
    return behavs;
  }

  setHomeCountry(home: Country) {
      this.homeCountry = home;
      this.storage.set('home_country', JSON.stringify(this.homeCountry));
  }

  changeLanguage(chinese: boolean) {
    let fileName = 'assets/bumps.json';
    if (chinese) {
        fileName = 'assets/bumps_CN.json';
    }
    this.client.get(fileName, {})
        .subscribe(data => {
          // Split all countries into continents
          let continents = [];
          let countries = [];
          data['continent'].forEach(cont => {
            continents.push(new Continent(cont.continent_name, cont.continent_id));
          });
          data['country'].forEach(count => {
            let cont =  new Country(count.country_name, count.country_id, count.latitude, count.longitude, count.resourceName)
            continents.find(function(c) {
              return count.continent_id == c.id;
            }).addCountry(cont);
            countries.push(cont);
          });
          this.continents = continents;

          // Split all behaviors into categories
          let categories = [];
          data['category'].forEach(cat => {
            categories.push(new Category(cat.category_id, cat.category_name));
          });
          data['behavior'].forEach(behav => {
            categories.find(function(c) {
              return behav.category_id == c.id;
            }).addBehavior(new Behavior(behav.behavior_id, behav.behavior_description));
          });
          this.categories = categories;

          // Take all characteristics and put into appropriate countries
          let characteristics = [];
          data['characteristic'].forEach(char => {
            characteristics.push(new Characteristic(char.characteristics_id, char.behavior_id, char.characteristics_description, null))
          });

          data['nation_characteristic'].forEach(nat => {
            let count = countries.find(function(c) {
              return c.id == parseInt(nat.country_id);
            });
            let char = characteristics.find(function(c) {
              return c.id == parseInt(nat.characteristics_id);
            });
            count.addCharacteristic(char.createCopy(nat.extra_description, count.resourse));
          });
          // console.log(continents)
        });
  }

  getHomeCountry(): Country {
    return this.homeCountry
  }

  getUpdatedHomeCountry(): Promise<Country> {
    return new Promise((resolve, reject) => {
      this.storage.get('home_country').then((val) => {
        if (val) {
          const result = JSON.parse(val)
          this.homeCountry = this.getAllCountries().find((c) => {
            return c.id == parseInt(result.id);
          });
          resolve(this.homeCountry) 
        } else {
          this.storage.set('home_country', JSON.stringify(this.continents[0].countries[0]));
          this.homeCountry = this.continents[0].countries[0];
          resolve(this.homeCountry)
        }
      }).catch((err) => {
        reject(err)
      });
    })
  }

  getCharacteristicsForCountries(countries: Country[], filterCat: Category) {
    let behavs = [];
    // no filter
    if (filterCat == null) {
      behavs = this.getAllBehaviors();
    }
    // filter
    else {
      behavs = filterCat.behaviors
    }
    let returnChars = [];
    behavs.forEach(b => {
      countries.forEach(c => {
        let found = c.getCharacteristicByBehavior(b)
        if (found) {
          returnChars.push(found); 
        }
      });
    });
    return returnChars
  }

}
