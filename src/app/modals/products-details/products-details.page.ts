import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';


@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.page.html',
  styleUrls: ['./products-details.page.scss'],
})
export class ProductsDetailsPage {

  wallet = [];
  product = [];
  product_id;
  routeGlobal;
  address = {
    street: '',
    suburb: '',
    city: '',
    state: '',
    zip: '',
  }

  constructor(public modalController: ModalController,
              public servicesApi: ApiLaravelService,
              public toastController: ToastController,
              public route: ActivatedRoute) { }

  ionViewDidEnter(){

    this.product_id = this.route.snapshot.paramMap.get('productId');

    this.servicesApi.getBalanceWallet().subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      this.wallet = resp['balance'];
      console.log(this.wallet);
    });

    this.getProduct();

  }

  getProduct(){
    this.servicesApi.getProductsDetails(this.product_id).subscribe( resp => {
      // console.log(resp)
      // // tslint:disable-next-line:no-string-literal
      this.product = resp['product'];
      this.routeGlobal = resp['routeGlobal'];
    });
  }

  // validación antes de entrar al POST
  async onSubmit(wallet, product) {
    // debugger;
    if (!this.address.street && !this.address.suburb && !this.address.city && !this.address.state && !this.address.zip) {
      this.validPresentToast('Favor de llenar los campos obligatorios');
    }else{
      this.paymentProduct(wallet,product);
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

  paymentProduct(wallet, product){

    this.servicesApi.paymentProduct(wallet, product, this.address).subscribe( resp => {

      // tslint:disable-next-line:no-string-literal
      if (resp['result'] == 'ok') {
        console.log(resp)
        this.product = resp['product'];
        this.wallet = resp['wallet'];
        this.address.state = "";
        this.address.zip = "";
        this.address.city = "";
        this.address.suburb = "";
        this.address.street = "";
        this.messageSuccess();
      } else {
        this.presentToastWithOptions(resp['result']);
      }
      console.log(resp);
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
