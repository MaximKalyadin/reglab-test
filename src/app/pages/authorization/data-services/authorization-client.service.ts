import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UsersRequest } from '@core/data-contracts/models';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class AuthorizationClientService {
    constructor(private readonly http: HttpClient) {}

    getUser(payload: UsersRequest): Observable<User[]> {
        return this.http.get<User[]>(`${environment.baseUrl}/users`, {
            params: {
                ...payload,
            },
        });
    }
}
