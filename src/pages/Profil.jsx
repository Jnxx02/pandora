import React from 'react';
import { useDesa } from '../context/DesaContext';

const Profil = () => {
  const { profil } = useDesa();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-1 sm:px-4 py-6">
      <div className="w-full max-w-xl text-center bg-white rounded-2xl shadow p-4 sm:p-8 border border-accent">
        <span className="text-3xl sm:text-4xl mb-4 inline-block">🏠</span>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-primary">{profil.nama}</h1>
        <div className="text-secondary mb-2 text-sm sm:text-base">Kecamatan {profil.kecamatan}, Kabupaten {profil.kabupaten}</div>
        <p className="text-primary mb-4 sm:mb-8 text-sm sm:text-base">{profil.deskripsi}</p>
      </div>
    </div>
  );
};

export default Profil; 