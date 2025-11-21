import { CheckboxListInput } from '@/components/common';
import type { Facility } from '@/types/branch';

const HARDCODED_FACILITIES = [
    'WiFi',
    'Parking',
    'Security',
    'CCTV',
    'Generator',
    'Elevator',
    'Air Conditioning',
    'Canteen',
    'Prayer Room',
    'First Aid',
    'Fire Extinguisher',
    'Conference Room',
    'Reception',
    'Waiting Area',
    'Disabled Access',
];

interface FacilityInputProps {
    selectedFacilities: (string | Facility)[];
    onChange: (facilities: Facility[]) => void;
    error?: string;
}

export function FacilityInput({
    selectedFacilities,
    onChange,
    error,
}: FacilityInputProps) {
    return (
        <CheckboxListInput
            selectedItems={selectedFacilities}
            hardcodedItems={HARDCODED_FACILITIES}
            onChange={onChange}
            error={error}
            itemTypeLabel="facility"
            addLabel="Add New Facility"
            placeholder="Type a new facility and press Enter"
            columns={5}
        />
    );
}
