import { FormControl, FormGroup } from '@angular/forms';
import { User } from '@core/data-contracts/models';

export type CreateChannelForm = FormGroup<{
    name: FormControl<string>;
    users: FormControl<User[]>;
}>;
