import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from '../../services/api-laravel.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { format, parseISO } from 'date-fns';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  usuario = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    ciudad: '',
    zip: '',
    street: '',
    suburb: '',
    city: '',
    state: '',
    telefono: '',
    birthdate: '',
    nickName: '',
    // state: 1,
  };
  dateValue;
  image: any;
  id: any;
  provider: any;
  token: any;
  states;
  passConfirm = false;
  social = false;
  imgSourceProfileRegister;
  showImageSocial = true;
  extensionProfileRegister;
  imageResultRegister;
  checkedTerms;
  loading: any;
  // tslint:disable-next-line:no-inferrable-types
  dateMin: string = '2021-01-01';
  dateMax: string = '2021-01-01' ;
  UploadButton =  true;

  constructor(  private servicesApi: ApiLaravelService,
                private route: ActivatedRoute,
                public toastController: ToastController,
                public alertController: AlertController,
                private imageCompress: NgxImageCompressService,
                public loadingController: LoadingController,
                private render:Renderer2) {

    // this.idMinigame = this.route.snapshot.paramMap.get('idMinigame');
    // debugger;
    // Validación para saber si es un registro por red social
    if (this.route.snapshot.paramMap.get('name')){
      //  si es un usuario con red social guarda la imagen del servicio
      this.provider = this.route.snapshot.paramMap.get('provider');
      // console.log(this.provider);
      // tslint:disable-next-line:triple-equals
      this.image = this.route.snapshot.paramMap.get('photoUrl');
      this.usuario.name = this.route.snapshot.paramMap.get('name');
      this.usuario.email = this.route.snapshot.paramMap.get('email');
      this.id = this.route.snapshot.paramMap.get('id');
      this.provider = this.route.snapshot.paramMap.get('provider');
      // this.usuario.nickName = this.route.snapshot.paramMap.get('name');
      this.token = this.route.snapshot.paramMap.get('authToken');
      this.social = true;
      this.showImageSocial = false;
    }
    this.checkedTerms = false;
    // Recibe la información de los estados
    this.servicesApi.getStates().subscribe(states => {
      this.states = states;
    });

    this.registerValid();


  }

  //  Post del registro de usuario
  async register( formulario: NgForm ) {

    // debugger;
    if (!formulario.valid){
      // console.log(formulario);
      this.validForm(formulario);
      return;
    }

    if (!this.social ){
      this.passConfirm = this.validPassword();
      if (this.passConfirm){
        return;
      }
    }

    // if (!this.usuario.state){
    //   this.presentToastWithOptions('Debes seleccionar un estado');
    //   return;
    // }

    // debugger;
    if (!this.checkedTerms){
      this.presentToast('Debes aceptar terminos y conciones para poder registrarte.');
      return;
    }
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Validando información...'
    });
    // await this.loading.present();

    if (this.imageResultRegister){
      if (this.imageCompress.byteCount(this.imgSourceProfileRegister)){
        // tslint:disable-next-line:prefer-const
        let image = this.imgSourceProfileRegister;
        // tslint:disable-next-line:prefer-const
        let orientation = -1;
        await this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => {
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              this.imgSourceProfileRegister = result;
          }
        );
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      }
    }


    // Logica si es resgistro en red soscial
    if (this.social){
      // this.servicesApi.postInsertUserSocial(this.usuario.email, this.usuario.name,this.usuario.ciudad, this.usuario.zip, this.usuario.street,this.usuario.suburb,this.usuario.city,this.usuario.state, this.usuario.telefono, this.usuario.birthdate,this.usuario.nickName, this.image, this.id, this.provider, this.token, this.usuario.state)
      this.servicesApi.postInsertUserSocial(this.usuario.email, this.usuario.name, this.usuario.telefono, this.usuario.birthdate,this.usuario.nickName, this.image, this.id, this.provider, this.token, this.usuario.state)
      .subscribe( resp => {
        // console.log(resp);
        // tslint:disable-next-line:no-string-literal
        if (resp['message']){
          // Validación si ya existe el usuario
          // tslint:disable-next-line:no-string-literal
          if (resp['result'] === 'email-novalid'){
            document.getElementById('itemEmail').classList.add('ion-invalid');
            document.getElementById('itemEmail').classList.add('ion-touched');
          // tslint:disable-next-line:no-string-literal
          }else if (resp['result'] === 'nickname-novalid'){
            // Validación si ya existe ese nickName
            document.getElementById('itemNickName').classList.add('ion-invalid');
            document.getElementById('itemNickName').classList.add('ion-touched');
          }
          // tslint:disable-next-line:no-string-literal
          this.servicesApi.presentAlertConfirm(resp['message']);
          this.loading.dismiss();
          return;
        }
        this.servicesApi.guardarUser( resp );
        this.loading.dismiss();
        // console.log(resp);
      });
    }else{
      // Registro normal
      const correo = this.usuario.email;
      const pass = this.usuario.password;
      const nombre = this.usuario.name;
      const ciudad = this.usuario.ciudad;
      const zip = this.usuario.zip;
      const street = this.usuario.street;
      const suburb = this.usuario.suburb;
      const city = this.usuario.city;
      const state = this.usuario.state;
      const telefono = this.usuario.telefono;
      const birthdate = this.usuario.birthdate;
      const nickName = this.usuario.nickName;

      if(!birthdate){
        this.presentToast('Favor de seleccionar una fecha de nacimiento valida');
        return;
      }

      // this.servicesApi.postInsertUser(correo, pass, nombre, ciudad, zip, street, suburb, city, state, telefono, birthdate, nickName, this.imageResultRegister, this.extensionProfileRegister, this.usuario.state)
      this.servicesApi.postInsertUser(correo, pass, nombre, telefono, birthdate, nickName, this.imageResultRegister, this.extensionProfileRegister)
      .subscribe( resp => {
        // debugger;

        console.log(resp);
        // tslint:disable-next-line:no-string-literal
        if (resp['message']){
          // Validación si ya existe el usuario
          // tslint:disable-next-line:no-string-literal
          if (resp['result'] === 'email-novalid'){
            document.getElementById('itemEmail').classList.add('ion-invalid');
            document.getElementById('itemEmail').classList.add('ion-touched');
          // tslint:disable-next-line:no-string-literal
          }else if (resp['result'] === 'nickname-novalid'){
            // Validación si ya existe ese nickName
            document.getElementById('itemNickName').classList.add('ion-invalid');
            document.getElementById('itemNickName').classList.add('ion-touched');
          }
          // tslint:disable-next-line:no-string-literal
          this.servicesApi.presentAlertConfirm(resp['message']);
          this.loading.dismiss();
          return;
        }
        // Guarda info en el local storage
        this.servicesApi.guardarUser( resp );
        localStorage.removeItem('validCampaign');
        this.loading.dismiss();
      });
    }

  }

  confirmPassWord(){
    this.passConfirm = this.validPassword();
  }

  // Validación si el password es igual
  validPassword(): boolean {

    // let validPass = false;
    if (this.usuario.password !== this.usuario.passwordConfirm){
      document.getElementById('itemPassword').classList.add('ion-invalid');
      document.getElementById('itemPasswordConfirm').classList.add('ion-invalid');
      document.getElementById('itemPassword').classList.add('ion-touched');
      document.getElementById('itemPasswordConfirm').classList.add('ion-touched');
      this.usuario.passwordConfirm = '';
      return true;
    }else{
      document.getElementById('itemPassword').classList.remove('ion-invalid');
      document.getElementById('itemPasswordConfirm').classList.remove('ion-invalid');
      document.getElementById('itemPassword').classList.remove('ion-touched');
      document.getElementById('itemPasswordConfirm').classList.remove('ion-touchedd');

      return false;
    }
  }

  // Validación de Campos obligatorios
  validForm(formulario: NgForm){

    if ( !formulario.valid ){
      this.presentToast('Favor de llenar los campos requeridos');
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

      if (!formulario.controls.nickName.valid){
        document.getElementById('itemNickName').classList.add('ion-invalid');
        document.getElementById('itemNickName').classList.add('ion-touched');
      }else{
        document.getElementById('itemNickName').classList.remove('ion-invalid');
        document.getElementById('itemNickName').classList.remove('ion-touched');
      }

      // debugger;
      if (!this.social){

        const validPass = this.validPassword();
        if (!validPass){
          if (!formulario.controls.password.valid){
            document.getElementById('itemPassword').classList.add('ion-invalid');
            document.getElementById('itemPassword').classList.add('ion-touched');
          }else{
            document.getElementById('itemPassword').classList.remove('ion-invalid');
            document.getElementById('itemPassword').classList.remove('ion-touched');
          }

          if (!formulario.controls.passwordConfirm.valid){
            document.getElementById('itemPasswordConfirm').classList.add('ion-invalid');
            document.getElementById('itemPasswordConfirm').classList.add('ion-touched');
          }else{
            document.getElementById('itemPasswordConfirm').classList.remove('ion-invalid');
            document.getElementById('itemPasswordConfirm').classList.remove('ion-touched');
          }
        }
      }

    }
    // this.usuario.nickName = $.trim(this.usuario.nickName);

  }

  // Función para que el nickName no tenga espacios
  cleanUnnecessaryWhiteSpaces(){
    let nickName: string  = this.usuario.nickName;
    // tslint:disable-next-line:quotemarks
    this.usuario.nickName = nickName.split(" ").join("");
    // this.usuario.nickName = nickName.replaceAll(" ", "");
  }

  // alert de error
  async presentToast(messa: string) {
    const toast = await this.toastController.create({
      message: messa,
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }

  // Validacion de que la imagen sea un arhivo valido
  async changeImageProfileRegister($event: Event) {
    // tslint:disable-next-line:no-string-literal
    if ($event.target['files'][0]){
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      // tslint:disable-next-line:no-string-literal
      if (!acceptedImageTypes.includes($event.target['files'][0].type)){
        this.presentToastWithOptions('El archivo que desea cargar no es una imagen valida');
        return;
      }

      // tslint:disable-next-line:no-string-literal
      this.extensionProfileRegister = $event.target['files'][0]['name'].split('.').pop();
      // convierte imagen en base 64
      // tslint:disable-next-line:no-string-literal
      this.imgSourceProfileRegister = (await this.toBase64($event.target['files'][0]));
      // tslint:disable-next-line:no-string-literal
      this.imageResultRegister = (await this.toBase64($event.target['files'][0]));
    }
  }

  // validación de terminos y condiciones
  addValue(e) {
    // debugger;
    this.checkedTerms = e.detail.checked;
    // this.checkedTerms = !this.checkedTerms;
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  redirectLogin() {
    window.location.href = '/login';
  }

  registerValid(){
    this.servicesApi.getRegisterPeriods(1).subscribe(resp => {
      console.log(resp);
      // tslint:disable-next-line:no-string-literal
      this.dateMin = resp['period']['inicial_date'];
      // debugger;
      if (!this.dateMin){
        // this.UploadButton =  false;
        this.dateMin = this.dateMax;
      }
      // else{
      //   this.UploadButton =  true;
      // }
    });
  }

  // Alerta cuando terminan los cortes
  async nonRegister() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¡Advertencia!',
      message: '<strong> El último corte a finalizado, te invitamos a participar en nuestras demas promociones </strong>',
      buttons: ['OK']
    });

    await alert.present();
  }


  nicknameChange(event) {
    // console.log(event.key);

    let regExp = /^([a-zA-Z0-9_-]+)$/;
    let test = regExp.test(event.key);
    // console.log(test);

    return test;
  }

  formatDate(value: string) {
    if(value){
      return format(parseISO(value), 'dd/MM/yyyy');
    }
  }



}
