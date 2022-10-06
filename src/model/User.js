class User {

    userSchema = {
        name,
        email,
        password,
        isAdmin
    }

    constructor(name, email, password, isAdmin) {
        this.userSchema.name = name;
        this.userSchema.email = email;
        this.userSchema.password = password;
        this.userSchema.isAdmin = isAdmin;
    }

    isAdmin = () => {
        return this.userSchema.isAdmin;
    }

}

module.exports = User;