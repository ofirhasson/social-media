import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../Redux/Store";
import { ContactsMenu } from "../ContactsMenu/ContactsMenu";
import { Header } from "../Header/Header";
import { Home } from "../Home/Home";
import { ProfileMenu } from "../ProfileMenu/ProfileMenu";
import "./Layout.css";

export function Layout(): JSX.Element {
  const userId = useAppSelector((state) => state?.auth?._id);


  if (!userId) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col gap-2 box-border">
      <header className="border-black basis-1/12  border-2 flex items-center justify-center">
        <Header />
      </header>
      <div className="flex h-full">
        <nav className="border-black  border-2 basis-1/6 maxWLg:hidden">
          <ContactsMenu />
        </nav>
        <main className="border-black border-2 overflow-auto basis-4/6 maxWLg:basis-full">
          <Home />
        </main>
        <nav className="border-black border-2 basis-1/6 maxWLg:hidden">
          <ProfileMenu />
        </nav>
      </div>
    </div>
  );
}
