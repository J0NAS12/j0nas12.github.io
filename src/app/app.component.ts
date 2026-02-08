import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "homepage";

  @ViewChild("rendererCanvas") canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;

  // State variables
  private x = 95;
  private velocity = 3;
  private radius = 40;
  constructor() {}

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(95, 50, 40, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "blue";
      ctx.stroke();
    }

    let animate = () => {
      const canvas = this.canvasRef.nativeElement;

      // Clear, Draw, and Update Logic
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.ctx.beginPath();
      this.ctx.arc(this.x, 50, this.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.lineWidth = 4;
      this.ctx.strokeStyle = "blue";
      this.ctx.stroke();

      this.x += this.velocity;

      // Bounce logic
      if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.velocity *= -1;
      }

      this.animationId = requestAnimationFrame(animate);
    };
  }
}
