import { useState } from 'react';
import Sidebar from './Sidebar.tsx';
import Canvas from './Canvas.tsx';
import '../styles/Layout.css';

export default function Layout() {

    const [selectedService, setSelectedService] = useState<string | null>(null)

    return (
        <div className="layout">
            <Sidebar selectedService={selectedService} setSelectedService={setSelectedService} />
            <Canvas selectedService={selectedService} setSelectedService={setSelectedService} />
        </div>
    );
}