// import { ModalPage } from './../../../modal/modal.page';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ModalPage } from '../../modal/modal.page';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {

  avisos;
  shadow = false;
  nonNotices;
  constructor(public alertController: AlertController,
              private servicesApi: ApiLaravelService,
              // tslint:disable-next-line:align
              private toastController: ToastController,
              // tslint:disable-next-line:align
              private router: Router,
              public modalController: ModalController) { }

  ionViewWillEnter(){
    this.getAvisos();
  }

  deleteItem(idAviso){
    // console.log(idAviso);
    this.servicesApi.deleteAviso(idAviso, localStorage.getItem('user.token')).subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      if (resp['message'] === 'ok'){
        this.getAvisos();
        this.presentToastWithOptions('Aviso eliminado');
      }else{
        // console.log(resp);
      }
    });
  }

  getAvisos(){
    this.servicesApi.getAvisos(localStorage.getItem('user.token')).subscribe( resp => {
      // debugger;
      // console.log(resp);
      this.shadow = true;
      // tslint:disable-next-line:no-string-literal
      if (resp['message'] === 'ok'){
        // tslint:disable-next-line:no-string-literal
        this.avisos = resp['avisos'];
        // console.log(this.avisos);
        this.nonNotices = true;
      }else{
        this.nonNotices = false;
      }
    });
  }

  async presentModal(aviso) {
    // console.log(aviso);
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'title': aviso['title'],
        'comment': aviso['comment'],
        'date': aviso['date']
      }
    });
    return await modal.present();
  }

  async presentToastWithOptions(messag: string ) {
    const toast = await this.toastController.create({
      header: 'Error',
      message: messag,
      position: 'top',
      color: 'danger',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

}
