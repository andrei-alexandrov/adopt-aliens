class User {
    constructor(user, pass) {
        this.username = user;
        this.pass = pass;
    }
}

class UserManager {
    constructor() {
        let loggedUser = JSON.parse(localStorage.getItem('LoggedUser'));
        if (loggedUser) {
            this.loggedUser = new User(loggedUser.username, loggedUser.pass);
        }

        let storedUsers = JSON.parse(localStorage.getItem('Users'));
        if (storedUsers) {
            this.users = storedUsers.map(user => new User(user.username, user.pass));
        } else {
            this.users = [new User('andrei', '1234567'), new User('1234567', 'andrei')];
        }
    }

    loggedUser = null;
    users = [];

    login = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username && user.pass === pass);
        if (foundUser) {
            this.loggedUser = foundUser;
            localStorage.setItem('LoggedUser', JSON.stringify(this.loggedUser));
            return true;
        }
        return false;
    }

    register = ({ username, pass }) => {
        let foundUser = this.users.find(user => user.username === username);
        if (!foundUser) {
            this.users.push(new User(username, pass));
            localStorage.setItem('Users', JSON.stringify(this.users));
            return true;
        } else {
            alert("Username is already taken.");
            return false;
        }
    }
}

let userManager = new UserManager();
