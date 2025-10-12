import { Button } from "@mantine/core";
import { MapPinnedIcon } from "lucide-react";
import { FunctionComponent } from "react";

interface NearbyNoPlacementsFoundViewProps {
    open: () => void;
}
 
const NearbyNoPlacementsFoundView: FunctionComponent<NearbyNoPlacementsFoundViewProps> = (props) => {
    const { open } = props;
    return ( 
        <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
            <MapPinnedIcon className="size-14 stroke-1 text-zinc-700" />
            <div className="text-sm font-bold text-zinc-700">
                No nearby placements found
            </div>
        </div>

        <Button onClick={open} variant="outline" color="zinc">
            Scan QR Code
        </Button>
    </div>
    );
}
 
export default NearbyNoPlacementsFoundView;