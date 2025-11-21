import { FormField, InfoCard, PhotoUploadField } from '@/components/common';
import { Button } from '@/components/ui/button';
import type { BranchDetail, DetailsData } from '@/types/branch';
import { useState } from 'react';
import { FacilityInput } from './helper/FacilityInput';

interface Props {
    data: DetailsData;
    errors: Record<string, string>;
    setData: <K extends keyof DetailsData>(
        key: K,
        value: DetailsData[K],
    ) => void;
    existingPhotoUrl?: string | null;
}

const DAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
] as const;

export function DetailsEdit({
    data,
    errors,
    setData,
    existingPhotoUrl,
}: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        existingPhotoUrl || null,
    );
    const handleDetailChange = <K extends keyof BranchDetail>(
        field: K,
        value: BranchDetail[K],
    ) => {
        setData('detail', {
            ...data.detail,
            [field]: value,
        });
    };

    const handleWorkingHoursChange = (
        day: (typeof DAYS)[number],
        type: 'start' | 'end',
        value: string,
    ) => {
        const currentWorkingHours = data.detail.working_hours || {};
        const daySchedule = currentWorkingHours[day] || {
            start: '',
            end: '',
        };

        setData('detail', {
            ...data.detail,
            working_hours: {
                ...currentWorkingHours,
                [day]: {
                    ...daySchedule,
                    [type]: value,
                },
            },
        });
    };

    const handleGetCurrentLocation = () => {
        if (data.detail.latitude && data.detail.longitude) {
            const googleMapsUrl = `https://www.google.com/maps?q=${data.detail.latitude},${data.detail.longitude}`;
            window.open(googleMapsUrl, '_blank');
        }
    };

    return (
        <>
            <InfoCard title="GPS Coordinates">
                <div className="grid items-center gap-6 md:grid-cols-3">
                    <FormField
                        type="number"
                        id="latitude"
                        label="Latitude"
                        value={
                            data.detail.latitude
                                ? String(data.detail.latitude)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'latitude',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.latitude']}
                        placeholder="e.g., 23.8103"
                        step={0.000001}
                    />

                    <FormField
                        type="number"
                        id="longitude"
                        label="Longitude"
                        value={
                            data.detail.longitude
                                ? String(data.detail.longitude)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'longitude',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.longitude']}
                        placeholder="e.g., 90.4125"
                        step={0.000001}
                    />

                    <Button
                        onClick={handleGetCurrentLocation}
                        disabled={
                            !data.detail.latitude || !data.detail.longitude
                        }
                        type="button"
                        className="mt-6 cursor-pointer"
                    >
                        View on Google Maps
                    </Button>
                </div>
            </InfoCard>

            <InfoCard title="Working Hours">
                <div className="space-y-2">
                    {DAYS.map((day) => (
                        <div key={day} className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center">
                                <label className="text-sm font-medium capitalize">
                                    {day}
                                </label>
                            </div>

                            <FormField
                                type="text"
                                id={`working_hours_${day}_start`}
                                label="Start Time"
                                value={
                                    data.detail.working_hours?.[day]?.start ||
                                    ''
                                }
                                onChange={(value: string) =>
                                    handleWorkingHoursChange(
                                        day,
                                        'start',
                                        value,
                                    )
                                }
                                error={
                                    errors[`detail.working_hours.${day}.start`]
                                }
                                placeholder="09:00"
                            />

                            <FormField
                                type="text"
                                id={`working_hours_${day}_end`}
                                label="End Time"
                                value={
                                    data.detail.working_hours?.[day]?.end || ''
                                }
                                onChange={(value: string) =>
                                    handleWorkingHoursChange(day, 'end', value)
                                }
                                error={
                                    errors[`detail.working_hours.${day}.end`]
                                }
                                placeholder="18:00"
                            />
                        </div>
                    ))}
                </div>
            </InfoCard>

            <InfoCard title="Facilities">
                <FacilityInput
                    selectedFacilities={data.detail.facilities || []}
                    onChange={(facilities) =>
                        handleDetailChange(
                            'facilities',
                            facilities.map((facility) => facility.name),
                        )
                    }
                    error={errors['detail.facilities']}
                />
            </InfoCard>

            <InfoCard title="Building Information">
                <div className="grid gap-6 pb-4 md:grid-cols-3">
                    <FormField
                        type="text"
                        id="building_name"
                        label="Building Name"
                        value={data.detail.building_name || ''}
                        onChange={(value: string) =>
                            handleDetailChange('building_name', value)
                        }
                        error={errors['detail.building_name']}
                        placeholder="e.g., Tech Tower"
                    />

                    <FormField
                        type="number"
                        id="total_area"
                        label="Total Area (square feet)"
                        value={
                            data.detail.total_area
                                ? String(data.detail.total_area)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'total_area',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.total_area']}
                        placeholder="e.g., 5000"
                        min={0}
                    />

                    <FormField
                        type="number"
                        id="total_floors"
                        label="Total Floors"
                        value={
                            data.detail.total_floors
                                ? String(data.detail.total_floors)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'total_floors',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.total_floors']}
                        placeholder="e.g., 10"
                        min={0}
                    />

                    <FormField
                        type="text"
                        id="floor_number"
                        label="Floor Number"
                        value={data.detail.floor_number || ''}
                        onChange={(value: string) =>
                            handleDetailChange('floor_number', value)
                        }
                        error={errors['detail.floor_number']}
                        placeholder="e.g., 5th Floor"
                    />

                    <FormField
                        type="text"
                        id="building_type"
                        label="Building Type"
                        value={data.detail.building_type || ''}
                        onChange={(value: string) =>
                            handleDetailChange('building_type', value)
                        }
                        error={errors['detail.building_type']}
                        placeholder="e.g., Commercial, Residential"
                    />
                </div>

                <FormField
                    type="textarea"
                    id="accessibility_features"
                    label="Accessibility Features"
                    value={data.detail.accessibility_features || ''}
                    onChange={(value: string) =>
                        handleDetailChange('accessibility_features', value)
                    }
                    error={errors['detail.accessibility_features']}
                    placeholder="Describe accessibility features (e.g., wheelchair ramps, elevators)"
                    rows={3}
                />
            </InfoCard>

            <InfoCard title="Lease Information">
                <div className="grid gap-6 pb-4 md:grid-cols-3">
                    <FormField
                        type="date"
                        id="lease_start_date"
                        label="Lease Start Date"
                        value={data.detail.lease_start_date || ''}
                        onChange={(value: string) =>
                            handleDetailChange('lease_start_date', value)
                        }
                        error={errors['detail.lease_start_date']}
                    />

                    <FormField
                        type="date"
                        id="lease_end_date"
                        label="Lease End Date"
                        value={data.detail.lease_end_date || ''}
                        onChange={(value: string) =>
                            handleDetailChange('lease_end_date', value)
                        }
                        error={errors['detail.lease_end_date']}
                    />

                    <FormField
                        type="number"
                        id="monthly_rent"
                        label="Monthly Rent"
                        value={
                            data.detail.monthly_rent
                                ? String(data.detail.monthly_rent)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'monthly_rent',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.monthly_rent']}
                        placeholder="e.g., 500000"
                        min={0}
                        step={0.01}
                    />

                    <FormField
                        type="number"
                        id="monthly_utilities"
                        label="Monthly Utilities"
                        value={
                            data.detail.monthly_utilities
                                ? String(data.detail.monthly_utilities)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'monthly_utilities',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.monthly_utilities']}
                        placeholder="e.g., 10000"
                        min={0}
                        step={0.01}
                    />

                    <FormField
                        type="number"
                        id="monthly_maintenance"
                        label="Monthly Maintenance"
                        value={
                            data.detail.monthly_maintenance
                                ? String(data.detail.monthly_maintenance)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'monthly_maintenance',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.monthly_maintenance']}
                        placeholder="e.g., 5000"
                        min={0}
                        step={0.01}
                    />

                    <FormField
                        type="number"
                        id="security_deposit"
                        label="Security Deposit"
                        value={
                            data.detail.security_deposit
                                ? String(data.detail.security_deposit)
                                : ''
                        }
                        onChange={(value: string | number) =>
                            handleDetailChange(
                                'security_deposit',
                                value ? Number(value) : null,
                            )
                        }
                        error={errors['detail.security_deposit']}
                        placeholder="e.g., 1500000"
                        min={0}
                        step={0.01}
                    />
                </div>

                <FormField
                    type="textarea"
                    id="lease_terms"
                    label="Lease Terms"
                    value={data.detail.lease_terms || ''}
                    onChange={(value: string) =>
                        handleDetailChange('lease_terms', value)
                    }
                    error={errors['detail.lease_terms']}
                    placeholder="Enter lease terms and conditions"
                    rows={4}
                />
            </InfoCard>

            <InfoCard title="Landlord Information">
                <div className="grid gap-6 pb-6 md:grid-cols-2">
                    <FormField
                        type="text"
                        id="property_contact_name"
                        label="Landlord Name"
                        value={data.detail.property_contact_name || ''}
                        onChange={(value: string) =>
                            handleDetailChange('property_contact_name', value)
                        }
                        error={errors['detail.property_contact_name']}
                        placeholder="Enter landlord name"
                    />

                    <FormField
                        type="tel"
                        id="property_contact_phone"
                        label="Landlord Phone"
                        value={data.detail.property_contact_phone || ''}
                        onChange={(value: string) =>
                            handleDetailChange('property_contact_phone', value)
                        }
                        error={errors['detail.property_contact_phone']}
                        placeholder="e.g., +880 1700000000"
                    />

                    <FormField
                        type="email"
                        id="property_contact_email"
                        label="Landlord Email"
                        value={data.detail.property_contact_email || ''}
                        onChange={(value: string) =>
                            handleDetailChange('property_contact_email', value)
                        }
                        error={errors['detail.property_contact_email']}
                        placeholder="e.g., contact@property.com"
                    />

                    <FormField
                        type="text"
                        id="property_contact_address"
                        label="Landlord Address"
                        value={data.detail.property_contact_address || ''}
                        onChange={(value: string) =>
                            handleDetailChange(
                                'property_contact_address',
                                value,
                            )
                        }
                        error={errors['detail.property_contact_address']}
                        placeholder="Enter landlord address"
                    />
                </div>

                <PhotoUploadField
                    value={data.property_contact_photo}
                    onChange={(file) => {
                        setData('property_contact_photo', file);
                        if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                            setData('delete_property_contact_photo', false);
                        }
                    }}
                    onDelete={() => {
                        setData('delete_property_contact_photo', true);
                        setData('property_contact_photo', null);
                        setPreviewUrl(null);
                    }}
                    helpText="Upload landlord photo (max 2MB, JPEG/PNG/WebP)"
                    error={errors['property_contact_photo']}
                    previewUrl={previewUrl}
                />
            </InfoCard>
        </>
    );
}
