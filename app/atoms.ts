import { atom } from 'jotai';

export const isDevModeAtom = atom(process.env.NODE_ENV === 'development');