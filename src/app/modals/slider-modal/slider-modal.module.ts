import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SliderModalPageRoutingModule } from './slider-modal-routing.module';

import { SliderModalPage } from './slider-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SliderModalPageRoutingModule
  ],
  declarations: [SliderModalPage]
})
export class SliderModalPageModule {}
