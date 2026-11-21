export interface IUserCreation {
    username: string;
    email: string;
    hashPassword: string;
}

export class UserCreation {
    #props: IUserCreation
    constructor(props: IUserCreation) {
        this.#props = props
    }

    get username() {
        return this.#props.username
    }

    get email() {
        return this.#props.email
    }

    get hashPassword() {
        return this.#props.hashPassword
    }
}
