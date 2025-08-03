import type { SyntheticEvent } from 'react';

export interface MobileNavigationProps {
    path: string;
    handleNavigation: (event: SyntheticEvent, newValue: string) => void;
}