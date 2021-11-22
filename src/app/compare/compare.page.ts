import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { NavController } from '@ionic/angular';
import { Country } from '../services/continent';
import { Category } from '../services/category';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.page.html',
  styleUrls: ['./compare.page.scss'],
})
export class ComparePage {

  home: Country;
  compare: Country[];
  others: Country[];
  cats: Category[];
  countryFilter: number;
  filterCat: Category;
  headerText: String;

  public bumps = []

  constructor(private navCtrl: NavController, private ds: DataService, private route: ActivatedRoute) {
    this.ds = ds;
    this.compare = [];
    this.others = [];
    this.cats = [];
    this.route.queryParams.subscribe(params => {
      this.home = params["home"];
      this.others = params["compare"];
    });
  }

  ionViewWillEnter() {
    // set home country
    // this.home = ds.homeCountry

    // Pass in compare country(ies) 
    // let others = 
  
    // TODO delete these dummy datas

    if (this.home == undefined) {
      this.home = this.ds.continents[0].countries[0];
    }
    if (this.others == undefined) {
      this.others = [];
      this.others.push(this.ds.continents[1].countries[1]);
    }

    this.compare = this.others.concat(this.home);
    this.countryFilter = -1;
    this.headerText = this.compare.map(c => c.name).join(" & ")
    // TODO display flags

    // TODO implement filter
    this.cats = this.ds.categories;
    this.filterCat = null

    this.determineBumps();
  }

  determineBumps() {

    let counts = this.compare;
    let countryFilter = this.countryFilter
    if (countryFilter != -1) {
      counts = [(this.compare.find(function(c){
        return c.id == countryFilter;
      }))];
    }

    // console.log(counts)

    this.bumps = this.ds.getCharacteristicsForCountries(counts, this.filterCat)
    let homeRes = this.home.resourse;

    console.log(this.bumps)

    this.bumps.forEach(b => {
      b.slot = 'start';
      if (b.countryRes == homeRes) {
        b.slot = 'end'
      }
    });

    // console.log(this.bumps)
  }

  onFilterChange(value: string) {
    let cat = this.ds.categories.find((c) => {
      return c.id == parseInt(value);
    });
    this.filterCat = cat;
    this.determineBumps();
  }

  onCountryChange() {
    this.determineBumps();
  }

}
