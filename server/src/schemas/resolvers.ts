import { AuthenticationError } from 'apollo-server-express';
import  User  from '../models/User.js';
import {signToken} from '../services/auth.js';

const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: { user: { _id: any; }; }) => {
            if (context.user) {
                return User.findOne({_id: context.user._id});
            }
            throw new AuthenticationError('Not logged in', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                },
            });
        },
    },
    Mutation: {
        login: async (_parent: unknown, { email, password }: { email: string; password: string }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
        } 

        const correctPW = await user.isCorrectPassword(password);
        if (!correctPW) {
            throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
        },

        addUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, { input }: any, context: { user: { _id: any; }; }) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    {new: true, runValidators: true}
                ).populate('savedBooks');

                return updatedUser;


            }
            throw new AuthenticationError('Please log in to save a book');
        },
        removeBook: async (_parent: any, { bookId }: any, context: { user: { _id: any; }; }) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {$pull: {savedBooks: { bookId } } },
                    {new: true}
                ).populate('savedBooks');

                return updatedUser;
            }
            throw new AuthenticationError('Please log in to remove a book');
        },
    },
};
export default resolvers;