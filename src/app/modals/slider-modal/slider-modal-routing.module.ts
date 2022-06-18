import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SliderModalPage } from './slider-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SliderModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SliderModalPageRoutingModule {}
