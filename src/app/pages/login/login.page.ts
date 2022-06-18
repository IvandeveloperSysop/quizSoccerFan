import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiLaravelService } from '../../services/api-laravel.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialUser, SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AlertController } from '@ionic/angular';
//import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // tslint:disable-next-line:no-inferrable-types
  email: string = '';
  // tslint:disable-next-line:no-inferrable-types
  password: string = '';
  valid = false;
  user: SocialUser;
  image: any;
  loggedIn: boolean;
  url: any;
  imageGoogle;
  emailReset;
  loading: any;
  showGoogleButton = true;


    constructor(    private servicesApi: ApiLaravelService,
                    public toastController: ToastController,
                    public authService: SocialAuthService,
                    public loadingController: LoadingController,
                    public alertController: AlertController,
                    public router: Router) { }

    ngOnInit() {
        this.initializeGoogleLogIn();
    }

    refreshToken(): void {
        this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }


    callLoginButton(response) {
        let token = response.credential;
        let responsePayload = JSON.parse(window.atob(token.split('.')[1]));
        this.user = {
            provider: 'GOOGLE',
            id: responsePayload.sub,
            email: responsePayload.email,
            name: responsePayload.name,
            photoUrl: responsePayload.picture,
            firstName: responsePayload.given_name,
            lastName: responsePayload.family_name,
            authToken: token,
            idToken: token,
            authorizationCode: token,
            response: responsePayload
        }

        const res = responsePayload.picture.split('/').join('$');
        this.image = res.replace('https:', '' ).replace('=' , '*').replace('?' , 'questionFa');

        // console.log(this.user)
        this.validExistsUserSocial()

    }

    initializeGoogleLogIn() {
        new Promise((resolve, reject) => {
          try {
            (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement('script');
              js.id = id;
              js.async = true;
              js.src = `https://accounts.google.com/gsi/client`;
              js.onload = ()=>{
                (<any>window)['google'].accounts.id.initialize({
                  client_id: '465505119871-k0pf2tmvro57gk3lc0a3q7pkqv50vaar.apps.googleusercontent.com',
                  callback: (response) => { resolve(response); }
                });
                (<any>window)['google'].accounts.id.renderButton(
                  document.getElementById("buttonDiv"),
                  { /*theme: "filled_black",*/ size: "large", shape: "pill" }  // customization attributes
                );
              };
              fjs?.parentNode?.insertBefore(js, fjs);
              }(document, 'script', 'google-jssdk'));
          } catch (err) {
            reject(err);
          }
        }).then((payload) => {
            this.callLoginButton(payload);
        }).catch((err) => console.log(err) );
    }

    // JEspinosa Hace el submit del login para el inció de sesion
    async login( formulario: NgForm ){

        if (!formulario.valid){
            this.validForm(formulario);
            return;
        }

        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Validando información...'
        });
        await this.loading.present();

        // JEspinosa Ejecuta el metodo post del API para validar las credenciales
        this.servicesApi.postUsersLogin(this.email, this.password).subscribe(resp => {
            // JEspinosa si el api regresa un menssage significa muestra el mensaje de las credenciales incorrectas
            // tslint:disable-next-line:no-string-literal
            if (resp['message']){
                if (resp['message'] === 'userInactive'){
                    this.presentToast('Usuario Inactivo');
                    this.loading.dismiss();
                    return;
                }
                document.getElementById('itemEmail').classList.add('ion-invalid');
                document.getElementById('itemEmail').classList.add('ion-touched');
                document.getElementById('itemPass').classList.add('ion-invalid');
                document.getElementById('itemPass').classList.add('ion-touched');
                // console.log(resp);
            }
            // JEspinosa guarda la info en el storage si las credenciales correctas o muestra el toast del error
            this.servicesApi.guardarUser( resp );
            this.loading.dismiss();
            return;
        });

    }

    // Guarda la info en el local Storage
    loginSocial(){
        this.servicesApi.postUsersLoginSocial(this.user.email, this.user.provider, this.user.id, this.image).subscribe(resp => {
            // console.log(resp);
            // debugger;
            if (resp['message']){
                if(resp['message'] === 'userInactive'){
                    this.presentToast('Usuario Inactivo');
                    this.loading.dismiss();
                    return;
                }
            }
            this.servicesApi.guardarUser( resp );
        });
    }

    // JEspinosa valida que se cumplan las reglas del formulario
    validForm(formulario: NgForm){

        let result = true;
        if ( !formulario.valid ){

            this.presentToast('Favor de llenar los campos requeridos');

            if (!formulario.controls.email.valid){
                document.getElementById('itemEmail').classList.add('ion-invalid');
                document.getElementById('itemEmail').classList.add('ion-touched');
                result = false;
            }else{
                document.getElementById('itemEmail').classList.remove('ion-invalid');
                document.getElementById('itemEmail').classList.remove('ion-touched');
            }
            // debugger;
            if (!formulario.controls.password.valid){
                document.getElementById('itemPass').classList.add('ion-invalid');
                document.getElementById('itemPass').classList.add('ion-touched');
                result = false;
            }else{
                document.getElementById('itemPass').classList.remove('ion-invalid');
                document.getElementById('itemPass').classList.remove('ion-touched');
            }
        }
        return result;

    }

    // login con facebook
    signInWithFB(): void {
        // debugger;
        // Obtiene la informació de las credenciales de facebook
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user => {
            this.user = user;
            const res = this.user.photoUrl.split('/').join('$');
            this.image = res.replace('https:', '' ).replace('=' , '*').replace('?' , 'questionFa');
            // Valida si el usuario existe para registrar o hacer e login
            this.validExistsUserSocial();
        });

    }

    // Login con Google
    signInWithGoogle(): void {

        // this.refreshToken();
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
            debugger;
            this.user = user;
            // Divide la url de la foto para guardarla en la BD
            const res = this.user.photoUrl.split('/').join('$');
            this.image = res.replace('https:', '' ).replace('=' , '*').replace('?' , 'questionFa');
            this.validExistsUserSocial();
        }).catch(function(err) {
            console.log(err); // It goes here!
        });

    }

    // validaciones para las redes sociales: Valida si el usuario ya existe para entrar a la aplicacion con las credenciales de facebook; sino lo redirige al registro para dar de alta el usuario
    async validExistsUserSocial(){
        this.loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Validando información...'
        });
        await this.loading.present();
        this.servicesApi.validExistsUserSocial(this.user.email, this.user.provider, this.user.authToken).subscribe( resp => {
                // tslint:disable-next-line:no-string-literal
            if (resp['message'] === 'register'){
                const ruta: string = '/registerSocial/' + this.user.name + '/' + this.user.email + '/' + this.user.id + '/' + this.image + '/' + this.user.provider + '/' + this.user.authToken;
                location.replace(ruta);
            // tslint:disable-next-line:no-string-literal
            }else if (resp['message'] === 'login'){
                // Si coincidieron las credenciales del usuario guarda la info en el local storage
                this.loginSocial();
            }else{
                // tslint:disable-next-line:no-string-literal
                this.alertDanger(resp['message']);
                // console.log(resp['message']);
            }
            this.loading.dismiss();
        });
    }

    async presentToast(messa: string) {
        const toast = await this.toastController.create({
            message: messa,
            duration: 2300,
            color: 'medium',
            position: 'top',
        });
        toast.present();
    }

    async noValidToast(messa: string) {
        const toast = await this.toastController.create({
            message: messa,
            color: 'primary',
            position: 'top',
            buttons: [
                {
                    side: 'start',
                    icon: 'warning-outline',
                }, {
                    text: 'Done',
                    role: 'cancel',
                }
            ]
        });
        toast.present();
    }

    // Envia correo para el cambio de contraseña
    async presentAlertPrompt() {
        // debugger;
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Ingresa tu correo para el restablecimiento de contraseña',
            backdropDismiss: false,
            inputs: [
            {
                name: 'emailReset',
                type: 'text',
                id: 'emailReset',
                placeholder: 'Correo'
            }
            ],
            buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'primary',
            }, {
                text: 'Ok',
                handler:  async (alertData) => {

                    this.loading = await this.loadingController.create({
                    cssClass: 'my-custom-class',
                    message: 'Validando correo...'
                    });
                    await this.loading.present();

                    this.emailReset = alertData.emailReset;
                    if (this.emailReset){
                        if (this.validateEmail(this.emailReset)){
                            this.servicesApi.sendEmail(this.emailReset).subscribe(resp => {
                                // tslint:disable-next-line:no-string-literal
                                if (resp['message'] === 'ok'){
                                    this.presentToast('Correo enviado');
                                // tslint:disable-next-line:no-string-literal
                                }else if (resp['message'] === 'nonEmail'){
                                    this.noValidToast('Este correo no se encuentra en el sistema');
                                    // document.getElementById('emailReset').classList.add('errorInput');
                                }else{
                                    console.log(resp);
                                }
                            });
                            this.loading.dismiss();
                            // return false;
                        }else{
                            this.noValidToast('Correo no valido');
                            this.loading.dismiss();
                            return false;
                        }
                    }else{
                        // debugger;
                        this.loading.dismiss();
                        this.noValidToast('Favor de llenar los campos necesarios');
                        // document.getElementById('emailReset').classList.add('errorInput');
                        return false;
                    }
                }
            }
            ]
        });

        await alert.present();
    }

    // Validaciòn para que le campo email sea correcto
    validateEmail(email){
        // tslint:disable-next-line:prefer-const
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    async alertDanger(message) {
        // debugger;
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: message,
            backdropDismiss: false,
            buttons: [
            {
                text: 'Ok',
                role: 'Ok',
                cssClass: 'secondary',
            },
        ]
        });

        await alert.present();
    }

}
