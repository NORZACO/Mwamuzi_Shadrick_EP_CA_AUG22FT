const { Op, sequelize } = require("sequelize");


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

    // INSERT INTO `stocksalesdb`.`users` (`id`, `username`, `email`, `encryptedPassword`, `salt`, `roleId`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL);
    async createUser(Username, Email, Salt, EncryptedPassword, RoleId) {
        return this.User.create(
            {
                username: Username,
                email: Email,
                salt: Salt,
                encryptedPassword: EncryptedPassword,
                roleId: RoleId
            }
        )
    }

    // CHECK IF EMAIL EXIST
    async getUserByEmail(Email) {
        return this.User.findAll(
            {
                where: {
                    email: Email
                }
            }

        )
    }




    // CHECK IF and CHECK ROLE ID EXIST
    async getUserRoleId(roleId) {
        return this.User.findAll({
            where: {
                roleId: roleId
            }
        })
    }



    // https://stackoverflow.com/questions/68115880/get-specific-attributes-from-database-using-sequelize-model-query
    async getAllUsers() {
        return this.User.findAll({
            attributes: ['id', 'username', 'email'],
            include: {
                model: this.Role,
                // attributes: ['id', 'name']
                // through: {
                //     attributes: [`RoleId`]
                // },
            }
        })
    }




    async getUserById(userId) {
        return await this.User.findOne({
            where: { id: userId },
            // attributes
            attributes: [['id', 'userid'], 'username', 'email']
        });
    }




    // async getUserByName(username) {
    //     return await this.User.findOne({
    //         where: { username: username },
    //         include: {
    //             model: this.CartItem,
    //             through: {
    //                 attributes: ['quantity']
    //             },
    //             include: {
    //                 model: this.CartItem
    //             }
    //         }
    //     });
    // }

    // async deleteUser(userId) {
    //     return this.User.destroy({
    //         where: { id: userId }
    //     })
    // }


    // update user updateUser
    async updateUser(UserId, Username, Email, Salt, EncryptedPassword) {
        return this.User.update(
            {
                esername: Username,
                email: Email,
                salt: Salt,
                encryptedPassword: EncryptedPassword
            },
            {
                where: { id: UserId }
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
    // async removeRole(userId, roleId) {
    //     return this.UserRole.destroy(
    //         {
    //             where: {
    //                 UserId: userId,
    //                 RoleId: roleId
    //             }
    //         }
    //     )
    // }



    // get user by email getUserByEmail
    async getUserByEmail(Email) {
        return this.User.findAll(
            {
                where: {
                    email: Email
                },
                include: {
                    model: this.Role,

                }
            }

        )
    }


    async getOne(Email) {
        return this.User.findOne({
            where: {email: Email}
        })
    }

}

//TODO: Creat user service
module.exports = UserService;





