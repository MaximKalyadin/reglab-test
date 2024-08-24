import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
})
export class LayoutComponent {}
