import { Component, OnInit } from '@angular/core';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage {

  transactions: any;
  balance: any;

  constructor( private servicesApi : ApiLaravelService ) {
  }

  ionViewWillEnter(){

    let userToken = localStorage.getItem('user.token');

    this.servicesApi.getHistoryBalance(userToken).subscribe( resp => {
      this.transactions = resp['transactions']
      this.balance = resp['balance']['balance'];
      console.log(this.balance);
    });
  }

}
