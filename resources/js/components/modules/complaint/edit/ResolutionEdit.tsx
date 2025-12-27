import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ComplaintResolution } from '@/types/complaint';
import { Star } from 'lucide-react';

interface ResolutionEditProps {
    data: Partial<ComplaintResolution>;
    errors: Record<string, string>;
    setData: <K extends keyof ComplaintResolution>(
        key: K,
        value: ComplaintResolution[K],
    ) => void;
}

export default function ResolutionEdit({
    data,
    errors,
    setData,
}: ResolutionEditProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resolution Details</CardTitle>
                <CardDescription>
                    Document how this complaint was resolved
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="resolution_summary">
                        Resolution Summary*
                    </Label>
                    <Textarea
                        id="resolution_summary"
                        value={data.resolution_summary || ''}
                        onChange={(e) =>
                            setData('resolution_summary', e.target.value)
                        }
                        placeholder="Provide a summary of how the complaint was resolved..."
                        rows={4}
                        required
                    />
                    {errors.resolution_summary && (
                        <p className="text-sm text-destructive">
                            {errors.resolution_summary}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="actions_taken">Actions Taken*</Label>
                    <Textarea
                        id="actions_taken"
                        value={data.actions_taken || ''}
                        onChange={(e) =>
                            setData('actions_taken', e.target.value)
                        }
                        placeholder="Describe the actions taken to resolve this complaint..."
                        rows={4}
                        required
                    />
                    {errors.actions_taken && (
                        <p className="text-sm text-destructive">
                            {errors.actions_taken}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="preventive_measures">
                        Preventive Measures
                    </Label>
                    <Textarea
                        id="preventive_measures"
                        value={data.preventive_measures || ''}
                        onChange={(e) =>
                            setData('preventive_measures', e.target.value)
                        }
                        placeholder="What measures will be taken to prevent this from happening again?"
                        rows={3}
                    />
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-medium">Complainant Satisfaction</h4>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="satisfactory_to_complainant"
                            checked={data.satisfactory_to_complainant || false}
                            onCheckedChange={(checked) =>
                                setData(
                                    'satisfactory_to_complainant',
                                    checked as boolean,
                                )
                            }
                        />
                        <Label htmlFor="satisfactory_to_complainant">
                            Resolution was satisfactory to the complainant
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label>Satisfaction Rating</Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                        setData('satisfaction_rating', star)
                                    }
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-6 w-6 cursor-pointer transition-colors ${
                                            star <=
                                            (data.satisfaction_rating || 0)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300 hover:text-yellow-200'
                                        }`}
                                    />
                                </button>
                            ))}
                            {data.satisfaction_rating && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {data.satisfaction_rating}/5
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainant_feedback">
                            Complainant Feedback
                        </Label>
                        <Textarea
                            id="complainant_feedback"
                            value={data.complainant_feedback || ''}
                            onChange={(e) =>
                                setData('complainant_feedback', e.target.value)
                            }
                            placeholder="Any feedback from the complainant about the resolution..."
                            rows={3}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="resolved_at">Resolution Date</Label>
                    <Input
                        id="resolved_at"
                        type="datetime-local"
                        value={
                            data.resolved_at
                                ? new Date(data.resolved_at)
                                      .toISOString()
                                      .slice(0, 16)
                                : ''
                        }
                        onChange={(e) =>
                            setData(
                                'resolved_at',
                                e.target.value
                                    ? new Date(e.target.value).toISOString()
                                    : undefined,
                            )
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}
