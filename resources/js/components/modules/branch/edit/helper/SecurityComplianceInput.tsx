import { CheckboxListInput } from '@/components/common';
import type { SecurityFeature } from '@/types/branch';

const HARDCODED_SECURITY_FEATURES = [
    'ID Card Required',
    'Biometric System',
    'CCTV',
    'Visitor Registration',
];

interface SecurityComplianceInputProps {
    selectedFeatures: (string | SecurityFeature)[];
    onChange: (features: SecurityFeature[]) => void;
    error?: string;
}

export function SecurityComplianceInput({
    selectedFeatures,
    onChange,
    error,
}: SecurityComplianceInputProps) {
    return (
        <CheckboxListInput
            selectedItems={selectedFeatures}
            hardcodedItems={HARDCODED_SECURITY_FEATURES}
            onChange={onChange}
            error={error}
            itemTypeLabel="security feature"
            addLabel="Add New Security Feature"
            placeholder="Type a new security feature and press Enter"
            columns={5}
        />
    );
}
