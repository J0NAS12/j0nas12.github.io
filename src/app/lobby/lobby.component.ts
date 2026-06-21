import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/websocketservice';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TicTacToeComponent } from '../games/tic-tac-toe/tic-tac-toe.component';
import { PlayingCardsComponent } from '../games/playing-cards/playing-cards.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { TorpedoComponent } from '../games/torpedo/torpedo.component';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    TicTacToeComponent,
    MatButton,
    MatCard,
    CommonModule,
    MatCardModule,
    PlayingCardsComponent,
    MatSliderModule,
    MatInputModule,
    FormsModule,
    TorpedoComponent,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css',
})
export class LobbyComponent {
  getKeys(o: any) {
    console.log(o);
    if (o == undefined) {
      return [];
    }
    return Object.keys(o);
  }
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
      if (lobby.gameState.winner != null) {
        alert(
          'Game over! Winner: ' +
            lobby.gameState.players[lobby.gameState.winner].name,
        );
      }
    });
    this.wss.emit('lobby');
  }

  play(game: string) {
    this.lobby.games[game];
    let config: any = {};
    this.getKeys(this.lobby.games[game]).forEach((key: any) => {
      config[key] = this.lobby.games[game][key].default;
    });
    console.log('play', game, config);
    this.wss.emit('game', {
      game: game,
      config: config,
    });
  }

  gameEvent(event: any) {
    console.log(event);
    this.wss.emit('game', event);
  }
}
