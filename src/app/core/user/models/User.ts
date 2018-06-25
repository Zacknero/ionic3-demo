
export class User {
    public id: string;
    public username: string;
    public firstName?: string;
    public lastName?: string;
    public timestamp: number;

    constructor (
        user: Partial<User>
    ){
        if(user.id){
            this.id = user.id;
        }
        if(user.username){
            this.username = user.username;
        }
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.timestamp = user.timestamp || new Date().getTime();
    }

    isLogged(){
        return this.id !== undefined;
    }

    getFullName(){
        return `${this.firstName} ${this.lastName}`;
    }
}
