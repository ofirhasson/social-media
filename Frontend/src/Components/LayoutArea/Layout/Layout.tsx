
import { Header } from "../Header/Header";
import { Home } from "../Home/Home";

import { ContactsMenu } from "../ContactsMenu/ContactsMenu";
import { ProfileMenu } from "../ProfileMenu/ProfileMenu";
import { useLayout } from "./hooks/useLayout";
import "./Layout.css";
import { memo } from "react";

function LayoutComponent(): JSX.Element {
    const { userId } = useLayout();

    if (!userId) {
        return null;
    }

    return (
        <div className="h-full w-full flex flex-col gap-2 box-border">
            <header className="border-black  basis-1/12 border-2 flex items-center justify-center">
                <Header />
            </header>
            <div className="flex h-full">
                <nav className="border-black  border-2 basis-1/6 maxWLgg:hidden">
                    <ProfileMenu />
                </nav>
                <main className="border-black bg-gray-100 h-full  border-2 overflow-auto basis-4/6 maxWLgg:basis-full">
                    <Home />
                </main>
                <nav className="border-black border-2 basis-1/6 maxWLgg:hidden">
                    <ContactsMenu />
                </nav>
            </div>
        </div>
    );
}

export const Layout = memo(LayoutComponent)