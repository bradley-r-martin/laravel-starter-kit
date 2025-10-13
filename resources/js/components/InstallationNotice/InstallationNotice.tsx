import { ArrowBigDownDashIcon, ChevronDownIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import Logo from '../../../img/Logo.svg?react';
import ModalHeader from '../ModalHeader';
import InstallationNoticeInstructions from './InstallationNoticeInstructions';

interface InstallationNoticeProps {}

const InstallationNotice: FunctionComponent<InstallationNoticeProps> = () => {
    return (
        <div className="p-4">
            <div className="flex h-full flex-col items-center justify-center">
                <ModalHeader
                    hero
                    icon={<ArrowBigDownDashIcon className="size-8 stroke-1" />}
                    title={
                        <>
                            <Logo className="mx-auto mb-3 h-10" />
                            <span>Installation required</span>
                        </>
                    }
                    description={
                        <div className="text-center text-xs text-slate-400">
                            Follow the instructions below to
                            <br /> install the app on iPhone.
                        </div>
                    }
                />

                <InstallationNoticeInstructions />

                <div className="flex-1"></div>
                <ChevronDownIcon className="size-10 animate-bounce stroke-1 text-slate-400" />
            </div>
        </div>
    );
};

export default InstallationNotice;
