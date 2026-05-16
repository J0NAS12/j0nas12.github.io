import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/websocketservice';
import { TicTacToeComponent } from '../tic-tac-toe/tic-tac-toe.component';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [TicTacToeComponent, MatButton, MatCard, CommonModule],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css',
})
export class LobbyComponent {
  lobby: any = { name: 'lobby' };

  constructor(
    protected wss: WebSocketService,
    private router: Router,
  ) {
    this.wss.listen<any>('lobby').subscribe((lobby) => {
      if (lobby == undefined) {
        this.router.navigate(['/']);
      }
      this.lobby = lobby;
    });
    this.wss.listen<any>('game').subscribe((lobby) => {
      console.log(lobby);
      this.lobby = lobby;
    });
    this.wss.emit('lobby');
  }

  play(game: string) {
    this.wss.emit('game', {
      game: game,
      config: {
        size: 20,
        win: 4,
      },
    });
  }

  gameEvent(event: any) {
    console.log(event);
    this.wss.emit('game', event);
  }
}
