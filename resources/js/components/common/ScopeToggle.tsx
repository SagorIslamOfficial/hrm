import { Check, Globe, Lock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export interface ScopeOption {
    value: boolean;
    label: string;
    icon: React.ReactNode;
    description?: string;
}

interface ScopeToggleProps {
    isGlobal: boolean;
    onToggle: (isGlobal: boolean) => void;
    scopeOptions?: {
        local: ScopeOption;
        global: ScopeOption;
    };
    triggerClassName?: string;
}

const DEFAULT_SCOPE_OPTIONS = {
    local: {
        value: false,
        label: 'Branch Specific',
        icon: <Lock size={14} />,
        description: 'Only this branch',
    },
    global: {
        value: true,
        label: 'Make Global (All Branches)',
        icon: <Globe size={14} />,
        description: 'Available to all branches',
    },
};

export function ScopeToggle({
    isGlobal,
    onToggle,
    scopeOptions = DEFAULT_SCOPE_OPTIONS,
    triggerClassName = '',
}: ScopeToggleProps) {
    const [isOpen, setIsOpen] = useState(false);

    const currentIcon = isGlobal
        ? scopeOptions.global.icon
        : scopeOptions.local.icon;
    const currentTitle = isGlobal
        ? scopeOptions.global.description || scopeOptions.global.label
        : scopeOptions.local.description || scopeOptions.local.label;

    const handleSelect = (value: boolean) => {
        onToggle(value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                title={currentTitle}
                className={`flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center bg-transparent p-0 hover:bg-transparent hover:text-primary ${triggerClassName}`}
            >
                {currentIcon}
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 z-50 mt-1 w-auto overflow-hidden rounded-md border bg-popover p-2 shadow-md">
                    <Button
                        type="button"
                        variant={!isGlobal ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => handleSelect(false)}
                        className="w-full cursor-pointer justify-start text-red-800"
                    >
                        {scopeOptions.local.icon}
                        <span>{scopeOptions.local.label}</span>
                        {!isGlobal && <Check size={12} className="ml-auto" />}
                    </Button>

                    <Button
                        type="button"
                        variant={isGlobal ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => handleSelect(true)}
                        className="mt-1 w-full cursor-pointer justify-start text-green-800"
                    >
                        {scopeOptions.global.icon}
                        <span>{scopeOptions.global.label}</span>
                        {isGlobal && <Check size={12} className="ml-auto" />}
                    </Button>
                </div>
            )}
        </div>
    );
}
