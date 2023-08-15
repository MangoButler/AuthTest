import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
 
import { verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
 
export const authOptions = {
  secret: 'thequickbrownfox',
  session: {
    jwt: true,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        let client;
        try {
            client = await connectToDatabase();
        } catch (error) {
            throw new Error('Connection timeout, try again!');
        }
       
        const usersCollection = client.db().collection('users');
        let user;
        try {
            user = await usersCollection.findOne({
                email: credentials.email,
              });
        } catch (error) {
            throw new Error('Connection timeout, try again!');
        }
       
 
        if (!user) {
          client.close();
          throw new Error('No user found!');
        }
 
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
 
        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }
 
        client.close();
        return { email: user.email };
      },
    }),
  ],
};
 
export default NextAuth(authOptions);









// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDatabase } from "../../../lib/db";
// import { verifyPassword } from "../../../lib/auth";

// export default NextAuth({
//   session: {
//     jwt: true,
//   },
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         const client = await connectToDatabase();
//         const usersCollection = client.db().collection("users");

//         const user = await usersCollection.findOne({
//           email: credentials.email,
//         });

//         if (!user) {
//           client.close();
//           throw new Error("Could not find that user.");
//         }
//         const isValid = await verifyPassword(
//           credentials.password,
//           user.password
//         );

//         if (!isValid) {
//           client.close();
//           throw new Error("Could not log you in!");
//         }
//         client.close();
//         return { email: user.email };
//       },
//     }),
//   ],
// });
