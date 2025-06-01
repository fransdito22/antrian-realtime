import { useEffect, useState, useRef } from "react";

// Untuk TypeScript, agar window.Echo dikenali
declare global {
    interface Window {
        Echo: any;
    }
}

type TiketProps = {
    nomor_antrian: string;
};

export default function Tiket({ nomor_antrian }: TiketProps) {
    const [notif, setNotif] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("menunggu");
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [notifAktif, setNotifAktif] = useState<boolean>(false);

    const dipanggilAudio = useRef(new Audio("/sound/dipanggil.mp3"));
    dipanggilAudio.current.preload = "auto";

    const aktifkanNotifikasi = () => {
        setNotifAktif(true);
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.Echo) {
            console.log("✅ Echo tersedia, mulai listening...");

            const channel = window.Echo.channel("antrian");

            const listener = (e: { nomor_antrian: string; status: string }) => {
                console.log("🔔 Event diterima Tiket:", e);

                if (e.nomor_antrian !== nomor_antrian) return;

                const normalizedStatus = e.status.toLowerCase();

                if (normalizedStatus === "dipanggil") {
                    setStatus("dipanggil");
                    const message = `Giliran Anda, nomor antrian ${nomor_antrian}`;
                    setNotif(message);

                    // Suara hanya jika notifikasi audio diaktifkan
                    if (notifAktif) {
                        dipanggilAudio.current
                            .play()
                            .catch((err) =>
                                console.warn("Audio play error:", err)
                            );
                    }

                    setTimeout(() => setNotif(null), 5000);
                }

                if (normalizedStatus === "selesai") {
                    setStatus("selesai");
                    const message = `Nomor antrian ${nomor_antrian} telah selesai. Terima kasih!`;
                    setNotif(message);
                    setIsFinished(true);

                    setTimeout(() => setNotif(null), 7000);
                }
            };

            channel.listen(".AntrianUpdated", listener);

            return () => {
                console.log("🛑 Bersihkan listener");
                channel.stopListening(".AntrianUpdated", listener);
            };
        } else {
            console.warn("❌ window.Echo belum tersedia");
        }
    }, [nomor_antrian, notifAktif]);

    return (
        <div className="flex flex-col justify-center items-center h-screen text-center px-4">
            <h1 className="text-3xl font-bold mb-2">Nomor Antrian Anda</h1>
            <div className="text-6xl text-blue-500 font-mono">
                {nomor_antrian}
            </div>

            <p className="mt-2 text-lg">
                Status:{" "}
                <span className="font-semibold capitalize">{status}</span>
            </p>

            <p className="mt-4">
                {isFinished
                    ? "Terima kasih telah menunggu. Anda sudah selesai."
                    : "Silakan tunggu hingga nomor Anda dipanggil."}
            </p>

            {!notifAktif ? (
                <button
                    onClick={aktifkanNotifikasi}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Aktifkan Notifikasi Suara
                </button>
            ) : (
                <button
                    disabled
                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed"
                >
                    Notifikasi Suara Aktif!
                </button>
            )}

            {notif && (
                <div className="fixed top-5 right-5 bg-yellow-300 border border-yellow-600 text-yellow-900 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
                    {notif}
                </div>
            )}
        </div>
    );
}
