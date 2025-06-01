import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

type Antrian = {
    id: number;
    nomor_antrian: string;
    status: string;
};

type DashboardProps = {
    antrians: Antrian[];
    qr: string;
};

export default function Dashboard({
    antrians: initialAntrians,
    qr,
}: DashboardProps) {
    const [antrians, setAntrians] = useState(initialAntrians);
    const { post } = useForm();

    useEffect(() => {
        const channel = window.Echo?.channel("antrian");

        const updateHandler = (e: any) => {
            const data = e.antrian ?? e; // Ambil data dari payload
            console.log("📡 Event diterima di dashboard:", data);

            setAntrians((prev) => {
                const existing = prev.find((a) => a.id === data.id);
                if (existing) {
                    // update data
                    return prev.map((a) => (a.id === data.id ? data : a));
                } else {
                    // data baru: tambahkan
                    return [...prev, data];
                }
            });
        };

        channel?.listen(".AntrianUpdated", updateHandler);

        return () => {
            channel?.stopListening(".AntrianUpdated", updateHandler);
        };
    }, []);

    useEffect(() => {
        setAntrians(initialAntrians);
    }, [initialAntrians]);

    const handleProses = (id: number) => {
        post(`/admin/antrian/${id}/proses`);
    };

    const handleSelesai = (id: number) => {
        post(`/admin/antrian/${id}/selesai`);
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "selesai":
                return "text-green-600 font-semibold";
            case "dipanggil":
                return "text-yellow-600 font-semibold";
            case "menunggu":
                return "text-blue-600 font-semibold";
            default:
                return "text-gray-600";
        }
    };

    const antrianSekarang = antrians.find(
        (a) => a.status.toLowerCase() === "dipanggil"
    );

    const antrianSelanjutnya = antrians
        .filter((a) => a.status.toLowerCase() === "menunggu")
        .sort((a, b) => a.nomor_antrian.localeCompare(b.nomor_antrian));

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <main className="max-w-3xl mx-auto p-6">
                {/* QR Section */}
                <section className="mb-8 flex flex-col items-center">
                    <p className="mb-2 text-gray-700 dark:text-gray-300 text-center">
                        Scan QR ini untuk ambil antrian:
                    </p>
                    <img
                        className="w-48 h-48 rounded-lg border border-gray-300 shadow-md"
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                            qr
                        )}&size=200x200`}
                        alt="QR Code"
                    />
                    <p className="mt-2 text-xs text-gray-500 break-words max-w-xs text-center">
                        {qr}
                    </p>
                </section>

                {/* Antrian Sekarang */}
                <section className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">
                        Antrian Sekarang
                    </h2>
                    {antrianSekarang ? (
                        <div className="p-4 border rounded-lg shadow bg-yellow-50 dark:bg-yellow-900">
                            <p className="text-xl font-bold">
                                {antrianSekarang.nomor_antrian}
                            </p>
                            <p
                                className={getStatusClass(
                                    antrianSekarang.status
                                )}
                            >
                                {antrianSekarang.status}
                            </p>
                            <button
                                onClick={() =>
                                    handleSelesai(antrianSekarang.id)
                                }
                                className="mt-3 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                            >
                                Tandai Selesai
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Tidak ada antrian sedang proses.
                        </p>
                    )}
                </section>

                {/* Antrian Selanjutnya */}
                <section>
                    <h2 className="text-lg font-semibold mb-2">
                        Antrian Selanjutnya
                    </h2>
                    {antrianSelanjutnya.length === 0 ? (
                        <p className="text-gray-500">
                            Tidak ada antrian menunggu.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {antrianSelanjutnya.map((a) => (
                                <div
                                    key={a.id}
                                    className="flex justify-between items-center p-4 border rounded-lg shadow bg-blue-50 dark:bg-blue-900"
                                >
                                    <div>
                                        <p className="text-lg font-semibold">
                                            {a.nomor_antrian}
                                        </p>
                                        <p className={getStatusClass(a.status)}>
                                            {a.status}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleProses(a.id)}
                                        className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
                                    >
                                        Panggil
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </AuthenticatedLayout>
    );
}
