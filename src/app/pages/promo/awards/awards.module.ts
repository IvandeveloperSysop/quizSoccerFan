import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AwardsPageRoutingModule } from './awards-routing.module';

import { AwardsPage } from './awards.page';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from 'src/app/pipes/pipesModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    AwardsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AwardsPage]
})
export class AwardsPageModule {}
