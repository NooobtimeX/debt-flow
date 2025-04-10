import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
  }

  interface JWT {
    id?: string;
    accessToken?: string;
  }
}
