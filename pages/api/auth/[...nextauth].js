import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"

const adminEmails = ['pranavlande1@gmail.com'];

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: ({session, token, user}) => {
      console.log(session);
      if(adminEmails.includes(session?.user?.email)){
        return session;
      }else{
        return false;
      }
    }
  }
});
