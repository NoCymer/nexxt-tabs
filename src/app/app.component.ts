import { Component } from "@angular/core";
import { BackgroundDispenserComponent } from "./modules/backgrounds/components/background-dispenser/background-dispenser.component";

@Component({
  selector: "app-root",
  imports: [BackgroundDispenserComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent { }
