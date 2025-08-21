import Image from "next/image";
import Link from "next/link";
import {AuthButton} from "./AuthButton";
import {Button} from "./ui/button";

export default function Header() {
  return (
    <nav className="flex items-center justify-between bg-accent px-2 py-1 md:px-8 print:hidden">
      <Link href={"/"} prefetch passHref>
        <div className="flex">
          <Image alt="logo" src="/favicon-32x32.png" height={30} width={30} />
          <span className="font-semibold text-lg">
            Simple Invoice Generator
          </span>
        </div>
      </Link>
      <div className="flex">
        <Link href="/history" passHref>
          <Button
            variant={"link"}
            className="font-semibold text-accent-foreground"
          >
            History
          </Button>
        </Link>

        <AuthButton />
      </div>
    </nav>
  );
}
