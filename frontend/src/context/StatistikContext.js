import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Impor Supabase client

const StatistikContext = createContext();

export const useStatistik = () => useContext(StatistikContext);

// Data awal sebagai fallback jika localStorage kosong atau rusak
const initialStatistik = [
  { icon: '👥', label: 'Penduduk', value: '0' },
  { icon: '👨', label: 'Laki-Laki', value: '0' },
  { icon: '👩', label: 'Perempuan', value: '0' },
  { icon: '🏠', label: 'Kepala Keluarga', value: '0' },
  { icon: '📍', label: 'Diccekang', value: '0' },
  { icon: '📍', label: 'Tompo Balang', value: '0' },
  { icon: '📍', label: 'Tamalate', value: '0' },
  { icon: '📍', label: 'Tammu-Tammu', value: '0' },
  { icon: '📍', label: 'Moncongloe Bulu', value: '0' },
];

export const StatistikProvider = ({ children }) => {
    const [statistik, setStatistik] = useState([]);
    const [loading, setLoading] = useState(true);

    const refetchStatistik = useCallback(async () => {
        setLoading(true);
        try {
            // Ambil data dari tabel 'statistik' di Supabase, urutkan berdasarkan kolom 'urutan'
            const { data, error } = await supabase
                .from('statistik')
                .select('*')
                .order('urutan', { ascending: true });

            if (error) {
                throw error;
            }
            
            setStatistik(data || []);

        } catch (error) {
            console.error("Gagal memuat statistik dari Supabase:", error);
            setStatistik(initialStatistik);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetchStatistik();
    }, [refetchStatistik]);

    const value = { statistik, refetchStatistik, loading };

    return <StatistikContext.Provider value={value}>{children}</StatistikContext.Provider>;
};
