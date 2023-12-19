import {Sheet, SheetContent, SheetTrigger} from "@/__generated__/components/sheet";
import {PropsWithChildren, useCallback, useState} from "react";
import {TopMenu} from "@/app/menu/top-menu";
import {MainAspectSidebar} from "@/app/smart-home/structure/main-aspect-sidebar";
import {DynamicIcon} from "@/app/components/dynamic-icon";

export function RootLayout({children}: PropsWithChildren) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const closeSheet = useCallback(() => setSheetOpen(false), []);

    const sideBar = <MainAspectSidebar closeSheet={closeSheet}/>;

    return (
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            <div className="block">
                <div className="space-between flex items-center">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger className="block md:hidden">
                            <div className="ml-2 mt-0">
                                <DynamicIcon className={'w-8 h-8 accent-gray-300 opacity-50'} iconKey="menu"/>
                            </div>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[300px] overflow-y-auto	">
                            <div className="p-2">
                                {sideBar}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className={"px-2"}><TopMenu/></div>
                    <div className="ml-auto pr-2">
                        TOP-MENU-RIGHT
                    </div>
                </div>
                <div className="border-t">
                    <div className="bg-background">
                        <div className="grid grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-7">
                            <div className="hidden md:block md:col-span-2 lg:col-span-2 xl:col-span-1 col-span-1">
                                <div className="p-2">
                                    {sideBar}
                                </div>
                            </div>
                            <div className="md:col-span-5 lg:col-span-6 xl:col-span-6 col-span-6 md:border-l p-2">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
