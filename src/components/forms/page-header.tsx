// components/Header.tsx
import Image from "next/image";
import { Badge } from "../ui/badge";

interface HeaderProps {
    title: string;
    mode: string;
    lastModified: string;
    modifiedBy: string;
    role: string;
    description: string
}

export default function PageHeader({
    title,
    mode,
    lastModified,
    modifiedBy,
    role,
    description
}: HeaderProps) {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center md:items-start p-4 border-b bg-white mb-5">
            {/* LEFT: Logo */}
            <div className="mb-4 md:mb-0">
                <img
                    src="/images/logos.png"
                    alt="DSWD KC BAGONG PILIPINAS"
                    className="h-12 w-auto mx-auto md:mx-0"
                />
            </div>

            {/* RIGHT: Info Block */}
            <div className="text-center md:text-right">
                {/* Title + Mode */}
                <div className="font-semibold text-lg flex items-center justify-center md:justify-end gap-2 flex-wrap">
                    {title}
                    {mode && <Badge variant="secondary">{mode}</Badge>}
                </div>

                {/* Description (optional) */}
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}

                {/* Metadata */}
                {lastModified && (
                    <div className="text-xs text-gray-500">
                        Last modified: {lastModified}
                    </div>
                )}

                {modifiedBy && (
                    <div className="text-xs text-gray-500">
                        Modified by: <span className="font-medium">{modifiedBy}</span>
                        {role && ` • ${role}`}
                    </div>
                )}
            </div>
        </header>



    );
}
