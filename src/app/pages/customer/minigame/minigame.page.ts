import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiLaravelService } from '../../../services/api-laravel.service';
import { MinigameInstructionsPage } from '../minigame-instructions/minigame-instructions.page';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-minigame',
  templateUrl: './minigame.page.html',
  styleUrls: ['./minigame.page.scss'],
})
export class MinigamePage implements OnInit {

  idMinigame: any;
  miniGame: any;
  idTicket: any;
  images: any;
  url;
  constructor(private route: ActivatedRoute,
    private servicesApi: ApiLaravelService,
    public modalController: ModalController,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.idMinigame = this.route.snapshot.paramMap.get('idMinigame');
    // console.log(this.idMinigame);
    // debugger;
    this.servicesApi.getMiniGame(this.idMinigame)
    .subscribe( resp => {
      console.log(resp);
      // tslint:disable-next-line:no-string-literal
      if (resp['message'] === 'ok'){
      // tslint:disable-next-line:no-string-literal
        this.miniGame = resp['minigame'];
      // tslint:disable-next-line:no-string-literal
        this.idTicket = this.miniGame['id_ticket'];
        // this.url = 'https://api.tabletizate.com/public/simonDice/?id=' + this.idMinigame;
        this.url = 'http://api.guiasde.com/tienda/public/simonDice/?id=' + this.idMinigame;
      }else{
        // location.replace('http://destrezate.mx/#/notfound/');
        location.replace('https://api.tabletizate.com/');
      }

    });
    // console.log(this.idTicket);
  }

  openURL(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: MinigameInstructionsPage
    });
    return await modal.present();
  }

}
