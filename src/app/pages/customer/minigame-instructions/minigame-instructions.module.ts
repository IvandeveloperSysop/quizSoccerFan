import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinigameInstructionsPageRoutingModule } from './minigame-instructions-routing.module';

import { MinigameInstructionsPage } from './minigame-instructions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinigameInstructionsPageRoutingModule
  ],
  declarations: [MinigameInstructionsPage]
})
export class MinigameInstructionsPageModule {}
