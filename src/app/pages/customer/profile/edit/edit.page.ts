import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from '../../../../services/api-laravel.service';
import { NgForm } from '@angular/forms';
import { format, parseISO } from 'date-fns';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  usuario = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    ciudad: '',
    zip: '',
    telefono: '',
    birthdate: '',
    nickName: '',
    state: 1
  };
  dateValue;
  labelErrorImg = false;
  imgSourceProfile: any;
  extensionProfile;
  loading: any;
  imageResult;
  states;

  constructor( public loadingController: LoadingController,
    // tslint:disable-next-line:align
    private services: ApiLaravelService,
    // tslint:disable-next-line:align
    private toastController: ToastController,
    // tslint:disable-next-line:align
    private imageCompress: NgxImageCompressService) { }

  async ionViewWillEnter(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });
    await this.loading.present();
    this.services.getUser(localStorage.getItem('user.token')).subscribe( resp => {
      if (resp){
      // tslint:disable-next-line:no-string-literal
        this.usuario.nickName = resp['nickName'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.name = resp['name'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.email = resp['email'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.ciudad = resp['country'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.zip = resp['cp'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.telefono = resp['cellPhone'];
      // tslint:disable-next-line:no-string-literal
        this.usuario.birthdate = resp['birthdate'];
      // tslint:disable-next-line:no-string-literal
        this.imgSourceProfile = resp['image'];
        // tslint:disable-next-line:no-string-literal
        this.usuario.state = resp['stateUser'];
        // tslint:disable-next-line:no-string-literal
        this.states = resp['states'];
        // console.log(this.usuario.state);
      }
      this.loading.dismiss();
    });
  }

  async updateProfile(formulario: NgForm) {
    // debugger;
    if (!formulario.valid){
      this.validForm(formulario);
      return;
    }

    // if (!this.usuario.state){
    //   this.presentToastWithOptions('Debes seleccionar un estado');
    //   return;
    // }

    const correo = this.usuario.email;
    const nombre = this.usuario.name;
    const ciudad = this.usuario.ciudad;
    const zip = this.usuario.zip;
    const telefono = this.usuario.telefono;
    const birthdate = this.usuario.birthdate;
    const nickName = this.usuario.nickName;
    const state = this.usuario.state;

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Actualizando información...'
    });
    await this.loading.present();

    if (this.imageResult){
      if (this.imageCompress.byteCount(this.imgSourceProfile)){
        // tslint:disable-next-line:prefer-const
        let image = this.imgSourceProfile;
        // tslint:disable-next-line:prefer-const
        let orientation = -1;
        await this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => {
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              this.imgSourceProfile = result;
          }
        );
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      }
    }


    // tslint:disable-next-line:max-line-length
    // console.log(this.imageResult);
    this.services.postUpdateUser(correo, nombre, ciudad, zip, telefono, birthdate, nickName, localStorage.getItem('user.token'), this.imageResult, this.extensionProfile, state)
    .subscribe( resp => {
      // console.log(resp);
      // tslint:disable-next-line:no-string-literal
      if (resp['message']){
      // tslint:disable-next-line:no-string-literal
        console.log(resp['message']);
        document.getElementById('itemEmail').classList.add('ion-invalid');
        document.getElementById('itemEmail').classList.add('ion-touched');
      // tslint:disable-next-line:no-string-literal
        this.services.presentAlertConfirm(resp['message']);
        this.loading.dismiss();
        return;
      }
      this.presentToastSuccess('Datos guardados');

      // tslint:disable-next-line:no-string-literal
      this.usuario.nickName = resp['nickName'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.name = resp['name'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.email = resp['email'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.ciudad = resp['country'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.zip = resp['cp'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.telefono = resp['cellPhone'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.birthdate = resp['birthdate'];
      // tslint:disable-next-line:no-string-literal
      this.usuario.state = resp['stateUser'];
      // tslint:disable-next-line:no-string-literal
      this.loading.dismiss();

    });
  }

  validForm(formulario: NgForm){

    // debugger;
    if ( !formulario.valid ){
      this.presentToastWithOptions('Favor de llenar los campos requeridos');
      if (!formulario.controls.email.valid){
        document.getElementById('itemEmail').classList.add('ion-invalid');
        document.getElementById('itemEmail').classList.add('ion-touched');
      }else{
        document.getElementById('itemEmail').classList.remove('ion-invalid');
        document.getElementById('itemEmail').classList.remove('ion-touched');
      }

      if (!formulario.controls.name.valid){
        document.getElementById('itemName').classList.add('ion-invalid');
        document.getElementById('itemName').classList.add('ion-touched');
      }else{
        document.getElementById('itemName').classList.remove('ion-invalid');
        document.getElementById('itemName').classList.remove('ion-touched');
      }

      if (!formulario.controls.telefono.valid){
        document.getElementById('itemTelefono').classList.add('ion-invalid');
        document.getElementById('itemTelefono').classList.add('ion-touched');
      }else{
        document.getElementById('itemTelefono').classList.remove('ion-invalid');
        document.getElementById('itemTelefono').classList.remove('ion-touched');
      }

      if (!formulario.controls.ciudad.valid){
        document.getElementById('itemCiudad').classList.add('ion-invalid');
        document.getElementById('itemCiudad').classList.add('ion-touched');
      }else{
        document.getElementById('itemCiudad').classList.remove('ion-invalid');
        document.getElementById('itemCiudad').classList.remove('ion-touched');
      }

      if (!formulario.controls.zip.valid){
        document.getElementById('itemZip').classList.add('ion-invalid');
        document.getElementById('itemZip').classList.add('ion-touched');
      }else{
        document.getElementById('itemZip').classList.remove('ion-invalid');
        document.getElementById('itemZip').classList.remove('ion-touched');
      }

      if (!formulario.controls.birthdate.valid){
        document.getElementById('itemBirthdate').classList.add('ion-invalid');
        document.getElementById('itemBirthdate').classList.add('ion-touched');
      }else{
        document.getElementById('itemBirthdate').classList.remove('ion-invalid');
        document.getElementById('itemBirthdate').classList.remove('ion-touched');
      }

      if (!formulario.controls.nickName.valid){
        document.getElementById('itemNickName').classList.add('ion-invalid');
        document.getElementById('itemNickName').classList.add('ion-touched');
      }else{
        document.getElementById('itemNickName').classList.remove('ion-invalid');
        document.getElementById('itemNickName').classList.remove('ion-touched');
      }

    }

  }

  async changeImageProfile($event: Event) {
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
      this.extensionProfile = $event.target['files'][0]['name'].split('.').pop();
      // tslint:disable-next-line:no-string-literal
      this.imgSourceProfile = (await this.toBase64($event.target['files'][0]));
      // tslint:disable-next-line:no-string-literal
      this.imageResult = (await this.toBase64($event.target['files'][0]));
    }
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
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToastSuccess(messag: string ) {
    const toast = await this.toastController.create({
      message: messag,
      position: 'top',
      color: 'success',
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })


  formatDate(value: string) {
    if(value){
      return format(parseISO(value), 'dd/MM/yyyy');
    }
  }


}
