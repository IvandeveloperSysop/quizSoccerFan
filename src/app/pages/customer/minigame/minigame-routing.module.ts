import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinigamePage } from './minigame.page';

const routes: Routes = [
  {
    path: '',
    component: MinigamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinigamePageRoutingModule {}
