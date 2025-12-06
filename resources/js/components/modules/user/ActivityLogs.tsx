import { InfoCard } from '@/components/common';
import { formatDateTimeForDisplay } from '@/components/common/utils/dateUtils';
import { type UserActivityLog } from '@/components/modules/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { activityLogs } from '@/routes/users';
import { useEffect, useState } from 'react';

interface ActivityLogsProps {
    userId: number;
}

export function ActivityLogs({ userId }: ActivityLogsProps) {
    const [logs, setLogs] = useState<UserActivityLog[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(
                    `${activityLogs({ user: userId }).url}?page=${page}`,
                );
                const data = await response.json();
                setLogs(data.data || []);
                setHasMore(!!data.next_page_url);
            } catch (error) {
                console.error('Failed to fetch activity logs:', error);
            }
        };

        fetchLogs();
    }, [userId, page]);

    const getActionBadgeColor = (
        action: UserActivityLog['action'],
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (action) {
            case 'add':
                return 'default';
            case 'edit':
                return 'secondary';
            case 'delete':
                return 'destructive';
            case 'link_employee':
            case 'unlink_employee':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const formatAction = (action: string) => {
        return action
            .replace(/_/g, ' ')
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <InfoCard title="Activity Log" description="User actions and changes">
            {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No activity logs yet
                </p>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <Card key={log.id} className="py-[12px]">
                                <CardContent>
                                    <div className="space-y-2">
                                        {/* First line: Badge, Description, Timestamp */}
                                        <div className="flex items-start gap-2">
                                            <Badge
                                                variant={getActionBadgeColor(
                                                    log.action,
                                                )}
                                                className="mt-0.5 shrink-0"
                                            >
                                                {formatAction(log.action)}
                                            </Badge>

                                            <p className="flex-1 text-sm leading-relaxed">
                                                {log.description
                                                    .split(', ')
                                                    .map((item, idx) => (
                                                        <span key={idx}>
                                                            {item.match(
                                                                /^Updated:/,
                                                            ) ? (
                                                                <>
                                                                    <span className="font-medium text-foreground">
                                                                        Updated:
                                                                    </span>
                                                                    <span className="ml-1 inline-flex flex-wrap gap-2">
                                                                        {item
                                                                            .replace(
                                                                                'Updated: ',
                                                                                '',
                                                                            )
                                                                            .split(
                                                                                ', ',
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    field,
                                                                                    i,
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        className="inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                                                                    >
                                                                                        {
                                                                                            field
                                                                                        }
                                                                                    </span>
                                                                                ),
                                                                            )}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-foreground">
                                                                    {item}
                                                                </span>
                                                            )}
                                                        </span>
                                                    ))}
                                            </p>

                                            <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
                                                {formatDateTimeForDisplay(
                                                    log.created_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {(log.changed_data || log.causer_name) && (
                                        <details className="mt-2 text-xs text-muted-foreground">
                                            <summary className="cursor-pointer">
                                                Details
                                            </summary>
                                            <div className="mt-2 space-y-1 rounded bg-muted p-2">
                                                <div className="float-end mb-2 pb-2">
                                                    <span className="font-semibold text-primary capitalize">
                                                        Changed by:{' '}
                                                    </span>
                                                    <span className="font-semibold text-foreground">
                                                        {log.causer_name ||
                                                            'System'}
                                                    </span>
                                                    {log.causer_id && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {' '}
                                                            (ID: {log.causer_id}
                                                            )
                                                        </span>
                                                    )}
                                                </div>
                                                {log.changed_data &&
                                                    Object.entries(
                                                        log.changed_data,
                                                    ).map(([key, value]) => {
                                                        if (
                                                            typeof value ===
                                                            'object'
                                                        ) {
                                                            const change =
                                                                value as {
                                                                    from:
                                                                        | string
                                                                        | null;
                                                                    to:
                                                                        | string
                                                                        | null;
                                                                };
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className="border-l-2 border-muted-foreground/30 py-1 pl-2"
                                                                >
                                                                    <div className="font-semibold text-foreground capitalize">
                                                                        {key.replace(
                                                                            /_/g,
                                                                            ' ',
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        From:{' '}
                                                                        <span className="font-mono">
                                                                            {change.from ||
                                                                                '(empty)'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs">
                                                                        To:{' '}
                                                                        <span className="font-mono">
                                                                            {change.to ||
                                                                                '(empty)'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div
                                                                key={key}
                                                                className="text-xs"
                                                            >
                                                                <span className="font-semibold capitalize">
                                                                    {key.replace(
                                                                        /_/g,
                                                                        ' ',
                                                                    )}
                                                                </span>
                                                                :{' '}
                                                                {String(value)}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </details>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasMore}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </InfoCard>
    );
}
