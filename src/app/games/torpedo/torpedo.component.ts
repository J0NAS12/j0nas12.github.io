import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-torpedo',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule],
  templateUrl: './torpedo.component.html',
  styleUrl: './torpedo.component.css',
})
export class TorpedoComponent {
  @Input('gameState') gameState: any;

  @Output() gameEvent = new EventEmitter<any>();
  draggedShip: any = null;
  isHorizontal: any = true;

  rows = 'ABCDEFGHIJ';

  availableShips = [
    { id: 1, length: 5 },
    { id: 2, length: 4 },
    { id: 3, length: 3 },
    { id: 4, length: 3 },
    { id: 5, length: 2 },
  ];

  highlightShip: any = undefined;

  cells = Array(100).fill(null);

  onDragStart(event: DragEvent, ship: any) {
    this.draggedShip = ship;
  }

  onDrop(event: DragEvent) {
    const target = event.target as HTMLElement;
    const index = target.getAttribute('data-index');
    if (!index || !this.draggedShip) return;

    const start = +index;

    this.placeShip(
      start,
      this.draggedShip.length,
      this.draggedShip.id,
      this.isHorizontal,
    );
    this.draggedShip = null;
  }
  placedShips: any[] = [];

  calculateShipPosition(
    start: number,
    length: number,
    id: number,
    isHorizontal: boolean,
  ) {
    const row = Math.floor(start / 10);
    const col = start % 10;

    if (col + length > 10) {
      return undefined;
    }

    let shipPosition = {
      id: id,
      row: row + 2,
      col: col + 2,
      length: length,
      direction: isHorizontal ? 'horizontal' : 'vertical',
    };
    return shipPosition;
  }

  placeShip(start: number, length: number, id: number, isHorizontal: boolean) {
    const shipPositions = this.calculateShipPosition(
      start,
      length,
      id,
      isHorizontal,
    );
    if (!shipPositions) {
      console.log('Invalid ship placement');
      return;
    }

    this.placedShips.push(shipPositions);
    this.availableShips = this.availableShips.filter((ship) => ship.id !== id);
    this.highlightShip = undefined;
    for (let i = 0; i < length; i++) {
      if (isHorizontal) {
        this.cells[start + i] = 2;
      } else {
        this.cells[start + i * 10] = 2;
      }
    }
  }

  onDragOver(event: DragEvent) {
    const target = event.target as HTMLElement;

    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] === 1) {
        this.cells[i] = null; // Reset the highlighted cells
      }
    }

    const index = target.getAttribute('data-index');
    if (!index || !this.draggedShip) {
      this.highlightShip = undefined;
      return;
    }

    const start = +index;
    const shipPositions = this.calculateShipPosition(
      start,
      this.draggedShip.length,
      this.draggedShip.id,
      this.isHorizontal,
    );
    if (!shipPositions) {
      console.log('Invalid ship placement');
      this.highlightShip = undefined;
      return;
    }

    for (let i = 0; i < this.draggedShip.length; i++) {
      if (this.isHorizontal) {
        if (this.cells[start + i] != 2) {
          this.cells[start + i] = 1; // Mark the cells as highlighted for ship placement
        }
      } else {
        if (this.cells[start + i * 10] != 2) {
          this.cells[start + i * 10] = 1; // Mark the cells as highlighted for ship placement
        }
      }
    }
    this.highlightShip = shipPositions;

    event.preventDefault();
    console.log('Drag over cell index:', index);
  }
}
