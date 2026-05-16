import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { WebSocketService } from '../../services/websocketservice';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [MatGridListModule, MatCardModule],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css',
})
export class TicTacToeComponent {
  @Input('gameState') gameState: any;

  @Output() gameEvent = new EventEmitter<any>();

  constructor(private wss: WebSocketService) {}

  selectTile(tile: any) {
    console.log(tile);
    //this.gameState.tiles[tile] = 1;
    this.gameEvent.emit({
      game: 'tic-tac-toe',
      move: tile,
    });
  }

  public turn(): boolean {
    console.log(
      this.gameState.players[this.gameState.nextPlayer].name,
      this.wss.username,
    );
    return (
      this.gameState.players[this.gameState.nextPlayer].name ==
      this.wss.username
    );
  }
}
