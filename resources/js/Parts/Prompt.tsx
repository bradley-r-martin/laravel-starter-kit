import { FunctionComponent } from "react";


interface PromptProps {
    
}
 
const Prompt: FunctionComponent<PromptProps> = () => {
    return (
        <div className="h-[200px] flex items-center justify-center rounded-lg bg-slate-100 px-5 w-full">
        <div className="relative -translate-y-1/2 w-full">
          <div
            className="w-full"
            style={{
              opacity: 1,
              willChange: "auto",
              transform: "translateY(3rem) scale(0.9)"
            }}
          >
            <div className="rounded-lg shadow-xl flex items-center p-2 space-x-2 select-none bg-gray-300">
              <div className="size-10 bg-black rounded-lg shrink-0 border border-white text-white flex items-center justify-center p-2 bg-gradient-to-b from-primary-500 to-primary-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="size-full"
                >
                  <path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16Zm8,200a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8ZM168,56a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,56Z" />
                </svg>
              </div>
              <div className="flex flex-col text-white space-y-1 overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold truncate">
                    Allow notification access
                  </div>
                  <div className="text-xs font-semibold truncate">2m ago</div>
                </div>
                <div className="truncate text-xs">3+ notifications</div>
              </div>
            </div>
          </div>
          <div
            className="w-full absolute bottom-0"
            style={{
              opacity: 1,
              willChange: "auto",
              transform: "translateY(1.5rem) scale(0.95)"
            }}
          >
            <div className="rounded-lg shadow-xl flex items-center p-2 space-x-2 select-none bg-gray-400">
              <div className="size-10 bg-black rounded-lg shrink-0 border border-white text-white flex items-center justify-center p-2 bg-gradient-to-b from-primary-500 to-primary-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="size-full"
                >
                  <path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16Zm8,200a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8ZM168,56a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,56Z" />
                </svg>
              </div>
              <div className="flex flex-col text-white space-y-1 overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold truncate">
                    Allow notification access
                  </div>
                  <div className="text-xs font-semibold truncate">2m ago</div>
                </div>
                <div className="truncate text-xs">
                  "Untitled" would like to send you notifications
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-full absolute bottom-0"
            style={{ opacity: 1, willChange: "auto", transform: "none" }}
          >
            <div className="bg-gray-500 rounded-lg shadow-xl flex items-center p-2 space-x-2 select-none">
              <div className="size-10 bg-black rounded-lg shrink-0 border border-white text-white flex items-center justify-center p-2 bg-gradient-to-b from-primary-500 to-primary-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="size-full"
                >
                  <path d="M176,16H80A24,24,0,0,0,56,40V216a24,24,0,0,0,24,24h96a24,24,0,0,0,24-24V40A24,24,0,0,0,176,16Zm8,200a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8ZM168,56a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,56Z" />
                </svg>
              </div>
              <div className="flex flex-col text-white space-y-1 overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold truncate">
                    Allow notification access
                  </div>
                  <div className="text-xs font-semibold truncate">now</div>
                </div>
                <div className="truncate text-xs">
                  "Untitled" would like to send you notifications
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
}
 
export default Prompt;