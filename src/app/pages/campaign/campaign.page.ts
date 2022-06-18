
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.page.html',
  styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage{

  sliderOpts = {
    zoom: {
      maxRatio: 2
    }
  };

  tokenUser: string = localStorage.getItem('user.token');
  main;
  secondary;
  slug;
  imagePath;
  videoPath;

  constructor(  private route: ActivatedRoute,
                private modalCtrl: ModalController,
                private servicesApi: ApiLaravelService,
                public router: Router,
                private sanitizer: DomSanitizer) {}


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

  async ionViewWillEnter(){

    this.servicesApi.getImageCampaing('campaign').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.imagePath = resp['imagePath'];
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
    });

    // Get de la información del usuario
    // console.log(this.tokenUser);
    this.slug = this.route.snapshot.paramMap.get('slug');
    if(!this.slug){
      this.slug = 'default';
    }
    // console.log(this.slug);
    this.servicesApi.getMessages('campaign', this.slug).subscribe( resp => {
      this.main = resp['main'];
      this.secondary = resp['secondary'];
      // console.log(resp);
    });

  }

  registerCampaign(){
    localStorage.setItem('validCampaign', this.slug);
    this.router.navigate(['/login']);
  }

}
