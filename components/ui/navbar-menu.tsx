"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import * as React from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";


export interface NavbarMenuLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
    description?: string;
    backgroundImage?: string;
    rowSpan?: number;
}

export interface NavbarMenuSection {
    id: string;
    links: NavbarMenuLink[];
    gridLayout?: string;
}

export interface NavbarMenuProps {
    activeMenu: string;
    sections: NavbarMenuSection[];
    onClose?: () => void;
}

export interface NavbarWithMenuProps {
    sections: NavbarMenuSection[];
    navItems?: Array<
        | { type: "link"; label: string; href: string }
        | { type: "dropdown"; label: string; menu: string }
    >;
    logo?: React.ReactNode;
    cta?: React.ReactNode;
}

const ListItem = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        title: string;
        children?: React.ReactNode;
        href: string;
        external?: boolean;
        icon?: React.ReactNode;
        backgroundImage?: string;
        rowSpan?: number;
    }
>(
    (
        {
            className,
            title,
            children,
            href,
            external,
            icon,
            backgroundImage,
            rowSpan,
            ...props
        },
        ref,
    ) => {
        return (
            <li className={cn("list-none", rowSpan === 2 && "row-span-2")}>
                <a
                    ref={ref}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={cn(
                        "group relative flex h-full min-h-18 w-full flex-col justify-center overflow-hidden rounded-2xl bg-transparent p-3.5 leading-none no-underline outline-none transition-all duration-150 select-none hover:bg-white/5 focus:bg-white/5",
                        className,
                    )}
                    {...props}
                >
                    {backgroundImage && (
                        <>
                            <Image
                                fill
                                src={backgroundImage}
                                alt={title}
                                className="absolute inset-0 z-0 h-full w-full object-cover transition-all group-hover:brightness-60"
                            />
                            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                        </>
                    )}
                    <div
                        className={cn(
                            "flex items-start gap-3",
                            backgroundImage && "relative z-[2] mt-auto",
                        )}
                    >
                        {icon && (
                            <span
                                className={cn(
                                    "relative flex min-h-10 min-w-10 items-center justify-center rounded-xl p-2 text-[#00CC55] transition group-hover:text-[#00CC55]",
                                    backgroundImage
                                        ? "bg-white/5 backdrop-blur group-hover:bg-white/10"
                                        : "bg-white/5 group-hover:bg-white/10",
                                )}
                            >
                                {icon}
                            </span>
                        )}
                        <div className="flex h-full flex-col justify-start gap-1 leading-none font-normal text-[#F5F5F5]">
                            {title}

                            {children && (
                                <p
                                    className={cn(
                                        "line-clamp-2 text-sm leading-tight font-normal text-[#555555]",
                                        backgroundImage && "relative z-[2]",
                                    )}
                                >
                                    {children}
                                </p>
                            )}
                        </div>
                    </div>
                </a>
            </li>
        );
    },
);

ListItem.displayName = "ListItem";

export function NavbarMenu({ activeMenu, sections }: NavbarMenuProps) {
    const activeSection = sections.find((section) => section.id === activeMenu);

    if (!activeSection) return null;

    const gridLayout =
        activeSection.gridLayout || "grid w-full grid-cols-2 gap-4";

    return (
        <motion.div
            initial={{ scaleY: 0.95, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0.95, opacity: 0 }}
            transition={{
                ease: [0.19, 1, 0.15, 1.01],
            }}
            className={cn(
                "absolute top-full left-0 z-40 w-full origin-top overflow-hidden rounded-b-2xl border border-t-0 border-[#232323] bg-[#0A0A0A]/95 backdrop-blur-3xl outline-none shadow-xl shadow-black/30"
            )}
        >
            <div className="p-6">
                <ul className={gridLayout}>
                    {activeSection.links.map((link) => (
                        <ListItem
                            key={link.href}
                            href={link.href}
                            title={link.label}
                            external={link.external}
                            icon={link.icon}
                            backgroundImage={link.backgroundImage}
                            rowSpan={link.rowSpan}
                        >
                            {link.description}
                        </ListItem>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}

export function NavbarWithMenu({
    sections,
    navItems,
    logo,
    cta,
}: NavbarWithMenuProps) {
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
        null,
    );
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const defaultNavItems = [
        { type: "dropdown", label: "Product", menu: "product" },
        { type: "dropdown", label: "Resources", menu: "resources" },
        { type: "dropdown", label: "Socials", menu: "socials" },
    ] as const;

    const items = navItems || defaultNavItems;

    const handleNavbarMouseLeave = () => {
        setActiveDropdown(null);
        setHoveredItem(null);
    };

    const handleMouseEnter = (menu: string) => {
        setActiveDropdown(menu);
        setHoveredItem(menu);
    };

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            {/* biome-ignore lint/a11y/noStaticElementInteractions: Hover container for menu, not interactive content */}
            <div
                className="pointer-events-auto relative w-full max-w-[calc(100%-2rem)] md:max-w-2xl rounded-full border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md shadow-lg transition-all duration-300 px-6 md:px-8"
                onMouseLeave={handleNavbarMouseLeave}
            >
                <div
                    className="flex h-14 w-full items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        {logo}
                    </div>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-1 rounded-lg px-1 py-1">
                        {items.map((item) =>
                            item.type === "link" ? (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative flex h-9 cursor-pointer items-center rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/5 font-medium",
                                        hoveredItem === item.label.toLowerCase()
                                            ? "text-[#F5F5F5]"
                                            : "text-[#555555] hover:text-[#F5F5F5]",
                                    )}
                                    onMouseEnter={() => {
                                        setHoveredItem(item.label.toLowerCase());
                                        setActiveDropdown(null);
                                    }}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    key={item.menu}
                                    className="relative flex h-9 cursor-pointer items-center rounded-full px-4 py-2 text-sm text-[#555555] font-medium transition-colors hover:text-[#F5F5F5]"
                                    onMouseEnter={() => handleMouseEnter(item.menu)}
                                >
                                    {hoveredItem === item.menu && (
                                        <div className="absolute inset-0 h-full w-full rounded-full bg-white/5 transition-all duration-300 ease-out" />
                                    )}
                                    <div className="relative z-10 flex items-center gap-2">
                                        <span>
                                            {item.label}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={cn(
                                                "transition duration-200",
                                                hoveredItem === item.menu && "rotate-180",
                                            )}
                                        />
                                    </div>
                                </button>
                            ),
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {cta}
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="flex items-center justify-center p-2 text-[#555555] hover:text-[#F5F5F5] md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <AnimatePresence>
                    {activeDropdown && (
                        <NavbarMenu activeMenu={activeDropdown} sections={sections} />
                    )}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ scaleY: 0.95, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 0.95, opacity: 0 }}
                            transition={{
                                ease: [0.19, 1, 0.15, 1.01],
                            }}
                            className={cn(
                                "absolute top-full left-0 z-40 w-full origin-top overflow-hidden border-b border-[#232323] bg-[#0A0A0A]/95 backdrop-blur-md outline-none md:hidden"
                            )}
                        >
                            <div className="flex flex-col gap-4 p-6">
                                {items.map((item) => (
                                    item.type === "link" ? (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="text-lg font-medium text-[#A0A0A0] hover:text-[#F5F5F5]"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <div key={item.menu} className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#555555] uppercase tracking-wider">{item.label}</span>
                                            <div className="pl-4 flex flex-col gap-2">
                                                {/* Mobile dropdown logic would go here if needed, simplified for now */}
                                                {sections.find(s => s.id === item.menu)?.links.map(link => (
                                                    <a key={link.href} href={link.href} className="text-base text-[#555555] hover:text-[#F5F5F5] py-1">
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                                <div className="mt-4 flex flex-col gap-3 border-t border-[#232323] pt-6">
                                    {/* Render CTA buttons for mobile */}
                                    <div className="flex items-center gap-3">
                                        {/* We can't easily clone the fragment, so we might need to adjust how CTA is passed or valid.
                         For now, assuming CTA content is button-like and responsive or we render a specific mobile set.
                         Actually, let's just render the passed CTA node. It might be a fragment with buttons.
                      */}
                                        {cta}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
