import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ModalContentProps {
    children: ReactNode;
}

export default function ModalContent({ children }: ModalContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}

