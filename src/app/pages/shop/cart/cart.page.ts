import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {

  wallet = [];
  product = [];
  product_id;
  routeGlobal;
  image;
  loading: any;
  address = {
    street: '',
    suburb: '',
    city: '',
    state: '',
    zip: '',
  }

  validExistOrder = false;

  constructor(public modalController: ModalController,
              public servicesApi: ApiLaravelService,
              public toastController: ToastController,
              public route: ActivatedRoute,
              public alertController: AlertController,
              public loadingController: LoadingController) { }

  ionViewDidEnter(){

    this.product_id = this.route.snapshot.paramMap.get('productId');

    this.servicesApi.getBalanceWallet().subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.wallet = resp['balance'];
      this.getAddress(resp['balance']['id']); // traer la dirección del usuario
      // console.log(this.wallet);
    });

    this.getProduct();

  }

  getProduct(){
    this.servicesApi.getProductsDetails(this.product_id).subscribe( resp => {
      console.log(resp)
      this.validExistOrder = resp['validExistOrder']
      // // tslint:disable-next-line:no-string-literal
      this.product = resp['product'];
      this.image = resp['routeGlobal']+this.product['image']
      // this.routeGlobal = resp['routeGlobal'];
    });
  }

  getAddress(user_id){

    this.servicesApi.getAddressUser(user_id).subscribe( resp => {
      console.log(resp);
      this.address.street = resp['street'];
      this.address.suburb = resp['suburb'];
      this.address.city = resp['city'];
      this.address.state = resp['state'];
      this.address.zip = resp['zip'];
    });

  }

  // validación antes de entrar al POST
  async onSubmit(wallet, product) {
    // debugger;
    if (this.address.street && this.address.suburb && this.address.city && this.address.state && this.address.zip) {
      const alert = await this.alertController.create({
        cssClass: 'myalert',
        header: '¡Estás a unos pasos de comprar este producto!',
        message: '<strong>¿Deseas comprar este producto? </strong>',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'buttonsMinigame',
            handler: () => {
            }
          }, {
            text: 'Comprar',
            cssClass: 'buttonsMinigame',
            handler: () => {
              // console.log(idMinigame);
              this.paymentProduct(wallet,product);
            }
          }
        ]
      });
  
      await alert.present();
    }else{
      this.validPresentToast('Favor de llenar los campos obligatorios');
    }

  }

  async validPresentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}` ,
      duration: 2500,
      position: 'top',
      color: 'danger' ,
      buttons: [
        {
          side: 'start',
          icon: 'warning-outline'
        }
      ]
    });
    toast.present();

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async paymentProduct(wallet, product){

    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });

    await this.loading.present();

    this.servicesApi.paymentProduct(wallet, product, this.address).subscribe( resp => {

      // tslint:disable-next-line:no-string-literal
      if (resp['result'] == 'ok') {
        console.log(resp)
        this.product = resp['product'];
        this.wallet = resp['wallet'];
        this.validExistOrder = resp['validExistOrder'];
        this.messageSuccess();
      } else {
        this.presentToastWithOptions(resp['result']);
      }
      console.log(resp);
      this.loading.dismiss();
    });


  }

  async presentToastWithOptions(message) {
    const toast = await this.toastController.create({
      // header: 'Toast header',
      message: message,
      position: 'top',
      color: 'danger',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        }
      ]
    });
    await toast.present();

  }

  async messageSuccess(){
    const toast = await this.toastController.create({
      // header: 'Toast header',
      message: 'Compra realizada',
      position: 'top',
      color: 'success',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        }
      ]
    });
    await toast.present();
  }

}
