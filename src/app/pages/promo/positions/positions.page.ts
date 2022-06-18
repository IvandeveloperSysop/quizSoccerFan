import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiLaravelService } from '../../../services/api-laravel.service';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.page.html',
  styleUrls: ['./positions.page.scss'],
})
export class PositionsPage {

  data: any;
  positions: any;
  corteId;
  initialDate;
  endDate;
  numPeriod;
  loading: any;
  valid_period = true;
  constructor(public loadingController: LoadingController, private servicesAppi: ApiLaravelService) { }

  async ionViewWillEnter(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...'
    });
    await this.loading.present();

    this.servicesAppi.getTopList(localStorage.getItem('user.token')).subscribe( resp => {
      // debugger
      console.log(resp);
        // tslint:disable-next-line:no-string-literal
      if (resp['valperiod_id']){
        this.data = resp;
        // tslint:disable-next-line:no-string-literal
        this.positions = resp['users'];
        // tslint:disable-next-line:no-string-literal
        this.corteId = resp['periodId'];
        // tslint:disable-next-line:no-string-literal
        this.initialDate = resp['inicial_date'];
        // tslint:disable-next-line:no-string-literal
        this.endDate = resp['final_date'];
        // tslint:disable-next-line:no-string-literal
        this.numPeriod = resp['numPeriod'];
        // tslint:disable-next-line:no-string-literal
        this.valid_period = resp['valperiod_id'];
      }else{
        // tslint:disable-next-line:no-string-literal
        this.valid_period = resp['valperiod_id'];
      }
      // console.log(this.positions);
      // debugger;
      this.loading.dismiss();
    });
  }

}
