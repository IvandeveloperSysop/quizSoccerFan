import { Component, OnInit } from '@angular/core';
import { ApiLaravelService } from '../../../../services/api-laravel.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  data: any;
  positions: any;
  token;
  item = [];
  showFriends;

  constructor(private servicesApi: ApiLaravelService) { }

  ionViewWillEnter(){

    this.range1(13);
    this.token = localStorage.getItem('user.nickName');
    // tslint:disable-next-line:no-debugger
    this.servicesApi.referUserFriends(this.token).subscribe( friends => {
      console.log(friends);
      // debugger;
      // tslint:disable-next-line:no-string-literal
      if (friends['refers'].length > 0){
        // tslint:disable-next-line:no-string-literal
        this.data = friends['refers'];
        this.showFriends = true;
      }else{
        this.data = [];
        this.showFriends = false;
      }

    });
  }

  range1( i ){
    let x = 0;
    while ( x < i){
      this.item.push(x++);
    }
    // return item;
  }

  ngOnInit() {
  }

}
