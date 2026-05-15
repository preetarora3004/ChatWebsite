export const callbacks = {
    async jwt({ token, user }) {
        if (user) {
            return {
                ...token,
                accessToken: user.token,
                image: user.image,
                name: user.name,
                email: user.email,
                sub: user.id,
                username: user.username,
            };
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.token = token.accessToken;
            session.user.id = token.sub;
            session.user.username = token.username;
        }
        return session;
    }
};
