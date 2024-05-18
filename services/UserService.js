class UserService {
    constructor(db) {
        this.User = db.User;

    }

    async createUser(fullName,username,passport,role) {
        return this.User.create({
            fullName:fullName,
            username:username,
            password:password,
            role:role
            
        })
    }

    async getAll() {
        return this.User.findAll({
            where:{}
        })
    };

    async getUserByUsername(username) {
        try {
          const user = await this.User.findOne({ where: { username: username } });
          return user;
        } catch (error) {
          console.error("Error fetching user by username:", error);
          throw error;
        }
      }

    async getUserById(id) {
        try {
            const user=await this.User.findByPk(id);
            return user;

        } catch (error) {
            console.error("Error while getting user by id", error);
            throw error;
        }
    }


}

module.exports=UserService;
