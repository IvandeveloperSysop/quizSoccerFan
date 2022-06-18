import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiLaravelService } from './../../services/api-laravel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage {

  @ViewChild('introSlider')  slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  videoPath: SafeResourceUrl;

  constructor(private servicesApi: ApiLaravelService,
              private sanitizer: DomSanitizer) { }

  async ionViewWillEnter(){

    this.servicesApi.getImageAward('steps').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
      // this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/707943476?h=f4b2f56e6d&badge=0&autopause=0&player_id=0&app_id=58479");
    });

  }
  
  swipeNext(){
    this.slides.slideNext();
  }

}
