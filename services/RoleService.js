const { Op } = require("sequelize");


class RolesService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
        this.Category = db.Category;
        this.Item = db.Item;
        this.Role = db.Role;
        // this.UserRole = db.UserRole;
        this.OrderItem = db.OrderItem;
    }



    // create role by name
    async createRole(roleName) {
        return this.Role.create(
            {
                name: roleName
            }
        )
    }



    // delete Role
    async deleteRole(roleId) {
        return this.Role.destroy(
            {
                where: {
                    id: roleId
                }
            }
        )
    }

    //GET ALL ROLES
    async getAllRoles() {
        return this.Role.findAll();
    }



    // get role by id
    async getRoleById(roleId) {
        return this.Role.findOne(
            {
                where: {
                    id: roleId
                }
            }
        )
    }





    // get role by name
    async getRoleByName(roleName) {
        return this.Role.findOne(
            {
                where: {
                    name: roleName
                }
            }
        )
    }



    // getUserById
    // async getUserById(userId) {
    //     return this.User.findOne(
    //         {
    //             where: {
    //                 id: userId
    //             }
    //         }
    //     )
    // }

}







//TODO: Creat user service
module.exports = RolesService;