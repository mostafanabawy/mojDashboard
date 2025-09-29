import { createReducer, on } from "@ngrx/store";
import { loginSuccess, logout } from "./auth.actions";


export interface AuthState {
    user: null | {
        userID: number | null;
        fullName: string | null;
        email: string | null;
        passwordHash: string | null;
        role: "Manager" | "Viewer" | "Secretary" | null;
        isActive: boolean;
        departmentId: number | null;
        departmentName: string | null;
    };
    token: string | null;
};

export const initialState: AuthState = {
    user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')!) : null,
    token: sessionStorage.getItem('token')
}

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state,
        { user, token }) => ({
            ...state,
            user,
            token
        })
    ),
    on(logout,
        () => ({
            user: null,
            token: null
        })
    )
)