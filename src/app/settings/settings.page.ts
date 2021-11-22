import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import {Continent, Country} from '../services/continent';
import { NavController } from '@ionic/angular';
import {Behavior, Category, Characteristic} from '../services/category';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  countries: Country[];
  selectedCountry: Country;
  selectedCountryImage: string;
  selectedCountryId: string;

  constructor(private nav: NavController, private ds: DataService) {
    this.ds = ds;
    this.selectedCountryImage = "assets/flags/square/sweden.png";
    this.selectedCountryId = "0";
  }
  
  ionViewWillEnter() {
    this.countries = this.ds.getAllCountries();
    this.selectedCountry = this.ds.getHomeCountry();
    this.ds.getUpdatedHomeCountry().then((val: Country) => {
      if (val) {
        this.selectedCountryId = "" + val.id
        this.onChange("" + val.id)
      }
    })
  }

  onChange(value: string) {
    let cont = this.countries.find((c) => {
      return c.id == parseInt(value);
    });
    this.selectedCountry = cont;
    this.selectedCountryImage = "assets/flags/square/" + cont.resourse + ".png";
  }

  saveSettings() {
    this.ds.setHomeCountry(this.selectedCountry);
    let fileName = 'assets/bumps.json';
    if (this.ds.homeCountry.name == 'China') {
      fileName = 'assets/bumps_CN.json';
    }
    this.ds.client.get(fileName, {})
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
          this.ds.continents = continents;

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
          this.ds.categories = categories;

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
    this.nav.back();

  }

}
