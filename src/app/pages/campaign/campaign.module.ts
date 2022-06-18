import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignPageRoutingModule } from './campaign-routing.module';

import { CampaignPage } from './campaign.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampaignPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CampaignPage]
})
export class CampaignPageModule {}
