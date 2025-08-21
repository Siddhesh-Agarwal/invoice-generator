import {serverSignIn, serverSignOut} from "@/lib/helpers";
import {auth} from "@/server/auth";
import {LogIn, LogOut} from "lucide-react";
import {Button} from "./ui/button";

export async function AuthButton() {
  const session = await auth();

  return (
    <form onSubmit={session ? serverSignOut : serverSignIn}>
      <Button type="submit" size={"icon"} variant={"ghost"}>
        {session ? <LogOut /> : <LogIn />}
        <span className="sr-only">{session ? "Sign out" : "Sign in"}</span>
      </Button>
    </form>
  );
}
