
import { MapPinnedIcon } from 'lucide-react';
import { FunctionComponent } from 'react';

interface NearbyNoPlacementsFoundViewProps {
   
}

const NearbyNoPlacementsFoundView: FunctionComponent<NearbyNoPlacementsFoundViewProps> = (
    
) => {
    
    return (
        <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center justify-center gap-4">
                <MapPinnedIcon className="size-14 stroke-1 text-zinc-700" />
                <div className="text-sm font-bold text-zinc-700">No nearby placements found</div>
            </div>

        </div>
    );
};

export default NearbyNoPlacementsFoundView;
