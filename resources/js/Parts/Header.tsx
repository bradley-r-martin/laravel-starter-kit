import { Button } from "@mantine/core";
import { FunctionComponent, RefObject, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface HeaderProps {
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}
 
const Header: FunctionComponent<HeaderProps> = ({ scrollContainerRef }) => {
    const headerRef = useRef<HTMLDivElement>(null);
    
    // Track scroll progress from the specific scroll container
    const { scrollY } = useScroll({
        container: scrollContainerRef
    });
    
    // Transform scroll values to CSS properties
    // Animate over the first 100px of scroll
    const fontSize = useTransform(scrollY, [0, 100], ["24px", "16px"]);
    
    return (
        <motion.div 
            ref={headerRef}
            className='sticky top-0 mt-10 z-10 bg-gradient-to-b from-zinc-100 via-zinc-100 to-transparent'
            
        >
            <div className='flex justify-between items-center p-2 px-5'>
                <motion.h1
                    style={{
                        fontSize
                    }}
                    className="font-bold"
                >
                    Dashboard
                </motion.h1>

                <div>
                    <Button color="blue" size="xs">Create site</Button>
                </div>
            </div>

            {/* <div className='border-b border-zinc-950/20 py-2 px-5'>
                <input type="text" placeholder='Search' className='p-2 w-full bg-zinc-200 rounded' />
            </div> */}
        </motion.div>
    );
}
 
export default Header;