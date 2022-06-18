import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage {

  promoId = 1;
  products = [];
  product = [];
  routeGlobal;
  showProducts = false;

  constructor(private servicesApi: ApiLaravelService,
              private modalController: ModalController) { }


  ionViewDidEnter(){
    this.getProducts();
  }
  
  getProducts(){
    // debugger;
    this.servicesApi.getProductsStore(this.promoId).subscribe( resp => {
      // tslint:disable-next-line:no-string-literal
      console.log(resp);
      this.routeGlobal = resp['routeGlobal'];
      if(resp['products'].length > 0){
        this.products = resp['products'];
        this.showProducts = true;
      }
    });

  }

  // async detailsProduct(product) {

  //   this.servicesApi.getProductsDetails(product['id']).subscribe( resp => {
  //     // console.log(resp['product']);
  //     this.product = resp['product'];
  //     this.modalDetails(this.product );
      
  //   });
  // }
  
  // async modalDetails(product){
  //   // console.log(product)
  //   const modal = await this.modalController.create({
  //     component: ProductsDetailsPage,
  //     cssClass: 'my-custom-class',
  //     swipeToClose: true,
  //     componentProps: {
  //       'routeGlobal': this.routeGlobal,
  //       'product': this.product,
  //     }
  //   });
  //   return await modal.present();
  
  // }

}
