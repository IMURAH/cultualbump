import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Country } from '../services/continent';
import { NavController } from '@ionic/angular';

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
    this.nav.back();

  }

}
