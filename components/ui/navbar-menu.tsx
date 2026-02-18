"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
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

const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

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
            <motion.li
                className={cn("list-none", rowSpan === 2 && "row-span-2")}
                variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={springTransition}
            >
                <a
                    ref={ref}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className={cn(
                        "group relative flex h-full min-h-18 w-full flex-col justify-center overflow-hidden rounded-2xl bg-transparent p-3.5 leading-none no-underline outline-none transition-all duration-150 select-none hover:bg-white/5 focus:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
                        className,
                    )}
                    {...props}
                >
                    {/* Left accent bar on hover */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-0.5 rounded-full bg-accent transition-all duration-200 group-hover:h-1/2" />

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
                            "flex items-start gap-3 transition-transform duration-200 group-hover:translate-x-0.5",
                            backgroundImage && "relative z-[2] mt-auto",
                        )}
                    >
                        {icon && (
                            <span
                                className={cn(
                                    "relative flex min-h-10 min-w-10 items-center justify-center rounded-xl p-2 text-foreground transition-all duration-200 group-hover:text-foreground",
                                    backgroundImage
                                        ? "bg-white/5 backdrop-blur group-hover:bg-white/10"
                                        : "bg-white/5 group-hover:bg-white/10",
                                )}
                            >
                                {icon}
                            </span>
                        )}
                        <div className="flex h-full flex-col justify-start gap-1 leading-none font-normal text-foreground">
                            {title}

                            {children && (
                                <p
                                    className={cn(
                                        "line-clamp-2 text-sm leading-tight font-normal text-muted-foreground",
                                        backgroundImage && "relative z-[2]",
                                    )}
                                >
                                    {children}
                                </p>
                            )}
                        </div>
                    </div>
                </a>
            </motion.li>
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
            initial={{ scaleY: 0.95, opacity: 0, y: -8 }}
            animate={{ scaleY: 1, opacity: 1, y: 0 }}
            exit={{ scaleY: 0.95, opacity: 0, y: -8 }}
            transition={{
                ease: [0.19, 1, 0.15, 1.01],
            }}
            className={cn(
                "absolute top-full left-0 z-40 w-full origin-top overflow-hidden rounded-b-xl border-x border-b border-white/[0.06] bg-surface-alt/95 backdrop-blur-3xl outline-none shadow-2xl shadow-black/40"
            )}
        >
            {/* Top accent gradient line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="p-6">
                <motion.ul
                    className={gridLayout}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.04,
                            },
                        },
                    }}
                >
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
                </motion.ul>
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
                className="pointer-events-auto relative w-full max-w-[calc(100%-2rem)] md:max-w-2xl rounded-full border border-white/[0.06] bg-surface-alt/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300 px-6 md:px-8"
                onMouseLeave={handleNavbarMouseLeave}
            >
                <div
                    className="flex h-14 w-full items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        {logo}
                    </div>

                    {/* DESKTOP NAV */}
                    <LayoutGroup id="navbar-pill">
                        <div className="hidden md:flex items-center gap-1 rounded-lg px-1 py-1">
                            {items.map((item) =>
                                item.type === "link" ? (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "relative flex h-9 cursor-pointer items-center rounded-full px-4 py-2 text-sm font-medium will-change-transform",
                                            hoveredItem === item.label.toLowerCase()
                                                ? "text-foreground"
                                                : "text-muted-foreground hover:text-foreground",
                                        )}
                                        onMouseEnter={() => {
                                            setHoveredItem(item.label.toLowerCase());
                                            setActiveDropdown(null);
                                        }}
                                    >
                                        {hoveredItem === item.label.toLowerCase() && (
                                            <motion.div
                                                layoutId="navbar-hover-pill"
                                                className="absolute inset-0 h-full w-full rounded-full bg-white/5"
                                                transition={springTransition}
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </a>
                                ) : (
                                    <button
                                        type="button"
                                        key={item.menu}
                                        className="relative flex h-9 cursor-pointer items-center rounded-full px-4 py-2 text-sm text-muted-foreground font-medium transition-colors hover:text-foreground will-change-transform"
                                        onMouseEnter={() => handleMouseEnter(item.menu)}
                                    >
                                        {hoveredItem === item.menu && (
                                            <motion.div
                                                layoutId="navbar-hover-pill"
                                                className="absolute inset-0 h-full w-full rounded-full bg-white/5"
                                                transition={springTransition}
                                            />
                                        )}
                                        <div className="relative z-10 flex items-center gap-2">
                                            <span>
                                                {item.label}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: hoveredItem === item.menu ? 180 : 0 }}
                                                transition={springTransition}
                                            >
                                                <ChevronDown size={14} />
                                            </motion.div>
                                        </div>
                                    </button>
                                ),
                            )}
                        </div>
                    </LayoutGroup>

                    <div className="hidden md:flex items-center gap-2">
                        {cta}
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="relative flex items-center justify-center p-2 text-muted-foreground hover:text-foreground md:hidden overflow-hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ opacity: 0, rotate: 90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                <AnimatePresence>
                    {activeDropdown && (
                        <NavbarMenu activeMenu={activeDropdown} sections={sections} />
                    )}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ scaleY: 0.95, opacity: 0, y: -8 }}
                            animate={{ scaleY: 1, opacity: 1, y: 0 }}
                            exit={{ scaleY: 0.95, opacity: 0, y: -8 }}
                            transition={{
                                ease: [0.19, 1, 0.15, 1.01],
                            }}
                            className={cn(
                                "absolute top-full left-0 z-40 w-full origin-top overflow-hidden rounded-b-xl border-x border-b border-white/[0.06] bg-surface-alt/95 backdrop-blur-md outline-none md:hidden shadow-2xl shadow-black/40"
                            )}
                        >
                            {/* Top accent gradient line — matches desktop dropdown */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                            <motion.div
                                className="flex flex-col gap-4 p-6"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                        },
                                    },
                                }}
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.type === "link" ? item.href : item.menu}
                                        variants={{
                                            hidden: { opacity: 0, y: 8 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        transition={springTransition}
                                    >
                                        {index > 0 && (
                                            <div className="mb-4 h-px w-full bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent" />
                                        )}
                                        {item.type === "link" ? (
                                            <a
                                                href={item.href}
                                                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="h-px w-4 bg-accent/50" />
                                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
                                                </div>
                                                <div className="pl-4 flex flex-col gap-1">
                                                    {sections.find(s => s.id === item.menu)?.links.map(link => (
                                                        <a
                                                            key={link.href}
                                                            href={link.href}
                                                            className="flex items-center gap-3 text-base text-muted-foreground hover:text-foreground py-2 transition-colors rounded-lg hover:bg-white/[0.03] px-2 -mx-2"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {link.icon && (
                                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                                                                    {link.icon}
                                                                </span>
                                                            )}
                                                            <span>{link.label}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-6"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 },
                                    }}
                                    transition={{ ...springTransition, delay: 0.15 }}
                                >
                                    <div className="flex items-center gap-3">
                                        {cta}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
