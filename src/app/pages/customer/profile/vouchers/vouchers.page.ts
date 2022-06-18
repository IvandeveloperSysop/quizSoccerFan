import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, IonInfiniteScroll } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage {

  vouchers: any;
  data: any;
  paginate: any;
  lastPage: number;
  count: number = 0;
  showTickets;
  loading: any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor( private servicesApi: ApiLaravelService, public loadingController: LoadingController ) { }

  async ionViewWillEnter(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });
    await this.loading.present();
    this.servicesApi.getVouchers(localStorage.getItem('user.token')).subscribe( resp => {
      console.log(resp);
      this.data = resp['vouchers'];

      if (this.data['data'].length > 0){
        this.vouchers = resp['data'];
        this.paginate = this.data['from'];
        this.lastPage = this.data['last_page'];
        for (const key of this.vouchers ) {
          this.count = this.count +  1;
        }
        this.showTickets = true;
      }else{
        this.showTickets = false;
      }
      this.loading.dismiss();
      // console.log(this.tickets);
    });
  }

  loadData(event) {
    setTimeout(() => {
      this.paginate = this.paginate + 1;
      this.servicesApi.getVouchersPaginate(localStorage.getItem('user.token'), this.paginate).subscribe( resp => {
        console.log(resp)
        for (const voucher of resp['data']){
          this.vouchers.push(voucher);
        }
        if (this.paginate === this.lastPage) {
          event.target.disabled = true;
        }
      });
      event.target.complete();
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }


}
