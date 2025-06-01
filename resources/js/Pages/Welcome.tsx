import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

type WelcomeProps = PageProps<{
    laravelVersion: string;
    phpVersion: string;
    qr: string;
}>;

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    qr,
}: WelcomeProps) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-200 text-black/80 dark:bg-gray-900 dark:text-white/80 min-h-screen flex flex-col">
                {/* Header fixed */}
                <header className="fixed top-0 left-0 w-full bg-gray-50 dark:bg-gray-900 shadow-md z-50">
                    <div className="max-w-md mx-auto flex items-center justify-between px-4 py-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Sistem Antrian
                        </h1>
                        <nav>
                            {auth?.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="rounded-md px-5 py-2 text-[#FF2D20] font-semibold hover:bg-[#FF2D20]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D20]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="rounded-md px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D20]"
                                >
                                    Log in
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Konten utama */}
                <div className="flex-grow flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto w-full pt-20">
                    <main className="w-full">
                        <section className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 flex flex-col items-center space-y-6 max-w-sm mx-auto">
                            <p className="text-center text-gray-900 dark:text-gray-200 font-semibold text-lg">
                                Scan QR ini untuk ambil antrian:
                            </p>

                            <img
                                className="w-48 h-48 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
                                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                                    qr
                                )}&size=200x200`}
                                alt="QR Code"
                                onError={handleImageError}
                            />

                            <p className="text-center text-xs text-gray-600 dark:text-gray-400 break-words select-all px-2">
                                {qr}
                            </p>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
