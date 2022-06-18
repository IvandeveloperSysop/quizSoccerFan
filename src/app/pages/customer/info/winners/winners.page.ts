import { ApiLaravelService } from 'src/app/services/api-laravel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.page.html',
  styleUrls: ['./winners.page.scss'],
})
export class WinnersPage {

  @ViewChild(IonSegment) segment: IonSegment;
  periods;
  winners;
  loading: any;
  validWinners = false;
  constructor( private servicesApi: ApiLaravelService, public loadingController: LoadingController) {
  }

  ionViewWillEnter(){

    this.servicesApi.getAllPeriods().subscribe( periods => {
      // console.log(periods);
      this.periods = periods;
      // tslint:disable-next-line:no-string-literal
      this.segment.value = this.periods[0]['id'];
      // tslint:disable-next-line:no-string-literal
      // this.getWinners(this.periods[0]['id']);
    });
  }

  async getWinners(period){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });

    await this.loading.present();

    this.servicesApi.getWinnersPeriods(period).subscribe( winners => {
      console.log(winners);
      this.winners = winners;
      // debugger;
      if (this.winners[0]){
        this.validWinners = true;
      }else{
        this.validWinners = false;
      }
      this.loading.dismiss();
    });

  }


  segmentChanged(ev: any) {
    // tslint:disable-next-line:no-string-literal
    this.getWinners(ev.detail['value']);
  }

}
