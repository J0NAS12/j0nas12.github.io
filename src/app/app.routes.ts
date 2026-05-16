import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
  },
  {
    path: 'lobby',
    component: LobbyComponent,
  },
  {
    path: '*',
    component: LobbyComponent,
  },
];
