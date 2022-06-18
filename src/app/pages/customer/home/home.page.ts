import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { HomeModalPage } from './../../../home-modal/home-modal.page';
import { SliderModalPage } from 'src/app/modals/slider-modal/slider-modal.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('formulario', {static: false}) myForm: NgForm;

  /*---------------- VARIABLES GLOBALES-----------------*/

    // tslint:disable-next-line:no-inferrable-types
    dateMin: string = '2021-01-01';
    public dateMax: string ;
    // tslint:disable-next-line:ban-types
    labelErrorImg = false;
    labelErrorCount = false;
    labelErrorAmount = false;
    labelErrorDate = false;
    buttonValid = false;
    // tslint:disable-next-line:no-inferrable-types
    cantMax: number = 25;
    // tslint:disable-next-line:no-inferrable-types
    amountMin: number = 1;
    // tslint:disable-next-line:no-inferrable-types
    amountMax: number = 400;
    variables: any[] = [];
    extension;
    image: any;
    // tslint:disable-next-line:no-inferrable-types
    source: string = '';
    idMinigame: number;
    ticket = {
      fecha: '',
      image: '',
      amount: '',
      store: '',
    };

    option = {
      slidesPerView: 1.2,
      centeredSlides: true,
      loop: false,
      spaceBetween: 20,
      // autoplay:true,
    };

    promos = [];

    presentations;
    arrPresentations = [];
    userName;
    userScore;
    pending_store;
    userRefer;
    valuePresentation;
    userImage;
    userNickName;
    notifications = 0;
    imgResultBeforeCompress;
    imgResultAfterCompress;
    routeGlobal;
    balance;
    totalOrders;
    videoPath: SafeResourceUrl;

    loading: any;

    tokenUser: string = localStorage.getItem('user.token');
  /*------------------------------------------------------*/

  constructor(
    private servicesApi: ApiLaravelService,
    private router: Router,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private sanitizer: DomSanitizer) {
  }

  async ionViewWillEnter(){

    // Get de la información del usuario
    // debugger;
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });

    await this.loading.present();

   

    this.servicesApi.getUserInfo(localStorage.getItem('user.token')).subscribe( resp => {
      // console.log(resp);
      // debugger;
      // tslint:disable-next-line:no-string-literal
      if (!resp['message']){
        // tslint:disable-next-line:no-string-literal
        this.userImage = resp['image'];
        // tslint:disable-next-line:no-string-literal
        this.userName = resp['userName'];
        // tslint:disable-next-line:no-string-literal
        this.userNickName = resp['nickName'];
        // tslint:disable-next-line:no-string-literal
        this.userRefer = resp['refers'];
        this.totalOrders = resp['totalOrders'];
        // tslint:disable-next-line:no-string-literal
        this.userScore = resp['score'];
        // tslint:disable-next-line:no-string-literal
        this.pending_store = resp['pending_score'];
        this.promos = resp['promos'];
        this.routeGlobal = resp['routeGlobal'];
        this.balance = resp['balance'];
        // console.log(this.routeGlobal)

        // debugger;
        if (resp['notifications'] !== 0 ){
          this.notifications = 1;
        }else{
          this.notifications = 0;
        }

        if(resp['validFriends'] == 1){
          this.alertFriends(resp['userId']);
        }
        // debugger;
        // Valida la version del usuario
        this.servicesApi.validversion();
        this.validPopUp(resp['userId']);
      }else{
        // borra los datos de usuario en sesion
        this.servicesApi.logout();
      }
      this.loading.dismiss();
    });

    this.servicesApi.getImageAward('steps').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
      // this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/707943476?h=f4b2f56e6d&badge=0&autopause=0&player_id=0&app_id=58479");
    });

  }

  validPopUp(user_id){

    this.servicesApi.getPopUp(user_id).subscribe( resp => {
      // debugger;
      console.log(resp);
      if(resp['result'] == 'ok'){
        this.presentModal(resp['popUp'],user_id);
      }

    });
    
  }

  openPromo(promo_id){
    localStorage.setItem('promo_id', promo_id);
    this.router.navigate(['/promo/upload/']);
  }


  async presentModal(popUp, user_id) {

    // const modal = await this.modalController.create({
    //   component: HomeModalPage,
    //   cssClass: 'my-custom-class',
    //   swipeToClose: true,
    //   componentProps: {
    //     'popUp': popUp,
    //   }
    // });

    const modal = await this.modalController.create({
      component: SliderModalPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        'nonShow': true,
      }
    });
    return await modal.present();

  }

  async modalStatic(){
    const modal = await this.modalController.create({
      component: SliderModalPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        'nonShow': false,
      }
    });
    return await modal.present();
  }

  
  // alerta para llamar al video juego
  async alertFriends(userId) {
    // console.log(idMinigame);
    const alert = await this.alertController.create({
      cssClass: 'myalert',
      header: '¡Genial!',
      message: '<strong>¿Deseas invitar a un amigo para tener más posibilidades de ganar? </strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsMinigame',
          handler: () => {
            this.servicesApi.changeValidFriend(userId).subscribe(resp => {
              // console.log(resp);
              // tslint:disable-next-line:no-string-literal
            });
          }
        }, {
          text: 'Si',
          cssClass: 'buttonsMinigame',
          handler: () => {
            // console.log(idMinigame);
            this.servicesApi.changeValidFriend(userId).subscribe(resp => {
              // console.log(resp);
              // tslint:disable-next-line:no-string-literal
            });
            this.router.navigateByUrl('/customer/share');
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cerrando sesión...'
    });
    await this.loading.present();
    this.servicesApi.logout();
    this.loading.dismiss();
  }




}
