import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage {

  tickets: any;
  data: any;
  paginate: any;
  lastPage: number;
  count: number = 0;
  showTickets;
  loading: any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor( private servicesApi: ApiLaravelService, public loadingController: LoadingController) {}


  async ionViewWillEnter(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });
    await this.loading.present();
    this.servicesApi.getTickets(localStorage.getItem('user.token')).subscribe( resp => {
      console.log(resp);
      this.data = resp['tickets'];
      // console.log(this.data);
      // tslint:disable-next-line:no-string-literal
      if (this.data['data'].length > 0){
        // tslint:disable-next-line:no-string-literal
        this.tickets = resp['data'];
        // tslint:disable-next-line:no-string-literal
        this.paginate = this.data['from'];
        // tslint:disable-next-line:no-string-literal
        this.lastPage = this.data['last_page'];
        // debugger;
        // if (this.data['extrapoints']){
        //   // tslint:disable-next-line:no-string-literal
        //   this.extraPoints = this.data['extrapoints'];
        // }
        for (const key of this.tickets ) {
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
      this.servicesApi.getTicketsPaginate(localStorage.getItem('user.token'), this.paginate).subscribe( resp => {
        // tslint:disable-next-line:no-string-literal
        for (const ticket of resp['data']){
          // tslint:disable-next-line:no-string-literal
          this.tickets.push(ticket);
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
