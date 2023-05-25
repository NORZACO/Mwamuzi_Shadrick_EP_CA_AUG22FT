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
    // async deleteRole(roleId) {
    //     return this.Role.destroy(
    //         {
    //             where: {
    //                 id: roleId
    //             }
    //         }
    //     )
    // }

    //deletingRole before delete hook
    async deleteRole(roleId) {
        const role = await this.Role.findByPk(roleId);
        if (!role) {
            throw new Error('Role not found');
        }

        // user count
        const userCount = await this.User.count({
            where: {
                roleId: roleId
            }
        })
        if (userCount > 0) {
            throw new Error('Role cannot be deleted because it is used by one or more users');
        }

        return role.destroy();
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


    // UPFATE 
    async updateRole(roleId, roleName) {
        return this.Role.update(
            {
                name: roleName
            },
            {
                where: {
                    id: roleId
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