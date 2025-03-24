import User from '../models/User';
import { signToken } from '../services/auth';

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    registerUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
      console.log('we are looking for a user')
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  },
};

export default resolvers;
