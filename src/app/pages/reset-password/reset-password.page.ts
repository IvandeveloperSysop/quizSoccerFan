import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  usuario = {
    password: '',
    passwordConfirm: '',
    email:'',
    id:'',
  };
  passConfirm = false;
  tokenUser;
  idUser;
  message;
  tokenResetPass;
  urlInvalid = false;
  inicioButton = false;
  constructor(private route: ActivatedRoute,
    private servicesApi: ApiLaravelService, public toastController: ToastController ) { }

  ngOnInit() {
    this.tokenUser = this.route.snapshot.paramMap.get('tokenUser');
    this.idUser = this.route.snapshot.paramMap.get('idUser');

    // debugger;
    this.servicesApi.validTokenUser(this.idUser, this.tokenUser)
    .subscribe( resp => {
      if (resp['message'] === 'ok'){
        this.urlInvalid = true;
        this.tokenResetPass = resp['tokenResetPass'];
      }else if (resp['message'] === 'dateInvalid'){
        this.message = 'Token expirado favor de solicitar un nuevo token de authorizaciòn';
      }else{
        this.message = 'Url no reconocida favor de solicitad un nuevo link para el cambio de su contraseña';
      }
    });

  }

  // Post para cambiar password
  resetPass(formulario: NgForm){
    if (!formulario.valid){
      const validPass = this.validPassword();

      if (!validPass){
        if (!formulario.controls.password.valid){
          document.getElementById('itemPassword').classList.add('inputInvalid');
        }else{
          document.getElementById('itemPassword').classList.remove('inputInvalid');
        }

        if (!formulario.controls.passwordConfirm.valid){
          document.getElementById('itemPasswordConfirm').classList.add('inputInvalid');
        }else{
          document.getElementById('itemPasswordConfirm').classList.remove('inputInvalid');
        }
      }
      this.presentToast('Favor de llenar los campos requeridos');
    }else{
      this.servicesApi.resetPassword(this.tokenResetPass, this.usuario.password).subscribe(resp => {
        // console.log(resp);
        if(resp['message'] === 'ok'){
          this.successToast('Cambios guardados');
          this.inicioButton = true;
        }else {
          this.message = 'URL inactiva favor de solicitar otro link de activación';
          this.urlInvalid = false;
        }
      });
    }

  }

  async successToast(messa: string) {
    const toast = await this.toastController.create({
      message: messa,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    toast.present();
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

  confirmPassWord(){
    this.passConfirm = this.validPassword();
  }

  validPassword(): boolean {

    // let validPass = false;
    if (this.usuario.password !== this.usuario.passwordConfirm){
      document.getElementById('itemPassword').classList.add('inputInvalid');
      document.getElementById('itemPasswordConfirm').classList.add('inputInvalid');
      this.usuario.passwordConfirm = '';
      return true;
    }else{
      document.getElementById('itemPassword').classList.remove('inputInvalid');
      document.getElementById('itemPasswordConfirm').classList.remove('inputInvalid');

      return false;
    }
  }

}
