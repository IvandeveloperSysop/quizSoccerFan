
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiLaravelService } from '../services/api-laravel.service';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.page.html',
  styleUrls: ['./home-modal.page.scss'],
})
export class HomeModalPage {

  // image : any;
  // title : any;
  // content : any;
  @Input() popUp // This is the article you passed before open the modal

  constructor(public modalCtrl: ModalController,private servicesApi: ApiLaravelService) {}

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
