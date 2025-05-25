// src/pages/MasterData.jsx
import React, { useState } from 'react';
import VenueManagement from '../components/management/VenueManagement';
import CityManagement from '../components/management/CityManagement';
import GenreManagement from '../components/management/GenreManagement';
import { Button } from "../components/ui/button"; // Asumsi Anda punya komponen Button

const VenuesCitiesGenres = () => {
    const [activeTab, setActiveTab] = useState('venues');

    const renderContent = () => {
        switch (activeTab) {
            case 'venues':
                return <VenueManagement />;
            case 'cities':
                return <CityManagement />;
            case 'genres':
                return <GenreManagement />;
            default:
                return <CityManagement />;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Venue, Kota, Genre</h1>

            <div className="flex space-x-4 mb-6 border-b pb-2">
                <Button
                    variant={activeTab === 'venues' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('venues')}
                >
                    Venue
                </Button>
                <Button
                    variant={activeTab === 'cities' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('cities')}
                >
                    Kota
                </Button>
                <Button
                    variant={activeTab === 'genres' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('genres')}
                >
                    Genre
                </Button>
            
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {renderContent()}
            </div>
        </div>
    );
};

export default VenuesCitiesGenres;