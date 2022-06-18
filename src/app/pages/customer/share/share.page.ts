import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from '../../../services/api-laravel.service';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoadingController } from 'node_modules/@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage {

  nickName: string;
  // image: string;
  source: string;
  labelErrorImg: string;
  imgSourceShare: any;
  buttonValid = false;
  url: string;
  validExist = false;
  appShare: any;
  idShare: number;
  isApp;
  linkShare;
  linkShareFB;
  extensionShare;
  redSocial = 'whatsapp';

  isListItemOpened : boolean = false;


  public isMenuOpen : boolean = false;

  loading: any;
  constructor(private route: ActivatedRoute,
              public actionSheetController: ActionSheetController,
              public toastController: ToastController,
              private servicesApi: ApiLaravelService,
              public loadingController: LoadingController,
              public alertController: AlertController, 
              //private socialSharing: SocialSharing
              ) {
      this.nickName = localStorage.getItem('user.nickName');
      // this.linkShare = 'http://xelha.sysop.info/refer/' + this.nickName;
      this.linkShare = 'https://somostopochico.com/refer/' + this.nickName;
      this.linkShareFB = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsomostopochico.com%2Frefer%2F' + this.nickName + '&amp;src=sdkpreparse';
      // this.linkShareFB = 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%api.apantallateconciel.com%2F%23%2apantallate%2F%23%2Frefer%2F' + this.nickName + '&amp;src=sdkpreparse';
      this.servicesApi.validExistShare(this.nickName).subscribe(resp => {
        console.log(resp);
        if (resp['message'] === 'ok'){
          this.validExist = true;
          // tslint:disable-next-line:no-string-literal
          this.appShare = resp['result'];
          this.idShare = this.appShare.id;
          // console.log(this.appShare);
        }else{
          this.validExist = false;
        }
      });
      // this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
      // console.log(this.isApp);
  }

  async onSubmit(formulario: NgForm) {
    this.buttonValid = false;

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando información...'
    });
    await this.loading.present();

    this.servicesApi.postInsertShare(this.imgSourceShare, this.url, localStorage.getItem('user.nickName'), this.extensionShare).subscribe(resp => {
        // tslint:disable-next-line:no-string-literal
        if (resp['message']){
          this.presentToastWithOptions('error');
          this.loading.dismiss();
          return;
        // tslint:disable-next-line:no-string-literal
        }

        this.validExist = true;
        // tslint:disable-next-line:no-string-literal
        this.appShare = resp['result'];
        this.idShare = this.appShare.id;
        this.buttonValid = true;
        this.loading.dismiss();
        // console.log(resp);
    }, err => {
      this.imageError();
      this.loading.dismiss();
    } );

  }

  public toggleAccordion(): void {
    this.isListItemOpened = !this.isListItemOpened;
  }


  async updateShare(formulario: NgForm) {
    // debugger;
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando información...'
    });
    await this.loading.present();
    this.servicesApi.postUpdateShare(this.imgSourceShare, this.url, this.idShare, this.extensionShare, localStorage.getItem('user.nickName')).subscribe(resp => {
      // console.log(resp);
      // tslint:disable-next-line:no-string-literal
      if (resp['message']){
        this.presentToastWithOptions('error');
        this.loading.dismiss();
        return;
      // tslint:disable-next-line:no-string-literal
      }

      this.validExist = true;
      // tslint:disable-next-line:no-string-literal
      this.appShare = resp['result'];
      this.loading.dismiss();
      // console.log(resp);
    }, err => this.imageError());
  }

  async imageError() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: 'Image',
      message: 'La imagen que deseas cargar es demasiado pesada favor de revisar el tamaño del archivo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  onClick(){
    this.presentActionSheet();
  }

  async shareAppWeb() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir',
      cssClass: 'custom-sheet',
      buttons: [{
        text: 'Compartir en facebook',
        icon: 'logo-facebook',
        handler: () => {
          // tslint:disable-next-line:quotemark
          document.getElementById("shareFacebook").click();
          this.presentToastFacebookShare();
        }
      }, {
        text: 'Copiar link al porta papeles',
        icon: 'clipboard-outline',
        handler: () => {

          const selBox = document.createElement('textarea');
          selBox.style.position = 'fixed';
          selBox.style.left = '0';
          selBox.style.top = '0';
          selBox.style.opacity = '0';
          selBox.value = this.linkShare;
          document.body.appendChild(selBox);
          selBox.focus();
          selBox.select();
          document.execCommand('copy');
          document.body.removeChild(selBox);

          this.presentToast('Copiado');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async shareAppWhatsapp(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Compartir',
      cssClass: 'custom-sheet',
      buttons: [{
        text: 'Invitar por WhatsApp',
        icon: 'logo-whatsapp',
        handler: () => {
          window.location.href ='https://api.whatsapp.com/send?&text=!Hey!%20reg%C3%ADstrate%20para%20ganar%20Viajes%20dobles%20a%20Xel-H%C3%A1,%20Hieleras%20y%20Tarjetas%20Virtuales,%20revisa%20la%20informaci%C3%B3n%20en%20este%20enlace%20:D%20%20%20https://somostopochico.com/refer/' + this.nickName;
        }
      }, {
        text: 'Copiar link de invitación',
        icon: 'clipboard-outline',
        handler: () => {

          const selBox = document.createElement('textarea');
          selBox.style.position = 'fixed';
          selBox.style.left = '0';
          selBox.style.top = '0';
          selBox.style.opacity = '0';
          selBox.value = this.linkShare;
          document.body.appendChild(selBox);
          selBox.focus();
          selBox.select();
          document.execCommand('copy');
          document.body.removeChild(selBox);

          this.presentToast('Copiado');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async presentActionSheet() {
    /*const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'custom-sheet',
      buttons: [{
        text: 'Compartir en facebook',
        icon: 'logo-facebook',
        handler: () => {
          this.socialSharing.share('hola', 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y', 'http://localhost:8100/').then((res) => {
            // Success
          }).catch((e) => {
            // Error!
          });
        }
      }]
    });
    await actionSheet.present();*/

  }

  async presentToastFacebookShare() {
    const toast = await this.toastController.create({
      header: 'Compartido en Facebook',
      position: 'top',
      color: 'primary',
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
        }
      ]
    });
    toast.present();
  }

  async changeImage($event: Event) {

    // tslint:disable-next-line:no-string-literal
    if ($event.target['files'][0]){
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      // tslint:disable-next-line:no-string-literal
      if (!acceptedImageTypes.includes($event.target['files'][0].type)){
        // console.log('if');
        // console.log('Entro');
        this.presentToastWithOptions('El archivo que desea cargar no es una imagen valida');
        return;
      }

      // tslint:disable-next-line:no-string-literal
      this.extensionShare = $event.target['files'][0]['name'].split('.').pop();
      // tslint:disable-next-line:no-string-literal
      this.imgSourceShare = (await this.toBase64($event.target['files'][0]));
      this.validShareSubmit();
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
})

  async presentToastWithOptions(messag: string ) {
    const toast = await this.toastController.create({
      header: 'Error',
      message: messag,
      position: 'top',
      color: 'danger',
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToast(messages) {
    const toast = await this.toastController.create({
      message: messages,
      duration: 2000
    });
    toast.present();
  }

  validShareSubmit(){
    if (!this.url){
      this.buttonValid = false;
      return ;
    }

    if (!this.imgSourceShare){
      this.buttonValid = false;
      return ;
    }

    this.buttonValid = true;
  }


  segmentChanged(ev: any) {
    // tslint:disable-next-line:no-string-literal
    this.redSocial = ev.detail['value'];
  }
}
