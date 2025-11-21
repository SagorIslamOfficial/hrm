import { formatDateForDisplay, InfoCard } from '@/components/common';
import DetailRow from '@/components/common/DetailRow';
import { titleCase } from '@/components/common/utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type BranchDetail } from '@/types/branch';
import { MapPin } from 'lucide-react';

interface DetailsViewProps {
    detail?: BranchDetail;
    onPhotoClick: (photo: { url: string; name: string }) => void;
}

export function DetailsView({ detail, onPhotoClick }: DetailsViewProps) {
    const handleViewOnMap = () => {
        if (detail?.latitude && detail?.longitude) {
            const googleMapsUrl = `https://www.google.com/maps?q=${detail.latitude},${detail.longitude}`;
            window.open(googleMapsUrl, '_blank');
        }
    };

    const formatWorkingHours = (
        workingHours?: {
            [key: string]: { start?: string; end?: string };
        } | null,
    ) => {
        if (!workingHours || Object.keys(workingHours).length === 0) {
            return 'Not set';
        }

        return (
            <div className="space-y-1">
                {Object.entries(workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize">{day}:</span>
                        <span>
                            {hours.start || 'N/A'} - {hours.end || 'N/A'}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const formatLabel = (value?: string | number | boolean | object) => {
        if (typeof value === 'object' && value !== null) {
            return titleCase(
                String(
                    (value as Record<string, unknown>).name ||
                        (value as Record<string, unknown>).title ||
                        'Unknown',
                ),
            );
        }
        return titleCase(String(value || ''));
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Location Details">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <DetailRow
                            label="Latitude"
                            value={detail?.latitude ?? 'N/A'}
                        />

                        <DetailRow
                            label="Longitude"
                            value={detail?.longitude ?? 'N/A'}
                        />

                        {detail?.latitude && detail?.longitude && (
                            <div className="justify-start">
                                <Button
                                    onClick={handleViewOnMap}
                                    className="cursor-pointer"
                                    type="button"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Google Maps
                                </Button>
                            </div>
                        )}

                        <DetailRow
                            label="Total Area (square feet)"
                            value={detail?.total_area ?? 'N/A'}
                        />

                        <DetailRow
                            label="Total Floors"
                            value={detail?.total_floors ?? 'N/A'}
                        />

                        <DetailRow
                            label="Floor Number"
                            value={detail?.floor_number || 'N/A'}
                        />

                        <DetailRow
                            label="Building Name"
                            value={detail?.building_name || 'N/A'}
                        />

                        <DetailRow
                            label="Building Type"
                            value={detail?.building_type || 'N/A'}
                        />
                    </div>

                    {detail?.accessibility_features && (
                        <>
                            <Separator />
                            <DetailRow
                                label="Accessibility Features"
                                value={detail.accessibility_features}
                            />
                        </>
                    )}
                </div>
            </InfoCard>

            <InfoCard title="Working Hours">
                <div className="space-y-3">
                    <DetailRow
                        label="Schedule"
                        value={formatWorkingHours(detail?.working_hours)}
                    />
                </div>
            </InfoCard>

            <InfoCard title="Facilities">
                <div className="space-y-3">
                    <DetailRow
                        label="Available Facilities"
                        value={
                            detail?.facilities &&
                            detail.facilities.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {detail.facilities.map(
                                        (facility, index) => (
                                            <span
                                                key={index}
                                                className="rounded-md bg-muted px-2 py-1 text-sm"
                                            >
                                                {formatLabel(facility)}
                                            </span>
                                        ),
                                    )}
                                </div>
                            ) : (
                                'No facilities listed'
                            )
                        }
                    />
                </div>
            </InfoCard>

            <InfoCard title="Financial Details">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <DetailRow
                            label="Monthly Rent"
                            value={detail?.monthly_rent ?? 'N/A'}
                        />

                        <DetailRow
                            label="Monthly Utilities"
                            value={detail?.monthly_utilities ?? 'N/A'}
                        />

                        <DetailRow
                            label="Monthly Maintenance"
                            value={detail?.monthly_maintenance ?? 'N/A'}
                        />

                        <DetailRow
                            label="Security Deposit"
                            value={detail?.security_deposit ?? 'N/A'}
                        />
                    </div>
                </div>
            </InfoCard>

            <InfoCard title="Lease Information">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow
                                label="Lease Start"
                                value={
                                    detail?.lease_start_date
                                        ? formatDateForDisplay(
                                              detail.lease_start_date,
                                          )
                                        : 'N/A'
                                }
                            />

                            <DetailRow
                                label="Lease End"
                                value={
                                    detail?.lease_end_date
                                        ? formatDateForDisplay(
                                              detail.lease_end_date,
                                          )
                                        : 'N/A'
                                }
                            />

                            <DetailRow
                                label="Landlord Name"
                                value={detail?.property_contact_name || 'N/A'}
                            />

                            <DetailRow
                                label="Landlord Phone"
                                value={detail?.property_contact_phone || 'N/A'}
                            />

                            <DetailRow
                                label="Landlord Email"
                                value={detail?.property_contact_email || 'N/A'}
                            />

                            {detail?.photo_url && (
                                <DetailRow
                                    label="Landlord Photo"
                                    value={detail?.property_contact_name}
                                    imageSrc={detail.photo_url}
                                    imageAlt={detail?.property_contact_name}
                                    imageClassName="size-30 cursor-pointer rounded-lg transition-opacity hover:opacity-80"
                                    imageWrapperClassName=""
                                    onImageClick={() =>
                                        onPhotoClick({
                                            url: detail.photo_url!,
                                            name:
                                                detail?.property_contact_name ||
                                                'Landlord',
                                        })
                                    }
                                    showValue={false}
                                />
                            )}
                        </div>

                        <DetailRow
                            label="Landlord Address"
                            value={detail?.property_contact_address || 'N/A'}
                        />
                    </div>

                    {detail?.lease_terms && (
                        <>
                            <Separator />
                            <DetailRow
                                label="Lease Terms"
                                value={detail.lease_terms}
                            />
                        </>
                    )}
                </div>
            </InfoCard>
        </div>
    );
}
