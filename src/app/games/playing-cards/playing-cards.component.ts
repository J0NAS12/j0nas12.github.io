import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatGridList, MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-playing-cards',
  standalone: true,
  imports: [MatButtonModule, MatGridListModule],
  templateUrl: './playing-cards.component.html',
  styleUrl: './playing-cards.component.css',
})
export class PlayingCardsComponent {
  @Input('gameState') gameState: any;

  @Output() gameEvent = new EventEmitter<any>();
  cardMap: any = {
    C: 'clubs',
    H: 'hearts',
    D: 'diamonds',
    S: 'spades',
    j: 'jack',
    q: 'queen',
    k: 'king',
    a: 'ace',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    0: '0',
  };

  cards = [
    'qH',
    '4S',
    '7D',
    '8C',
    'qH',
    '4S',
    '7D',
    '8C',
    'qH',
    '00',
    '4S',
    '7D',
    '8C',
    'qH',
    '4S',
    '7D',
    '8C',
    'qH',
    '4S',
    '7D',
    '8C',
  ];

  selectedIndex = 1;

  cardToImage(name: string) {
    return (
      'assets/svg-cards/' +
      this.cardMap[name[0]] +
      '_of_' +
      this.cardMap[name[1]] +
      '.svg'
    );
  }
}
