import { Kbd, Stepper } from '@mantine/core';
import { DownloadIcon, EllipsisIcon, SquarePlusIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import Favicon from '../../../img/Favicon.png';

interface InstallationNoticeInstructionsProps {}

const InstallationNoticeInstructions: FunctionComponent<
    InstallationNoticeInstructionsProps
> = () => {
    return (
        <Stepper
            active={-1}
            size="xs"
            orientation="vertical"
            color="zinc"
            radius="sm"
            allowNextStepsSelect={false}
            styles={{
                step: {
                    minHeight: 'auto',
                    marginBottom: '10px',
                },
            }}
        >
            <Stepper.Step
                description={
                    <div className="flex items-center gap-2 text-xs">
                        <span>Tap the</span>
                        <Kbd className="flex gap-1">
                            <EllipsisIcon className="size-4 shrink-0" />
                        </Kbd>
                        <span>button below</span>
                    </div>
                }
            />
            <Stepper.Step
                description={
                    <div className="flex items-center gap-2 text-xs">
                        <span>Select the </span>
                        <Kbd className="flex gap-1">
                            <DownloadIcon className="size-4 shrink-0" />
                            Share
                        </Kbd>

                        <span>option</span>
                    </div>
                }
            />
            <Stepper.Step
                description={
                    <div className="flex items-center gap-2 text-xs">
                        <span>Select the more</span>
                        <Kbd className="flex gap-1">
                            <EllipsisIcon className="size-4 shrink-0" />
                        </Kbd>
                        <span>Icon</span>
                    </div>
                }
            />
            <Stepper.Step
                description={
                    <div className="flex items-center gap-2 text-xs">
                        <span>Select</span>
                        <Kbd className="flex gap-1">
                            <SquarePlusIcon className="size-4 shrink-0" />
                            Add to Home Screen
                        </Kbd>
                        <span>Then</span>
                        <span className="rounded-full bg-blue-500 px-2 py-1 font-semibold text-white">
                            Add
                        </span>
                    </div>
                }
            />
            <Stepper.Step
                description={
                    <div className="flex items-center gap-2 text-xs">
                        <span>The app</span>
                        <div className="flex items-center gap-1 overflow-hidden rounded border border-zinc-200 bg-zinc-100 p-0 shadow-xs shadow-zinc-200">
                            <img src={Favicon} alt="Logo" className="size-6" />
                        </div>
                        <span>will be added to your home screen.</span>
                    </div>
                }
            />
        </Stepper>
    );
};

export default InstallationNoticeInstructions;
