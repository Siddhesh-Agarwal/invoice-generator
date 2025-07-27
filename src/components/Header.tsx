import { LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { auth, continueWithGoogle } from "@/firebase";
import { Link, useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();
  const path = window.location.pathname;

  return (
    <nav className="bg-accent px-2 md:px-8 py-1 flex justify-between items-center print:hidden">
      <Link to="#">
        <div className="flex">
          <img alt="logo" src="/1F4D2.svg" height={30} width={30} />
          <span className="font-semibold text-lg">
            Simple Invoice Generator
          </span>
        </div>
      </Link>
      <div className="flex">
        {path === "/" ? (
          <Button
            variant={"link"}
            className="text-accent-foreground font-semibold"
            onClick={() => navigate("/history")}
          >
            History
          </Button>
        ) : (
          <Button
            variant={"link"}
            className="text-accent-foreground font-semibold"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        )}

        {auth.currentUser === null ? (
          <Button size={"icon"} onClick={() => continueWithGoogle()}>
            <LogIn />
          </Button>
        ) : (
          <Button size={"icon"} onClick={() => auth.signOut()}>
            <LogOut />
          </Button>
        )}
      </div>
    </nav>
  );
}
