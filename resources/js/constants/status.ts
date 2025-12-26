export const STATUS_ACTIVE = 'active';
export const STATUS_INACTIVE = 'inactive';
export const STATUS_TERMINATED = 'terminated';
export const STATUS_ON_LEAVE = 'on_leave';

export type StatusValue =
    | typeof STATUS_ACTIVE
    | typeof STATUS_INACTIVE
    | typeof STATUS_TERMINATED
    | typeof STATUS_ON_LEAVE;

interface StatusConfig {
    label: string;
    color: string;
}

export const STATUS_CONFIG: Record<StatusValue, StatusConfig> = {
    [STATUS_ACTIVE]: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    [STATUS_INACTIVE]: {
        label: 'Inactive',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
    [STATUS_TERMINATED]: {
        label: 'Terminated',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    [STATUS_ON_LEAVE]: {
        label: 'On Leave',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
};

// Derive other exports from STATUS_CONFIG
export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(
    ([value, config]) => ({
        value: value as StatusValue,
        label: config.label,
    }),
);

export const STATUS_LABELS: Record<StatusValue, string> = Object.fromEntries(
    Object.entries(STATUS_CONFIG).map(([key, config]) => [key, config.label]),
) as Record<StatusValue, string>;

export const STATUS_COLORS: Record<StatusValue, string> = Object.fromEntries(
    Object.entries(STATUS_CONFIG).map(([key, config]) => [key, config.color]),
) as Record<StatusValue, string>;
