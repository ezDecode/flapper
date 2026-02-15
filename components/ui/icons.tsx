import Image from "next/image";
import { cn } from "@/lib/utils";

interface IconProps {
    className?: string;
}

export const TwitterXIcon = ({ className }: IconProps) => (
    <Image
        src="/icons/x-twitter.svg"
        alt="X (Twitter)"
        width={20}
        height={20}
        className={cn("object-contain", className)}
    />
);

export const LinkedInIcon = ({ className }: IconProps) => (
    <Image
        src="/icons/linkedin.svg"
        alt="LinkedIn"
        width={20}
        height={20}
        className={cn("object-contain", className)}
    />
);

export const BlueskyIcon = ({ className }: IconProps) => (
    <Image
        src="/icons/bluesky.svg"
        alt="Bluesky"
        width={20}
        height={20}
        className={cn("object-contain", className)}
    />
);
