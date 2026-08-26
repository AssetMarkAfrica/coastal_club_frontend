import type { Metadata } from 'next';
import SkybarClient from './SkybarClient';

export const metadata: Metadata = {
    title: 'Sky Bar | Estrella del Mar',
    description: 'Ascend to our vibrant rooftop oasis on the 54th floor. Cocktail artistry meets panoramic city views at the Sky Bar — Estrella del Mar.',
};

export default function SkybarPage() {
    return <SkybarClient />;
}
