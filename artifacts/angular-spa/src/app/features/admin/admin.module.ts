import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [SharedModule, ReactiveFormsModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}
