import { Component, OnInit, Sanitizer } from '@angular/core';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.page.html',
  styleUrls: ['./awards.page.scss'],
})
export class AwardsPage{

  sliderOpts = {
    zoom: {
      maxRatio: 2
    }
  };
  imagePath = '';
  videoPath: SafeResourceUrl;

  constructor(private modalCtrl: ModalController, private servicesApi: ApiLaravelService, private sanitizer: DomSanitizer) {

  }

  async ionViewWillEnter(){

    //GetImage global promocional
    this.servicesApi.getImageAward('award').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.imagePath = resp['imagePath'];
      // debugger;
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
      console.log(this.videoPath);
    });

  }



  async openPreview(img) {
    const modal = await this.modalCtrl.create({
      component: ImageModalPage,
      cssClass: 'transparent-modal',
      componentProps: {
        img
      }
    });
    modal.present();
  }

}
