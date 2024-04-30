class UserController {
    constructor(db) {
        this.db = db;
    }

    async getAllUsers(page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;
        return await this.db.collection('users')
            .find()
            .skip(skip)
            .limit(pageSize)
            .sort({ name: sortOrder })
            .toArray();
    }

    async getUserById(userId) {
        return await this.db.collection('users').findOne({ _id: new ObjectId(userId) });
    }

    async createUser(newUser) {
        const result = await this.db.collection('users').insertOne(newUser);
        return result.ops[0];
    }

    async updateUser(userId, updatedUser) {
        return await this.db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });
    }

    async deleteUser(userId) {
        return await this.db.collection('users').deleteOne({ _id: new ObjectId(userId) });
    }
}

module.exports = UserController;
