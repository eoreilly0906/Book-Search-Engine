import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Context {
  user: User;
}




const resolvers = {
  Query: {
    me: async (parent: any, args: any, context: Context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
