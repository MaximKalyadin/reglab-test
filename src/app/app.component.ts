import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/containers/layout.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, LayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = 'reglab-test';
}
