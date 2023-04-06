import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter, _id } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import connectMongo from "@/utils/connectMongo";
import alternativeUser from "@/model/alternativeUser";

export const authOptions = ({
    providers: [
        GithubProvider(
            {
                // profile: profile => {
                //     return {role: profile?.role ? "user" : "not a user"}
                // },
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET
            }
        ),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "john smith", required: true },
                email: { label: "Email", type: "email", placeholder: "john@smith.com", required: true },
                password: { label: "Password", type: "password", placeholder: "*********", required: true, minlength: 4 }
            },
            async authorize(credentials, req) {
                const { username, email, password } = credentials;

                let user = { name: username, email, password }

                await connectMongo();

                const checkIfExistAlready = await alternativeUser.findOne({ email: email });

                const foundUser = await alternativeUser.findOne({ name: username, email: email, password: password })

                if (foundUser) {
                    console.log("foundUser!!")
                    user.id = foundUser._id
                } else {
                    if (!checkIfExistAlready) {
                        console.log("new user")

                        user = { name: username, email, password }

                        const newUser = new alternativeUser(user)

                        const savedUser = await newUser.save();

                        if (savedUser) {
                            console.log("saved user")
                            user.id = savedUser._id
                        }
                    } else {
                        console.log("password mismatch")
                    }
                }

                if (user?.id) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: { strategy: "jwt" },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account?.access_token
                token.id = profile?.id
                // token.role = profile?.role
            } else {
                // this will be used when usaer is logged in using "Email and password"
                token.accessToken = token?.jti
                token.id = token.sub
            }
            // console.log(token, account, profile, "JWT CB!!")
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token?.accessToken
            session.user.id = token.id
            // session.user.role = user?.role
            return session
        }
    },
});

export default NextAuth(authOptions);