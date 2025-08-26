import {signIn, signOut} from "@/server/auth";

export async function serverSignOut() {
  "use server";
  await signOut();
}

export async function serverSignIn() {
  "use server";
  await signIn();
}
