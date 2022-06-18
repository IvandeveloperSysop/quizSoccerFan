import { NgxImageCompressService } from 'ngx-image-compress';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from '../../services/api-laravel.service';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage {

  token: string;
  image: string;
  source: string;
  labelErrorImg: string;
  buttonValid: false;
  imagePath = '';
  videoPath: SafeResourceUrl;
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
  passConfirm = false;
  referUser: any;
  states;
  dateValue;
  checkedTerms;
  validUser = false;
  imgSourceProfileRefer;
  extensionProfileRefer;
  imageResultRefer;
  loading: any;
  constructor(private route: ActivatedRoute,
              private servicesApi: ApiLaravelService,
              public toastController: ToastController,
              private imageCompress: NgxImageCompressService,
              private router: Router,
              private sanitizer: DomSanitizer,
              public loadingController: LoadingController) {}


  ionViewWillEnter(){

    //GetImage global promocional
    this.servicesApi.getImageAward('steps').subscribe( resp => {
      console.log(resp)
      // this.imagePath = resp['imagePath'];
      this.videoPath = this.sanitizer.bypassSecurityTrustResourceUrl(resp['videoPath']);
    });

    this.checkedTerms = false;
    //  trae la variable token de la url
    // debugger;
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token){
      // JEspinosa Valida que el token del referido exista
      this.servicesApi.referUser(this.token)
      .subscribe( resp => {
        // tslint:disable-next-line:no-string-literal
        if (resp['message'] === 'invalidUser'){
          this.validUser = false;
          this.router.navigateByUrl('/login');
        }else{
          // tslint:disable-next-line:no-string-literal
          this.referUser = resp['user'];
          this.validUser = true;
        }
      });
    }
    // console.log(this.token);
    this.servicesApi.getStates().subscribe(states => {
      this.states = states;
    });
  }


  // JEspinosa Hace el post del referido
  async register( formulario: NgForm ) {

    // debugger;
    if (!formulario.valid){
      // console.log(formulario);
      this.validForm(formulario);
      return;
    }

    this.passConfirm = this.validPassword();
    if (this.passConfirm){
      return;
    }

    if (!this.checkedTerms){
      this.presentToast('Debes aceptar terminos y conciones para poder registrarte.');
      return;
    }

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
    let userId: any;

    this.loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Validando información...'
    });
    await this.loading.present();


    if (this.imageResultRefer){
      if (this.imageCompress.byteCount(this.imgSourceProfileRefer)){
        // tslint:disable-next-line:prefer-const
        let image = this.imgSourceProfileRefer;
        // tslint:disable-next-line:prefer-const
        let orientation = -1;
        await this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => {
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
              this.imgSourceProfileRefer = result;
          }
        );
        console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      }
    }

    // this.servicesApi.postInsertUser(correo, pass, nombre, ciudad, zip, street, suburb, city, state, telefono, birthdate, nickName, this.imageResultRefer, this.extensionProfileRefer, this.usuario.state).subscribe( resp => {
      this.servicesApi.postInsertUser(correo, pass, nombre, telefono, birthdate, nickName, this.imageResultRefer, this.extensionProfileRefer).subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      if (resp['message']){
        // tslint:disable-next-line:no-string-literal
        // console.log(resp['message']);
        document.getElementById('itemEmailRefer').classList.add('ion-invalid');
        document.getElementById('itemEmailRefer').classList.add('ion-touched');
        // tslint:disable-next-line:no-string-literal
        this.servicesApi.presentAlertConfirm(resp['message']);
        this.loading.dismiss();
        return;
      }
      // tslint:disable-next-line:no-debugger
      // tslint:disable-next-line:no-string-literal
      userId = resp['user']['id'];
      // debugger;
      if (this.referUser){
        // tslint:disable-next-line:no-string-literal
        const referUser = this.referUser['id'];
        this.servicesApi.postInsertRefer(userId, referUser).subscribe( val => {
          // console.log(val);
          // debugger;
          this.servicesApi.guardarUser( resp );
          return;
        });
      }
      this.servicesApi.guardarUser( resp );
      this.loading.dismiss();
    });

  }

  async changeImageProfileRegister($event: Event) {
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
      this.extensionProfileRefer = $event.target['files'][0]['name'].split('.').pop();
      // tslint:disable-next-line:no-string-literal
      this.imgSourceProfileRefer = (await this.toBase64($event.target['files'][0]));
      // tslint:disable-next-line:no-string-literal
      this.imageResultRefer = (await this.toBase64($event.target['files'][0]));
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

  confirmPassWord(){
    this.passConfirm = this.validPassword();
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  // JEspinosa Valida las reglas del password
  validPassword(): boolean {

    // let validPass = false;
    if (this.usuario.password !== this.usuario.passwordConfirm){
      document.getElementById('itemPasswordRefer').classList.add('ion-invalid');
      document.getElementById('itemPasswordConfirmRefer').classList.add('ion-invalid');
      document.getElementById('itemPasswordRefer').classList.add('ion-touched');
      document.getElementById('itemPasswordConfirmRefer').classList.add('ion-touched');
      this.usuario.passwordConfirm = '';
      return true;
    }else{
      document.getElementById('itemPasswordRefer').classList.remove('ion-invalid');
      document.getElementById('itemPasswordConfirmRefer').classList.remove('ion-invalid');
      document.getElementById('itemPasswordRefer').classList.remove('ion-touched');
      document.getElementById('itemPasswordConfirmRefer').classList.remove('ion-touchedd');

      return false;
    }
  }

  addValue(e) {
    // debugger;
    this.checkedTerms = e.detail.checked;
    // this.checkedTerms = !this.checkedTerms;
  }

  //  JEspinosa Valida las reglas del fromulario
  validForm(formulario: NgForm){
    // debugger;
    if ( !formulario.valid ){
      this.presentToast('Favor de llenar los campos requeridos');
      if (!formulario.controls.email.valid){
        document.getElementById('itemEmailRefer').classList.add('ion-invalid');
        document.getElementById('itemEmailRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemEmailRefer').classList.remove('ion-invalid');
        document.getElementById('itemEmailRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.name.valid){
        document.getElementById('itemNameRefer').classList.add('ion-invalid');
        document.getElementById('itemNameRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemNameRefer').classList.remove('ion-invalid');
        document.getElementById('itemNameRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.telefono.valid){
        document.getElementById('itemTelefonoRefer').classList.add('ion-invalid');
        document.getElementById('itemTelefonoRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemTelefonoRefer').classList.remove('ion-invalid');
        document.getElementById('itemTelefonoRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.ciudad.valid){
        document.getElementById('itemCiudadRefer').classList.add('ion-invalid');
        document.getElementById('itemCiudadRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemCiudadRefer').classList.remove('ion-invalid');
        document.getElementById('itemCiudadRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.zip.valid){
        document.getElementById('itemZipRefer').classList.add('ion-invalid');
        document.getElementById('itemZipRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemZipRefer').classList.remove('ion-invalid');
        document.getElementById('itemZipRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.street.valid){
        document.getElementById('itemStreet').classList.add('ion-invalid');
        document.getElementById('itemStreet').classList.add('ion-touched');
      }else{
        document.getElementById('itemStreet').classList.remove('ion-invalid');
        document.getElementById('itemStreet').classList.remove('ion-touched');
      }

      if (!formulario.controls.suburb.valid){
        document.getElementById('itemSuburb').classList.add('ion-invalid');
        document.getElementById('itemSuburb').classList.add('ion-touched');
      }else{
        document.getElementById('itemSuburb').classList.remove('ion-invalid');
        document.getElementById('itemSuburb').classList.remove('ion-touched');
      }

      if (!formulario.controls.city.valid){
        document.getElementById('itemCity').classList.add('ion-invalid');
        document.getElementById('itemCity').classList.add('ion-touched');
      }else{
        document.getElementById('itemCity').classList.remove('ion-invalid');
        document.getElementById('itemCity').classList.remove('ion-touched');
      }

      if (!formulario.controls.state.valid){
        document.getElementById('itemState').classList.add('ion-invalid');
        document.getElementById('itemState').classList.add('ion-touched');
      }else{
        document.getElementById('itemState').classList.remove('ion-invalid');
        document.getElementById('itemState').classList.remove('ion-touched');
      }

      if (!formulario.controls.birthdate.valid){
        document.getElementById('itemBirthdateRefer').classList.add('ion-invalid');
        document.getElementById('itemBirthdateRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemBirthdateRefer').classList.remove('ion-invalid');
        document.getElementById('itemBirthdateRefer').classList.remove('ion-touched');
      }

      if (!formulario.controls.nickName.valid){
        document.getElementById('itemNickNameRefer').classList.add('ion-invalid');
        document.getElementById('itemNickNameRefer').classList.add('ion-touched');
      }else{
        document.getElementById('itemNickNameRefer').classList.remove('ion-invalid');
        document.getElementById('itemNickNameRefer').classList.remove('ion-touched');
      }

      // debugger;
      const validPass = this.validPassword();
      if (!validPass){
        if (!formulario.controls.password.valid){
          document.getElementById('itemPasswordRefer').classList.add('ion-invalid');
          document.getElementById('itemPasswordRefer').classList.add('ion-touched');
        }else{
          document.getElementById('itemPasswordRefer').classList.remove('ion-invalid');
          document.getElementById('itemPasswordRefer').classList.remove('ion-touched');
        }

        if (!formulario.controls.passwordConfirm.valid){
          document.getElementById('itemPasswordConfirmRefer').classList.add('ion-invalid');
          document.getElementById('itemPasswordConfirmRefer').classList.add('ion-touched');
        }else{
          document.getElementById('itemPasswordConfirmRefer').classList.remove('ion-invalid');
          document.getElementById('itemPasswordConfirmRefer').classList.remove('ion-touched');
        }
      }

    }


  }

  async presentToast(messa: string) {
    const toast = await this.toastController.create({
      message: messa,
      duration: 2000,
      color: 'danger',
      position: 'top',
    });
    toast.present();
  }

  // Función para que el nickName no tenga espacios
  cleanUnnecessaryWhiteSpaces(){
    let nickName: string  = this.usuario.nickName;
    // tslint:disable-next-line:quotemarks
    this.usuario.nickName = nickName.split(" ").join("");
    // this.usuario.nickName = nickName.replaceAll(" ", "");
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
