import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-slider-modal',
  templateUrl: './slider-modal.page.html',
  styleUrls: ['./slider-modal.page.scss'],
})
export class SliderModalPage{

  @Input() nonShow // This is the article you passed before open the modal

  options = {
    slidesPerView: 1,
    centeredSlides: true,
    loop: false,
    slideShadows: true,
    spaceBetween: 20,
    // autoplay:true,
  };

  constructor(public modalCtrl: ModalController,private servicesApi: ApiLaravelService) { }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  noShowPopUp(){

    this.servicesApi.disableModalHome(localStorage.getItem('user.token')).subscribe( resp => {
      console.log(resp);
      this.dismiss();
    });

  }
}
