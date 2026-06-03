import { Component, ElementRef, ViewChild } from "@angular/core";
import { WebSocketService } from "../../services/websocketservice";
import { BehaviorSubject } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.css",
})
export class MenuComponent {
  title = "homepage";
  message = "";
  username = "";

  @ViewChild("rendererCanvas") canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;

  private messagesSubject = new BehaviorSubject<any[]>([]);

  messages$ = this.messagesSubject.asObservable();

  lobby_name = "";

  lobbies: any = {};

  counter = 0;

  messages: any[] = [];

  hasLobby = false;
  activeLobby: any = null;

  connected = false;

  constructor(
    protected wss: WebSocketService,
    private router: Router,
  ) {
    this.wss.connect();

    this.wss.listen<any>("messages").subscribe((messages) => {
      this.messages = messages;
      console.log(messages);
    });

    this.wss.listen<any>("lobbies").subscribe((lobbies) => {
      this.lobbies = lobbies;
      this.activeLobby = this.checkActiveLobby(this.lobbies);
    });

    this.wss.listen<any>("name").subscribe((name) => {
      console.log("name", name);
      this.wss.username = name;
      this.connected = true;
    });

    this.wss.listen<any>("start_lobby").subscribe((lobby) => {
      this.router.navigate(["/lobby"]);
    });
  }

  connect() {
    this.wss.emit("name", this.username);
  }

  sendMessage() {
    this.wss.emit("message", {
      text: this.message,
    });
    this.message = "";
  }

  getkeys(o: any) {
    return Object.keys(o);
  }
  createLobby() {
    if (this.lobby_name.length < 3) {
      console.error("Short name.");
      return;
    }
    this.activeLobby = this.lobby_name;
    this.wss.emit("create_lobby", {
      name: this.lobby_name,
    });
  }

  joinLobby(lobby: string) {
    this.activeLobby = this.lobby_name;
    this.wss.emit("join_lobby", lobby);
  }

  startLobby(lobby: string) {
    this.wss.emit("start_lobby", lobby);
  }

  leaveLobby(lobby: string) {
    this.wss.emit("leave_lobby", lobby);
  }

  checkActiveLobby(lobbies: any): string | null {
    return (
      this.getkeys(lobbies).find((element) =>
        lobbies[element].members.some((x: any) => x.id == this.wss.socket.id),
      ) || null
    );
  }
  count() {
    this.counter += 1;
  }
}
