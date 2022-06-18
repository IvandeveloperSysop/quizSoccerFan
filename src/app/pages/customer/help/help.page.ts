
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ApiLaravelService } from 'src/app/services/api-laravel.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  loading: any;
  constructor(private loadingController: LoadingController,
              private router: Router,
              private servicesApi: ApiLaravelService) { }

  ngOnInit() {
  }

  async logout() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cerrando sesión...'
    });
    await this.loading.present();
    this.servicesApi.logout();
    this.loading.dismiss();
  }

  openPDF(){
    window.open('https://ciel.sysop.info/AVISO_DE_PRIVACIDAD.pdf');
  }
}
