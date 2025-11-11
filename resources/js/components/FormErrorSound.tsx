import useSounds from '@/XHooks/useSounds';
import merge from 'merge-props';
import React, { FunctionComponent } from 'react';
import Slot from './Slot';

interface FormErrorSoundProps {
    children: React.ReactNode;
}

const FormErrorSound: FunctionComponent<FormErrorSoundProps> = (props) => {
    const { children, ...restProps } = props;
    const play = useSounds();
    return (
        <Slot
            children={children}
            {...merge(restProps, {
                onError: () => play('error'),
            })}
        />
    );
};

export default FormErrorSound;
