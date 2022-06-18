import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.page.html',
  styleUrls: ['./steps.page.scss'],
})
export class StepsPage implements OnInit {

  instructions;
  products = [
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL MINERALIZADA' ,'cantidad':'600 ML'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL MINERALIZADA' ,'cantidad':'2 L'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL TWIST','cantidad':'600 ML'},
    {'name':'AGUA MINERALIZADA','marca':'CIEL','producto':'CIEL TWIST','cantidad':'1.5 L'},
    {'name':'AGUA','marca':'CIEL','producto':'AGUA PURIFICADA','cantidad':'600 ML'},
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
      console.log(resp)
      // this.imagePath = resp['imagePath'];
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
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
