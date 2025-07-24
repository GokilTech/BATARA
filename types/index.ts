import { Feather } from '@expo/vector-icons';

export type ModuleType = {
    id: number;
    title: string;
    lessons: string;
    icon: keyof typeof Feather.glyphMap;
    locked: boolean;
    progress: number;
};

export type LanguageDataType = {
    title: string;
    image: any;
    modules: ModuleType[];
};

export type LearningDataContainer = {
    [key: string]: LanguageDataType;
};
