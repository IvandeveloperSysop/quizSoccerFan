import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    // this.analyticsService.startTrackerWithId('G-Y3P9KQYY4Z');
    // this.router.events
    // .subscribe(event => {
    //   // observe router and when it start navigation it will track the view
    //   if (event instanceof NavigationStart) {
    //     let title = this.title.getTitle();
    //     // get title if it was sent on state
    //     if (this.router.getCurrentNavigation().extras.state) {
    //       title = this.router.getCurrentNavigation().extras.state.title;
    //     }
    //     // pass url and page title
    //     // this.analyticsService.trackView(event.url, title);
    //   }
    // });

    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });
  }
}
