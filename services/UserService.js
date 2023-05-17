const { Op } = require("sequelize");


class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
        this.Category = db.Category;
        this.Item = db.Item;
        this.Role = db.Role;
        this.UserRole = db.UserRole;
        this.OrderItem = db.OrderItem;
    }

    async createUser(Username, Email, Salt, EncryptedPassword) {
        return this.User.create(
            {
                username: Username,
                email: Email,
                salt: Salt,
                encryptedPassword: EncryptedPassword
            }
        )
    }


// https://stackoverflow.com/questions/68115880/get-specific-attributes-from-database-using-sequelize-model-query
    async getAllUsers() {
        return this.User.findAll({
            attributes: ['id', 'username', 'email'],
            include: {
                model: this.Role,
                through: {
                    attributes: [`RoleId`, `UserId`]
                },

            }
        })
    }

    async getOne(userId) {
        return await this.User.findOne({
            where: { id: userId },
            include: {
                model: this.CartItem,
                through: {
                    attributes: ['quantity']
                },
                include: {
                    model: this.Hotel
                }
            }
        });
    }
    async getOneByName(username) {
        return await this.User.findOne({
            where: { username: username },
            include: {
                model: this.CartItem,
                through: {
                    attributes: ['quantity']
                },
                include: {
                    model: this.CartItem
                }
            }
        });
    }

    async deleteUser(userId) {
        return this.User.destroy({
            where: { id: userId }
        })
    }


    // update user updateUser
    async updateUser(userId, username, email, salt, encryptedPassword) {
        return this.User.update(
            {
                Username: username,
                Email: email,
                Salt: salt,
                EncryptedPassword: encryptedPassword
            },
            {
                where: { id: userId }
            }
        )
    }


    // add addRole
    async addRole(userId, roleId) {
        return this.UserRole.create(
            {
                UserId: userId,
                RoleId: roleId
            }
        )
    }


    // remove removeRole
    async removeRole(userId, roleId) {
        return this.UserRole.destroy(
            {
                where: {
                    UserId: userId,
                    RoleId: roleId
                }
            }
        )
    }


    // getRoles
    async getRoles(userId) {
        return this.UserRole.findAll(
            {
                where: {
                    UserId: userId
                }
            }
        )
    }

    // get user by email getUserByEmail
    async getUserByEmail(email) {
        return this.User.findOne(
            {
                where: {
                    email: email
                }
            }
        )
    }





}

//TODO: Creat user service
module.exports = UserService;