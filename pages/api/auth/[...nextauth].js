import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import { ServerSession } from 'mongodb';

const adminEmails = ['pranavlande1@gmail.com'];

export const authOptions = {
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: async ({session, token, user}) => {
      //console.log(session);
      if(adminEmails.includes(session?.user?.email)){
        return session;
      }else{
        return null;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res){
  const session = await getServerSession(req,res,authOptions);
  if(!adminEmails.includes(session?.user?.email)){
    res.status(401);
    throw "Not An Admin";
  }
}