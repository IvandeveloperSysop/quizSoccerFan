import { AnalyticsService } from './../../../services/analytics.service';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
//import Swal from 'sweetalert2';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {NgxImageCompressService} from 'ngx-image-compress';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-tickets',
  templateUrl: './upload-tickets.page.html',
  styleUrls: ['./upload-tickets.page.scss'],
})
export class UploadTicketsPage{

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('formulario', {static: false}) myForm: NgForm;

  /*---------------- VARIABLES GLOBALES-----------------*/

    // tslint:disable-next-line:no-inferrable-types
    dateMin: string = '2021-01-01';
    public dateMax: string ;
    final_date: string ;
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
      store: 'Kiosko',
      state: 1,
    };

    presentations;
    arrPresentations = [];

    userName;
    userScore;
    userRefer;
    valuePresentation;
    userImage;
    notifications = 0;
    imgResultBeforeCompress;
    imgResultAfterCompress;
    states: any;
    loading: any;
    UploadButton;
    routeGlobal;
    imageBanner;
    videoPath: SafeResourceUrl;

    tokenUser: string = localStorage.getItem('user.token');
  /*------------------------------------------------------*/

  constructor(
    private servicesApi: ApiLaravelService,
    // tslint:disable-next-line:align
    private toastController: ToastController,
    // tslint:disable-next-line:align
    private router: Router,
    // tslint:disable-next-line:align
    public alertController: AlertController,
    // tslint:disable-next-line:align
    private imageCompress: NgxImageCompressService,
    // tslint:disable-next-line:align
    public loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    public analytics: AnalyticsService) {}
    
    async ionViewWillEnter(){
      const dateNow: Date = new Date();
      const years = dateNow.getFullYear();
      // se le suma un mes por que el array comienza en 0
      let month: any = dateNow.getMonth() + 1;
      let day: any = dateNow.getDate();
      if (month < 10){
        month = '0' + month;
      }
      if (day < 10){
        // debugger;
        day = '0' + day;
      }

    this.dateMax = `${years}-${month}-${day}`;

    this.servicesApi.getImageAward('award').subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
      // console.log(this.videoPath);
    });

    this.getPeriods();

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });

    await this.loading.present();
    // Trae la infomación del usuario de la session
    this.servicesApi.getUserInfo(localStorage.getItem('user.token')).subscribe( resp => {

      // tslint:disable-next-line:no-string-literal
      if (!resp['message']){
        // tslint:disable-next-line:no-string-literal
        this.userImage = resp['image'];
        // console.log(this.userImage);
        // tslint:disable-next-line:no-string-literal
        this.userName = resp['nickName'];
        // tslint:disable-next-line:no-string-literal
        this.userRefer = resp['refers'];
        // tslint:disable-next-line:no-string-literal
        this.userScore = resp['score'];
        // tslint:disable-next-line:no-string-literal
        this.ticket.state = resp['stateUser'];
        // tslint:disable-next-line:no-string-literal
        this.states = resp['states'];

        // debugger;
        if (resp['notifications'] !== 0 ){
          this.notifications = 1;
        }else{
          this.notifications = 0;
        }
        // debugger;
        // Valida la versión del usuario
        this.servicesApi.validversion();
        this.loading.dismiss();

      }else{
        this.servicesApi.logout();
      }
    });

    this.getPresentation();
  }

  getPeriods(){
    // debugger;
    this.servicesApi.getPeriods(this.dateMax,localStorage.getItem('promo_id')).subscribe(resp => {
      console.log(resp);
      // tslint:disable-next-line:no-string-literal
      if (resp['period']){
      // tslint:disable-next-line:no-string-literal
        this.imageBanner =resp['period']['routeGlobal']+ resp['period']['promo']['image'];
        // console.log(this.imageBanner);
        // debugger;

        this.dateMin = resp['period']['inicial_date'];
        this.final_date = resp['period']['final_date'];
      // tslint:disable-next-line:no-string-literal
        if (this.dateMax > resp['period']['final_date']){
      // tslint:disable-next-line:no-string-literal
          this.dateMax = resp['period']['final_date'];
        }

        // console.log(this.dateMin);
        if (!this.dateMin){
          this.UploadButton =  false;
          this.dateMin = this.dateMax;
        }else{
          this.UploadButton =  true;
        }
      }
    });
  }


  getPresentation(){
    // trae el array de las presentaciones
    this.servicesApi.getPresentation().subscribe( resp => {
      console.log(resp);
      this.presentations = resp;
    });
  }

  // Cada que cambia o se agrega un valor a cualquier presentación se crea un array que se envia al post
  presentationChange(event: Event, idPresentation){
    // debugger;
    const cantPresentation = (event.target as HTMLInputElement).value;
    this.arrPresentations[idPresentation] = {
      id : idPresentation,
      value : cantPresentation ? cantPresentation : 0
    };

  }

  // loading que muestra cuando se sube el ticket
  async loadSubmit() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando ticket...'
    });
    await this.loading.present();
  }

  //  Comprimir foto por tamaño
  async compressFile() {

    this.loadSubmit();

    this.imageCompress.uploadFile().then( ({image, orientation}) => {
      this.imgResultBeforeCompress = image;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      // return;
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          if (result) {
            console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));

            this.source = result;
            this.image = result;
            this.extension = result.split(';')[0].split('/')[1];
            this.labelErrorImg = false;
            this.validButton();

          }
          else {
            this.presentToastWithOptions('El archivo que desea cargar no es una imagen valida');
            if (!this.source){
              this.labelErrorImg = true;
            }
          }

        }
      );
    });

  }

  // Cada que cambia la imagen se hace una validación para saber si es un archivo valido
  async updateSource($event: Event) {

    // tslint:disable-next-line:no-string-literal
    if ($event.target['files'][0]){
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      // Validación para que sea una imagen
      // tslint:disable-next-line:no-string-literal
      if (!acceptedImageTypes.includes($event.target['files'][0].type || true)){
        // console.log('Entro');
        this.presentToastWithOptions('El archivo que desea cargar no es una imagen valida');
        if (!this.source){
          this.labelErrorImg = true;
        }
        return;
      }
    // tslint:disable-next-line:no-string-literal
      this.extension = $event.target['files'][0]['name'].split('.').pop();
    // tslint:disable-next-line:no-string-literal
      this.projectImage($event.target['files'][0]);
    // tslint:disable-next-line:no-string-literal
      this.image = (await this.toBase64($event.target['files'][0]));
      // console.log(this.image);
      this.labelErrorImg = false;
      this.validButton();
    }

  }

  // convierte la imagen en base64
  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  // Uses FileReader to read the file from the input
  // pre-Visualizar imagen
  projectImage(file: File) {

    // debugger;
    // tslint:disable-next-line:new-parens
    const reader = new FileReader;
    // TODO: Define type of 'e'
    reader.onload = (e: any) => {
      // Simply set e.target.result as our <img> src in the layout
      this.source = e.target.result;
      this.onChange.emit(file);
    };
    // This will process our file and get it's attributes/data
    reader.readAsDataURL(file);
  }

  // alerta de error
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

  // envio de información al API
  async postTicket() {

    // tslint:disable-next-line:prefer-const
    let image = this.image;
    // tslint:disable-next-line:prefer-const
    let orientation = -1;

    // preload que muestra que se esta subiendo el archivo
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando ticket...'
    });
    await this.loading.present();

    // Renderizar imagen
    console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
    await this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
          console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          this.image = result;
      }
    );

    // Enviar petición al API
    this.servicesApi.postInsertTicket(this.image, this.extension, this.ticket.fecha, this.ticket.store, this.arrPresentations, this.ticket.state,localStorage.getItem('promo_id')).subscribe(resp => {
      // tslint:disable-next-line:no-string-literal
      console.log(resp);
      if (resp['result'] === 'ok'){
        this.presentToast('Ticket cargado');
        this.image = '';
        this.extension = '';
        this.ticket.fecha = '';
        this.source = '';
        this.arrPresentations = [];
        // tslint:disable-next-line:no-string-literal
        let presentationInput = document.getElementsByClassName('presentationInput');
        for (let i = 0; i < presentationInput.length; i++) {
          // tslint:disable-next-line:no-angle-bracket-type-assertion
          (<HTMLInputElement>presentationInput.item(i)).value = '';
        }
        // tslint:disable-next-line:no-string-literal
        this.idMinigame = resp['minigame_score']['id'];
        this.myForm.resetForm();
        document.getElementById('itemDate').classList.remove('ion-invalid');

        if(resp['presentationValue'] >= 5){
          this.enterMiniGame(this.idMinigame);
        }

      } else{
        if(resp['result'] === 'promoFinished'){
          this.promoNonValid(resp['message']);
        }else{
          this.validPresentToast('Error');
        }
      }

      this.loading.dismiss();
    });

  }

  async promoNonValid(message) {
    // console.log(idMinigame);
    const alert = await this.alertController.create({
      cssClass: 'myalert',
      header: '¡Promoción finalizada!',
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          cssClass: 'buttonsMinigame',
        }
      ]
    });

    await alert.present();
  }

  // validación antes de entrar al POST
  async onSubmit(formulario: NgForm) {
    // debugger;
    let cantidad = 0;
    // this.arrPresentations.forEach(i => cantidad += parseInt(i.value));

    // if (this.ticket.fecha && cantidad > 0 ){
    if (this.ticket.fecha ){
      if (this.buttonValid) {
        // return;
        // if (!this.ticket.state){
        //   this.presentToastWithOptions('Debes seleccionar un estado');
        //   return;
        // }
        if (!this.ticket.store){
          this.validPresentToast('Favor de seleccionar una tienda valida');
        }else{
          this.postTicket();
        }
      }else {
        this.validPresentToast('Los datos ingresados son incorrectos, por favor verificalos');
        /*Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Los datos ingresados son incorrectos, por favor verificalos',
          timer: 2000
        });*/
      }
    }else{
      if (!this.ticket.fecha){
        this.validPresentToast('favor de ingresar la fecha del ticket');
      }
      // if (cantidad === 0){
      //   this.validPresentToast('favor de ingresar la cantidad de presentaciones');
      // }
    }
  }

  // alerta para llamar al video juego
  async enterMiniGame(idMinigame) {
    // console.log(idMinigame);
    const alert = await this.alertController.create({
      cssClass: 'myalert',
      header: '¡Genial!',
      message: '<strong>¿Quieres jugar un mini juego para ganar puntos extra ? </strong>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'buttonsMinigame',
          handler: () => {
            this.servicesApi.postNoGame(idMinigame).subscribe(resp => {
              // console.log(resp);
              // tslint:disable-next-line:no-string-literal
              this.router.navigateByUrl('/customer/home');
            });
          }
        }, {
          text: 'Si',
          cssClass: 'buttonsMinigame',
          handler: () => {
            // console.log(idMinigame);
            this.router.navigateByUrl('/customer/minigame/' + idMinigame);
          }
        }
      ]
    });

    await alert.present();
  }

  // Alerta cuando terminan los cortes
  async uplodadNoValid() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Advertencia!',
      message: '<strong> El último corte a finalizado, te invitamos a participar en nuestras demas promociones </strong>',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Habilita boton cuando ya se carga la imagen
  validButton() {

    if (!this.image){
      this.buttonValid = false;
      return ;
    }

    this.buttonValid = true;
  }

  // alerta success
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}` ,
      duration: 2500,
      position: 'top',
      color: 'success' ,
    });
    toast.present();

  }

  // alerta de advertencia
  async validPresentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}` ,
      duration: 2500,
      position: 'top',
      color: 'warning' ,
      buttons: [
        {
          side: 'start',
          icon: 'warning-outline'
        }
      ]
    });
    toast.present();

  }


}
