import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

const SpotifyScope =
  "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";
const GoogleScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar",
];
const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope: SpotifyScope },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: { scope: GoogleScope.join(" ") },
        url: GOOGLE_AUTHORIZATION_URL,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  adapter: SupabaseAdapter(supabase),
  // callbacks: {
  //   async session(session, token) {
  //     session.user.id = token.sub; // Set user ID for use on the client side
  //     return session;
  //   },
  // },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
        // token.refreshToken = account.refresh_token;
        // refreshAccessToken(token);
      }
      return token;
    },
    // async session({ session, token }) {
    //   session.user = token;
    //   return session;
    // },
    async session(session, token) {
      session.user.id = token.sub; // Set user ID for use on the client side
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
