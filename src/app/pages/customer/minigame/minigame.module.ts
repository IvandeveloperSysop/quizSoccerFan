import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinigamePageRoutingModule } from './minigame-routing.module';

import { MinigamePage } from './minigame.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinigamePageRoutingModule,
    ComponentsModule
  ],
  declarations: [MinigamePage]
})
export class MinigamePageModule {}
