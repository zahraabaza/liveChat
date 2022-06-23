import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './Components/chat/chat.component';
import { ErrorComponent } from './Components/error/error.component';

const routes: Routes = [
  {path:"", redirectTo:"chat", pathMatch:"full"},
  {path:"chat", component: ChatComponent},
  {path:"**", component:ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
