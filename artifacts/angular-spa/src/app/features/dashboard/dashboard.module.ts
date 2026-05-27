import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, FormsModule, DashboardRoutingModule],
})
export class DashboardModule {}
