import { FunctionComponent } from 'react';

interface PromptProps {}

const Prompt: FunctionComponent<PromptProps> = () => {
    return (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg bg-slate-100 px-5">
            <div className="relative w-full -translate-y-1/2">
                <div
                    className="w-full"
                    style={{
                        opacity: 1,
                        willChange: 'auto',
                        transform: 'translateY(3rem) scale(0.9)',
                    }}
                >
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-300 p-2 shadow-xl select-none">
                        <div className="from-primary-500 to-primary-700 flex size-10 shrink-0 items-center justify-center rounded-lg border border-white bg-black bg-gradient-to-b p-2 text-white">
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
                        <div className="flex flex-1 flex-col space-y-1 overflow-hidden text-white">
                            <div className="flex items-center justify-between">
                                <div className="truncate text-xs font-semibold">
                                    Allow notification access
                                </div>
                                <div className="truncate text-xs font-semibold">2m ago</div>
                            </div>
                            <div className="truncate text-xs">3+ notifications</div>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute bottom-0 w-full"
                    style={{
                        opacity: 1,
                        willChange: 'auto',
                        transform: 'translateY(1.5rem) scale(0.95)',
                    }}
                >
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-400 p-2 shadow-xl select-none">
                        <div className="from-primary-500 to-primary-700 flex size-10 shrink-0 items-center justify-center rounded-lg border border-white bg-black bg-gradient-to-b p-2 text-white">
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
                        <div className="flex flex-1 flex-col space-y-1 overflow-hidden text-white">
                            <div className="flex items-center justify-between">
                                <div className="truncate text-xs font-semibold">
                                    Allow notification access
                                </div>
                                <div className="truncate text-xs font-semibold">2m ago</div>
                            </div>
                            <div className="truncate text-xs">
                                "Untitled" would like to send you notifications
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute bottom-0 w-full"
                    style={{ opacity: 1, willChange: 'auto', transform: 'none' }}
                >
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-500 p-2 shadow-xl select-none">
                        <div className="from-primary-500 to-primary-700 flex size-10 shrink-0 items-center justify-center rounded-lg border border-white bg-black bg-gradient-to-b p-2 text-white">
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
                        <div className="flex flex-1 flex-col space-y-1 overflow-hidden text-white">
                            <div className="flex items-center justify-between">
                                <div className="truncate text-xs font-semibold">
                                    Allow notification access
                                </div>
                                <div className="truncate text-xs font-semibold">now</div>
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
};

export default Prompt;
