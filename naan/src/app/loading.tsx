export default function Loading() {
    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(237, 236, 255, 1)" }}
        >
            {/* Subtle gradient blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C7D2FE] blur-[120px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[50%] rounded-full bg-[#FBCFE8] blur-[120px] opacity-30" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Logo */}
                <span className="text-5xl font-normal text-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    W
                </span>

                {/* Spinner */}
                <div className="relative w-10 h-10">
                    <div
                        className="absolute inset-0 rounded-full border-[3px] border-[#e8e6f0]"
                    />
                    <div
                        className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#3b28cc] animate-spin"
                    />
                </div>

                {/* Text */}
                <p className="text-sm text-[#888] font-medium tracking-wide" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Loading...
                </p>
            </div>
        </div>
    );
}
