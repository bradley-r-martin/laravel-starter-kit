
import { ChevronDownIcon, DownloadIcon, EllipsisIcon, SmartphoneIcon, SquarePlusIcon } from "lucide-react";
import { FunctionComponent } from "react";
import Logo from '../../img/Logo.svg?react';
import Favicon from '../../img/Favicon.png';
import { isIOS, isStandalone } from "@/components/Utilities/Environment";

interface RequiresInstallationLayoutProps {
    children: React.ReactNode;
}
 
const RequiresInstallationLayout: FunctionComponent<RequiresInstallationLayoutProps> = (props) => {
    const { children } = props;

    const requiresInstallation =  isIOS() && !isStandalone();

    if (!requiresInstallation) return children;

    return (<div className="p-4">




    


  <div className="flex h-full flex-col items-center justify-center gap-4">
        <Logo className="mt-8 h-8" />
        <SmartphoneIcon
           
            className="size-24 text-blue-500"
        />

        <div className="mx-auto flex max-w-xs flex-col items-center justify-center">
            <div className="font-bold text-slate-600">
                Installation required
            </div>
            <div className="text-center text-xs text-slate-400">
                Follow the instructions below to
                <br /> install the app on iPhone.
            </div>
        </div>
        <div className="mx-auto flex max-w-sm w-full flex-col divide-y divide-slate-200">
            <div className="flex items-center space-x-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                    1
                </div>
                <div className="text-xs flex items-center gap-2">
                    <span>Tap the</span>
                    <div className="flex items-center space-x-4 rounded bg-zinc-100 border border-zinc-200 p-1 shadow-zinc-200 shadow-xs"
                    >
                        <EllipsisIcon className="size-4" />
                    </div>
                    <span>button below</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                    2
                </div>
                <div className="text-xs flex items-center gap-2">
                    <span>Select the </span>
                    <div className="flex items-center gap-1 rounded bg-zinc-100 border border-zinc-200 p-1 shadow-zinc-200 shadow-xs"
                    >
                        <span className="text-xs">
                           Share
                        </span>
                        <DownloadIcon className="size-4 shrink-0" />
                    </div>
                    <span>option</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 py-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                    3
                </div>
                <div className="text-xs flex items-center gap-2">
                    <span>Select the more</span>
                    <div className="flex items-center space-x-4 rounded bg-zinc-100 border border-zinc-200 p-1 shadow-zinc-200 shadow-xs"
                    >
                        <EllipsisIcon className="size-4" />
                    </div>
                    <span>Icon</span>
                </div>
            </div>
            <div className="flex items-center space-x-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                    4
                </div>
                <div className=" flex flex-col  gap-2 text-xs">
                    <div className="flex items-center gap-2 text-xs">
                    <span>Select</span>

                    <div className="flex items-center gap-1 rounded bg-zinc-100 border border-zinc-200 p-1 shadow-zinc-200 shadow-xs"
                    >
                        <span className="text-xs">
                            Add to Home Screen
                        </span>
                        <SquarePlusIcon className="size-4 shrink-0" />
                    </div>
                    <span>
                        Then
                    </span>
                    <span className="font-semibold bg-blue-500 text-white px-2 py-1 rounded-full">Add</span>
                   
                    </div>
                   

                  
                </div>
            </div>
            <div className="flex items-center space-x-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-white font-bold">
                    5
                </div>
                <div className="text-xs flex flex-col gap-2">
                    <div className="text-xs flex items-center gap-2">
                    <span>The app</span>
                    <div className="flex items-center gap-1 rounded bg-zinc-100 border border-zinc-200 p-0 overflow-hidden shadow-zinc-200 shadow-xs"
                    >
                        <img src={Favicon} alt="Logo" className="size-5" />
                    </div>
                    <span>will be added to your home screen.</span>
                    </div>
                   
                  
                </div>
            </div>
        </div>

        <div className="flex-1"></div>
        <ChevronDownIcon className="size-10 animate-bounce text-slate-400 stroke-1	" />
    </div>
    
    </div>);
}
 
export default RequiresInstallationLayout;