import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@core/data-contracts/models';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class ProfileClientService {
    constructor(private readonly http: HttpClient) {}

    changeUserName(user: User, username: string): Observable<User> {
        return this.http.patch<User>(
            `${environment.baseUrl}/users/${user.id}`,
            { username: username },
            {}
        );
    }
}
