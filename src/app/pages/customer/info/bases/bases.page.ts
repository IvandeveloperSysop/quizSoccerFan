import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bases',
  templateUrl: './bases.page.html',
  styleUrls: ['./bases.page.scss'],
})
export class BasesPage implements OnInit {

  sliderOpts = {
    zoom: {
      maxRatio: 2
    }
  };

  products = [
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL MINERALIZADA' ,'cantidad':'600 ML'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL MINERALIZADA' ,'cantidad':'2 L'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL TWIST','cantidad':'600 ML'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL TWIST','cantidad':'1.5 L'},
    {'name':'AGUA','marca':'CIEL','producto':'AGUA PURIFICADA','cantidad':'600 ML'},
  ];


  premios = [
    {'name': 'Tarjetas virtuales de Amazon con valor de $100 pesos'},
    {'name': 'Alexas Echo Dot'},
    {'name': 'Alexas Echo Show'},
    {'name': 'Cámaras de Seguridad Xiaomi. '},
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
