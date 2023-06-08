const { Op, sequelize } = require("sequelize");
const bcrypt = require('bcrypt');

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
    async createUser(FirstName, LastName, Username, Email, password, RoleId) {
        // check if user with same username Exist
        const user = await this.User.findOne({ where: { username: Username } });
        if (user) {
            throw new Error('User with a given username already exist');
        }

        // check if email is used by 4 people
        const emailCount = await this.User.count({
            where: {
                email: Email
            }
        })

        // already have 4 users with the same emial
        if (emailCount > 4) {
            throw new Error('Email cannot be used by more than 4 users');
        }

        // // check if user with same email Exist
        // const useremail = await this.User.findOne({ where: { email: Email } });
        // if (useremail) {
        //     throw new Error('User with a given email already exist');
        // }

        
        // check if role with same roleId Exist
        const role = await this.Role.findOne({ where: { id: RoleId } });
        if (!role) {
            throw new Error('Role with a given roleId not found');
        }
        // check if the role is admin. return error
        if (role.name === 'Admin') {
            throw new Error(`Only admin can have ${role.name}  role`);
        }


        // // check how many user have the same email address
        // const emailCount = await this.User.count({
        //     where: {
        //         email: Email
        //     }
        // })
        // // If 2 users have the same email address, both will get a 10% discount on orders.
        // if (emailCount === 2) {
        //     const discount = 10;
        // }

        // await sequelize.transaction
        const t = await this.client.transaction();
        try {
            const santRount = 10;
            const EncryptedPassword = await bcrypt.hash(password, santRount);

            const newUser = await this.User.create({
                firstName: FirstName,
                lastName: LastName,
                username: Username,
                email: Email,
                encryptedPassword: EncryptedPassword,
                roleId: RoleId
            }, {
                transaction: t
            });

            await t.commit();

            return newUser;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }




    // CHECK IF EMAIL and returun email attribute
    async checktUserByEmail(Email) {
        return this.User.findOne(
            {
                where: {
                    email: Email
                }
                ,
                attributes: ['email']
            }
        )
    }

    // get by email and return encryptedPassword
    async userByEmail(Email) {
        const userHashpassword = this.User.findAll(
            {
                where: {
                    email: Email
                }
                , attributes: ['encryptedPassword']
            }
        )
        return userHashpassword.encryptedPassword
    }



    async getUserByEmail(Email) {
        return this.User.findAll(
            {
                where: {
                    email: Email
                }
                // ,  attributes: ['email', 'salt', 'encryptedPassword']
            }
        )
    }

    // CHECK IF and CHECK ROLE ID EXIST
    async getUserRoleId(roleId) {
        return this.User.findAll({
            where: {
                roleId
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




    // update user updateUser
    async updateUser(UserId, Username, Email, Salt, EncryptedPassword) {
        return this.User.update(
            {
                esername: Username,
                email: Email,
                // salt: Salt,
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



    async getOne(Email) {
        return this.User.findOne({
            where: { email: Email }
        })
    }



    // DisplayAllUser
    async DisplayAllUser() {
        return this.User.findAll(
            {
                attributes: ['id', 'username', 'email'],
                include: {
                    model: this.Role,
                    attributes: ['id', 'name']
                }
            }
        )
    }




}
//TODO: Creat user service
module.exports = UserService;





