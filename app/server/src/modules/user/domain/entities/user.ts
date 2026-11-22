interface UserProps {
    id: string;
    username: string;
    password: string
}

export interface UserDTO {
    userId: string
    username: string
}

export class User {
    constructor(private readonly props: UserProps) { }

    get id() {
        return this.props.id;
    }

    get username() {
        return this.props.username;
    }

    get password() {
        return this.props.password
    }
}
