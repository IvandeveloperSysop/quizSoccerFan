import { Component, OnInit } from '@angular/core';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage {

  orders: any;
  routeGlobal: any;
  image: any;

  constructor( private servicesApi : ApiLaravelService ) {
  }


  ionViewWillEnter(){

    let userToken = localStorage.getItem('user.token');

    this.servicesApi.getOrdersHistory(userToken).subscribe( resp => {
      // console.log(resp)
      this.orders = resp['orders'];
      this.routeGlobal = resp['routeGlobal'];
      // console.log(this.orders);
    });
  }

}
