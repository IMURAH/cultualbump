import { Tab2Page } from '../tab2/tab2.page'
import { DataService } from '../services/data.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { Continent, Country } from '../services/continent';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // private API_URL: string = 'http://culturebumpau.appspot.com/api'
  continents: Continent[];
  home: Country;
  home_picked: boolean;

  multi_mode: boolean;
  selected_countries: boolean[];
  flat_country_list: Country[];
  disabled_countries: boolean[];
  chinese: boolean;

  constructor(private navCtrl: NavController, private ds: DataService) {
    this.ds = ds;
    this.home_picked = false;
    // this.home = new Country();
    this.continents = [];
    this.multi_mode = false;
    this.chinese = false;
    this.selected_countries = [];
    this.flat_country_list = [];
    this.disabled_countries = [];
  }

  ngOnInit() {

  }

  toggleMultiSelect() {
    this.multi_mode = !this.multi_mode;
  }

  toggleLanguage() {
    this.chinese = !this.chinese;
    this.ds.changeLanguage(this.chinese);
  }

  multiCompare() {
    let compare_with = [];
    for (let i = 0; i < this.selected_countries.length; i++) {
      if (this.selected_countries[i]) {
        compare_with.push(this.flat_country_list[i]);
      }
    }
    const navParams: NavigationExtras = {
      queryParams: {
        compare: compare_with,
        home: this.home
      }
    };
    this.navCtrl.navigateForward('/compare', navParams)
  }

  checkMaxSelection() {
    let selected_count = 0
    for (let i = 0; i < this.selected_countries.length; i++) {
      if (this.selected_countries[i]) {
        selected_count++
      }
    }

    if (selected_count >= 6) {
      for (let i = 0; i < this.selected_countries.length; i++) {
        if (!this.selected_countries[i]) {
          this.disabled_countries[i] = true
        }
      }
    } else {
      for (let i = 0; i < this.disabled_countries.length; i++) {
        this.disabled_countries[i] = false
      }
    }
  }

  ionViewWillEnter() {

    this.continents = [];
    this.flat_country_list = [];

    // uncomment w/ persistent data
    // this.home = ds.homeCountry
    // this.home = this.ds.continents[0].countries[0];
    this.home_picked = false;
    this.ds.getUpdatedHomeCountry().then((val) => {
      this.home = val;
      this.home_picked = true;
    });

    window.setTimeout(() => { // wait 500ms for data service to read data, this is dumb
      this.ds.continents.forEach((c) => {
        let cont = new Continent(c.name, c.id)
        c.countries.forEach((count) => {
          if (count.id != this.home.id) {
            cont.addCountry(count);
            this.flat_country_list.push(count)
          }
        });
        this.continents.push(cont);
      });

      for (let i = 0; i < this.flat_country_list.length; i++) {
        // fill multiselect model
        this.selected_countries[i] = false
        this.disabled_countries[i] = false
      }
    }, 250)
  }

  private openBumpsPage(_country) {
    const navParams: NavigationExtras = {
      queryParams: {
        compare: [_country],
        home: this.home
      }
    };
    this.navCtrl.navigateForward('/compare', navParams)
  }

  private openSettings() {
    this.navCtrl.navigateForward('/settings')
  }

}
