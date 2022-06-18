import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.page.html',
  styleUrls: ['./steps.page.scss'],
})
export class StepsPage implements OnInit {

  instructions;
  products = [
    {'name':'TOPO CHICO', 'points' : '600 ml'},
    {'name':'TOPO CHICO', 'points' : '1.5 LT NR'},
    {'name':'TOPO CHICO TWIST TORONJA', 'points' : '600 ML'},
    {'name':'TOPO CHICO TWIST LIMON', 'points' : '600 ML NR'},
    {'name':'AGUA CIEL MINERAL', 'points' : '600 ml NR'},
    {'name':'AGUA CIEL MINERAL', 'points' : '2 L NR'},
    {'name':'AGUA CIEL', 'points' : '600 ml'},
    {'name':'AGUA CIEL', 'points' : '1 L'},
    {'name':'AGUA CIEL', 'points' : '1.5 L'},
    {'name':'AGUA CIEL', 'points' : '5 L'},
    {'name':'AGUA CIEL GARRAFON', 'points' : '20L'},
    {'name':'ENVASE DE GARRAFON AGUA CIEL', 'points' : ''},
    {'name':'FRUTSI UVA', 'points' : '250 ml'},
    {'name':'FRUTSI MANZANA', 'points' : '250 ml'},
    {'name':'FRUTSI PONCHE DE FRUTAS', 'points' : '250 ml'},
    {'name':'ZCAN VITAMIN WATER XXX', 'points' : '500 ml'},
    {'name':'VITAMIN WATER POWER-C', 'points' : '500 ml'},
    {'name':'VITAMIN WATER ENERGY', 'points' : '500 ml'},
    {'name':'FUZE TEA VERDE LIMON', 'points' : '600 ml'},
    {'name':'FUZE TEA NEGRO LIMON', 'points' : '600 ml'},
    {'name':'FUZE TEA NEGRO DURAZNO', 'points' : '600 ml'},
    {'name':'VALLE FRUT CITRUS PUNCH', 'points' : '600 ml'},
    {'name':'VALLE FRUT CITRUS PUNCH', 'points' : '1 L'},
    {'name':'VALLE FRUT CITRUS PUNCH', 'points' : '1.5 L'},
    {'name':'VALLE FRUT CITRUS PUNCH', 'points' : '2 L'},
    {'name':'CIEL EXPRIM LIMÓN CON CASCARA', 'points' : '1 L'},
    {'name':'CIEL EXPRIM JAMAICA REPOSADA', 'points' : '1 L'},
    {'name':'CIEL EXPRIM FRESA', 'points' : '1 L'},
    {'name':'CIEL EXPRIM PIÑA JENGIBRE', 'points' : '1 L'},
    {'name':'ZCAN BEBIDA MONSTER ENERGY PIPELINE PUNCH', 'points' : '473 ML'},
    {'name':'BEBIDA MONSTER ENERGY', 'points' : '473 ml'},
    {'name':'POWERADE MORAS', 'points' : '500 ml'},
    {'name':'POWERADE FRUTAS', 'points' : '500 ml'},
    {'name':'POWERADE LIMA LIMON', 'points' : '500 ml'},
    {'name':'POWERADE UVA', 'points' : '500 ml'},
    {'name':'POWERADE NARANJA-MANDARINA', 'points' : '500 ml'},
    {'name':'POWERADE MORAS', 'points' : '600 ml'},
    {'name':'POWERADE FRUTAS', 'points' : '600 ml'},
    {'name':'POWERADE LIMA LIMON', 'points' : '600 ml'},
    {'name':'POWERADE NARANJA-MANDARINA', 'points' : '600 ml'},
    {'name':'POWERADE MORAS', 'points' : '1 L'},
    {'name':'POWERADE FRUTAS', 'points' : '1 L'},
    {'name':'POWERADE NARANJA-MANDARINA', 'points' : '1 L'},
    {'name':'POWERADE LIMA LIMON', 'points' : '1 L'},
    {'name':'ENVASE DE REFRESCO VIDRIO', 'points' : ''},
    {'name':'ENVASE DE REFRESCO PLASTICO RETORNABLE', 'points' : '1L'},
    {'name':'ENVASE DE REFRESCO PLASTICO RETORNABLE', 'points' : '1.5 L'},
    {'name':'ENVASE DE COCA COLA  VIDRIO RETORNABLE', 'points' : '2 L'},
    {'name':'JUGO DEL VALLE DURAZNO MINIBRICK', 'points' : '250 ml'},
    {'name':'JUGO DEL VALLE NECTAR MANZANA MINIBRICK', 'points' : '250 ml'},
    {'name':'JUGO DEL VALLE CLARIF MANZANA MINIBRICK', 'points' : '250 ml'},
    {'name':'JUGO DEL VALLE DURAZNO LATA', 'points' : '335 ml'},
    {'name':'JUGO DEL VALLE PIÑA LATA', 'points' : '335 ml'},
    {'name':'JUGO DEL VALLE MANZANA LATA', 'points' : '355 ml'},
    {'name':'JUGO DEL VALLE PULPY NARANJA', 'points' : '400 ml'},
    {'name':'JUGO DEL VALLE MANGO VIDRIO', 'points' : '413 ml'},
    {'name':'JUGO DEL VALLE DURAZNO VIDRIO', 'points' : '413 ml'},
    {'name':'JUGO DEL VALLE NECTAR MANZANA VIDRIO', 'points' : '413 ml'},
    {'name':'JUGO DEL VALLE MANZANA VIDRIO', 'points' : '413 ml'},
    {'name':'JUGO DEL VALLE MANZANA PET', 'points' : '500 ml'},
    {'name':'JUGO DEL VALLE PIÑA TETRA', 'points' : '946 ml'},
    {'name':'JUGO DEL VALLE MANZANA TETRA', 'points' : '946 ml'},
    {'name':'JUGO DEL VALLE DURAZNO TETRA', 'points' : '946 ml'},
    {'name':'JUGO DEL VALLE PIÑA PET', 'points' : '1 L'},
    {'name':'JUGO DEL VALLE RESERVA ARANDANO', 'points' : '1 L'},
    {'name':'JUGO DEL VALLE RESERVA GRANADA', 'points' : '1 L'},
    {'name':'ADES MANZANA', 'points' : '200 ml'},
    {'name':'ADES MANGO', 'points' : '200 ml'},
    {'name':'ADES MANZANA SOYA', 'points' : '946 ml'},
    {'name':'ADES NATURAL SOYA', 'points' : '946 ml'},
    {'name':'MALTEADA SANTA CLARA CHOCOLATE', 'points' : '200ml'},
    {'name':'MALTEADA SANTA CLARA FRESA', 'points' : '200 ml'},
    {'name':'MALTEADA SANTA CLARA CAPUCCINO', 'points' : '200ml'},
    {'name':'MALTEADA SANTA CLARA VAINILLA', 'points' : '200 ml'},
    {'name':'LECHE SANTA CLARA UHT ENTERA', 'points' : '1 LT'},
    {'name':'LECHE SANTA CLARA UHT LIGHT', 'points' : '1LT'},
    {'name':'LECHE SANTA CLARA UHT DESLACTOSADA', 'points' : '1LT'},
    {'name':'COCA COLA  VNR', 'points' : '235 ML'},
    {'name':'COCA COLA LIGHT  VNR', 'points' : '235 ML'},
    {'name':'COCA COLA SIN AZUCAR VNR', 'points' : '235 ML'},
    {'name':'COCA COLA CON CAFE', 'points' : '235 ML'},
    {'name':'COCA-COLA CAFE CON CARAMELO', 'points' : '235 ML'},
    {'name':'COCA-COLA CAFE CON VAINILLA', 'points' : '235 ML'},
    {'name':'COCA COLA NR', 'points' : '355 ML'},
    {'name':'COCA COLA LIGHT NR', 'points' : '355 ML'},
    {'name':'COCA COLA SIN AZUCAR LATA', 'points' : '355 ML'},
    {'name':'COCA COLA LIGHT  LATA', 'points' : '355 ML'},
    {'name':'COCA COLA  LATA', 'points' : '355 ML'},
    {'name':'COCA COLA  LATA', 'points' : '473 ML'},
    {'name':'COCA COLA VR', 'points' : '500 ML'},
    {'name':'COCA COLA LIGHT  VNR', 'points' : '500 ML'},
    {'name':'COCA COLA  VNR', 'points' : '500 ML'},
    {'name':'COCA COLA SIN AZUCAR VNR', 'points' : '500 ML'},
    {'name':'COCA COLA NR', 'points' : '600 ML'},
    {'name':'COCA COLA LIGHT  NR', 'points' : '600 ML'},
    {'name':'COCA COLA SIN AZUCAR  NR', 'points' : '600 ML'},
    {'name':'COCA COLA  NR', 'points' : '710 ML'},
    {'name':'COCA COLA NR', 'points' : '1 LT'},
    {'name':'COCA COLA LIGHT NR', 'points' : '1 LT'},
    {'name':'COCA COLA SIN AZUCAR NR', 'points' : '1 LT'},
    {'name':'COCA COLA  NR', 'points' : '1.25 LT'},
    {'name':'COCA COLA  RET', 'points' : '1.5 LT'},
    {'name':'COCA COLA NR', 'points' : '2 LT'},
    {'name':'COCA COLA LIGHT NR', 'points' : '2 LT'},
    {'name':'COCA COLA SIN AZUCAR  NR', 'points' : '2.5 LT'},
    {'name':'COCA COLA LIGHT  NR', 'points' : '2.5 LT'},
    {'name':'COCA COLA RET', 'points' : '2.5 LT'},
    {'name':'COCA COLA NR', 'points' : '2.5 LT'},
    {'name':'COCA COLA NR', 'points' : '3 LT'},
    {'name':'TOPO CHICO SANGRIA', 'points' : '600 ml'},
    {'name':'FANTA  LATA', 'points' : '355 ML'},
    {'name':'SPRITE LATA', 'points' : '355 ml'},
    {'name':'FRESCA  LATA', 'points' : '355 ML'},
    {'name':'DELAWARE PUNCH  LATA', 'points' : '355 ML'},
    {'name':'FANTA L NR', 'points' : '600 M'},
    {'name':'FANTA  NR', 'points' : '2 LT'},
    {'name':'FRESCA  NR', 'points' : '2 LT'},
    {'name':'DELAWARE PUNCH NR', 'points' : '600 ML'},
    {'name':'SPRITE  NR', 'points' : '3 LT'},
    {'name':'FANTA FRESA NR', 'points' : '600 ML'},
    {'name':'SPRITE  NR', 'points' : '600 ML'},
    {'name':'SPRITE  NR', 'points' : '2 LT'},
    {'name':'SPRITE ZERO  NR', 'points' : '600 ML'},
    {'name':'FRESCA  NR', 'points' : '2.5 LT'},
    {'name':'FANTA NR', 'points' : '2.5 LT'},
    {'name':'SPRITE NR', 'points' : '2.5 LT'},
    {'name':'FRESCA  NR', 'points' : '400 ML'},
    {'name':'SPRITE NR', 'points' : '400 ML'},
    {'name':'SIDRAL MUNDET NR', 'points' : '600 ML'},
    {'name':'SIDRAL MUNDET  NR', 'points' : '2 LT'},
    {'name':'SIDRAL MUNDET NR', 'points' : '2.5 LT'},
    {'name':'SIDRAL MUNDET NR', 'points' : '400 ML'},
    {'name':'SIDRAL MUNDET NR', 'points' : '1.5 LT'},
    {'name':'NARANJA Y NADA DEL VALLE', 'points' : '600 ml'},
    {'name':'NARANJA Y NADA DEL VALLE', 'points' : '1.5  LT'},

  ];

  imagePath = '';
  videoPath: SafeResourceUrl;


  sliderOpts = {
    zoom: {
      maxRatio: 2
    }
  };

  constructor(private servicesApi: ApiLaravelService,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,) {
  }
  
  async ionViewWillEnter(){
    this.servicesApi.getImageAward('steps').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.imagePath = resp['imagePath'];
      // debugger;
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
      // console.log(this.videoPath);
    });

  }

  ngOnInit() {
    if(this.route.snapshot.paramMap.get('instructions')){
      this.instructions = this.route.snapshot.paramMap.get('instructions');
    }else{
      this.instructions = 'ticket';
    }
  }


}
