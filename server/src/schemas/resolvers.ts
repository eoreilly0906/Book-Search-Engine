import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import type { GraphQLContext } from '../services/auth.js';
import type { BookDocument } from '../models/Book.js';

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new Error('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { bookData }: { bookData: BookDocument }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error('Failed to save book');
      }
    },

    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: GraphQLContext) => {
      if (!context.user) {
        throw new Error('You need to be logged in!');
      }

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error('Failed to remove book');
      }
    },
  },
};

export default resolvers;
