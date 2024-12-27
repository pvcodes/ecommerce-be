import { userModel } from "../db/models";

class UserService {
	static async createUser(data: object) {
		try {
			const user = await userModel.create(data);
			return user;
		} catch (error) {
			throw new Error(`Unable to find user: ${error.message}`);
		}
	}
	static async findOneUser(query: object) {
		try {
			const user = await userModel.findOne(query);
			return user;
		} catch (error) {
			throw new Error(`Unable to find user: ${error.message}`);
		}
	}

	// Method to update a user by id
	static async updateUser(user: object, updateData: object) {
		try {
			const updatedUser = await userModel.findOneAndUpdate(
				user,
				updateData,
				{ new: true }
			);
			return updatedUser;
		} catch (error) {
			throw new Error(`Unable to update user: ${error.message}`);
		}
	}
}

export default UserService;
