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

const springTransition = { type: "spring" as const, stiffness: 380, damping: 30 };

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
                        "group relative flex h-full min-h-[44px] w-full flex-col justify-center overflow-hidden rounded-2xl bg-transparent p-3.5 leading-none no-underline outline-none transition-all duration-[350ms] select-none hover:bg-white/[0.06] focus:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
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
                "absolute top-full left-0 z-40 w-full origin-top overflow-hidden rounded-b-2xl border-x border-b border-white/[0.08] bg-surface-alt/80 backdrop-blur-2xl backdrop-saturate-[1.8] outline-none shadow-2xl shadow-black/40"
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

/* ── Hook: lock body scroll when mobile menu is open ─── */
function useBodyScrollLock(locked: boolean) {
    React.useEffect(() => {
        if (!locked) return;
        const scrollY = window.scrollY;
        const body = document.body;
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.overflow = "hidden";
        return () => {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.overflow = "";
            window.scrollTo(0, scrollY);
        };
    }, [locked]);
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

    // Lock body scroll when mobile menu is open
    useBodyScrollLock(mobileMenuOpen);

    // Close mobile menu on Escape key
    React.useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileMenuOpen]);

    // Close mobile menu on window resize past mobile breakpoint
    React.useEffect(() => {
        if (!mobileMenuOpen) return;
        const onResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [mobileMenuOpen]);

    // Close mobile menu on hash change (anchor navigation)
    React.useEffect(() => {
        const onHash = () => setMobileMenuOpen(false);
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);

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
        <>
            {/* Backdrop overlay for mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none",
                    "pt-[max(0.75rem,env(safe-area-inset-top))]",
                    "md:pt-[max(1.5rem,env(safe-area-inset-top))]",
                )}
            >
                {/* biome-ignore lint/a11y/noStaticElementInteractions: Hover container for menu, not interactive content */}
                <div
                    className={cn(
                        "pointer-events-auto relative transition-all duration-[350ms]",
                        // ── Sizing per breakpoint ──
                        "w-[calc(100%-1rem)] max-w-none",          // <640px: nearly full-width, 8px each side
                        "sm:w-[calc(100%-2rem)]",                   // 640-767px: 16px each side
                        "md:w-auto md:min-w-[600px] md:max-w-2xl", // 768-1023px: auto-sized, min 600px
                        "lg:min-w-[680px] lg:max-w-3xl",           // 1024+: wider for large screens
                        // ── Shape ──
                        "rounded-[22px] md:rounded-full",
                        // ── Apple frosted glass ──
                        "border border-white/[0.08]",
                        "bg-surface-alt/70 backdrop-blur-2xl backdrop-saturate-[1.8]",
                        "shadow-[0_2px_20px_rgba(0,0,0,0.25),inset_0_0.5px_0_0_rgba(255,255,255,0.06)]",
                        // ── Padding ──
                        "px-4 sm:px-5 md:px-6",
                    )}
                    onMouseLeave={handleNavbarMouseLeave}
                >
                    <nav
                        className="flex h-12 sm:h-14 w-full items-center justify-between"
                        role="navigation"
                        aria-label="Main navigation"
                    >
                        {/* ── Logo ── */}
                        <div className="flex items-center gap-2 shrink-0">
                            {logo}
                        </div>

                        {/* ── DESKTOP NAV ── */}
                        <LayoutGroup id="navbar-pill">
                            <div className="hidden md:flex items-center gap-0.5 lg:gap-1 rounded-lg px-1 py-1">
                                {items.map((item) =>
                                    item.type === "link" ? (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "relative flex h-9 cursor-pointer items-center rounded-full px-3 lg:px-4 py-2 text-[13px] lg:text-sm font-medium will-change-transform transition-colors duration-[350ms]",
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
                                                    className="absolute inset-0 h-full w-full rounded-full bg-white/[0.06]"
                                                    transition={springTransition}
                                                />
                                            )}
                                            <span className="relative z-10">{item.label}</span>
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            key={item.menu}
                                            className="relative flex h-9 cursor-pointer items-center rounded-full px-3 lg:px-4 py-2 text-[13px] lg:text-sm text-muted-foreground font-medium transition-colors duration-[350ms] hover:text-foreground will-change-transform"
                                            onMouseEnter={() => handleMouseEnter(item.menu)}
                                        >
                                            {hoveredItem === item.menu && (
                                                <motion.div
                                                    layoutId="navbar-hover-pill"
                                                    className="absolute inset-0 h-full w-full rounded-full bg-white/[0.06]"
                                                    transition={springTransition}
                                                />
                                            )}
                                            <div className="relative z-10 flex items-center gap-1.5 lg:gap-2">
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

                        {/* ── DESKTOP CTA ── */}
                        <div className="hidden md:flex items-center gap-1.5 shrink-0">
                            {cta}
                        </div>

                        {/* ── MOBILE HAMBURGER ── */}
                        <button
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all duration-[350ms] md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        <X size={20} strokeWidth={2.5} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                    >
                                        <Menu size={20} strokeWidth={2} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </nav>

                    {/* ── DESKTOP DROPDOWN ── */}
                    <AnimatePresence>
                        {activeDropdown && (
                            <NavbarMenu activeMenu={activeDropdown} sections={sections} />
                        )}
                    </AnimatePresence>

                    {/* ── MOBILE MENU PANEL ── */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    height: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
                                    opacity: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
                                }}
                                className="overflow-hidden md:hidden"
                            >
                                {/* Top separator */}
                                <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                                <motion.div
                                    className="flex flex-col gap-1 px-1 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: {},
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.04,
                                                delayChildren: 0.05,
                                            },
                                        },
                                    }}
                                >
                                    {/* ── Nav links ── */}
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.type === "link" ? item.href : item.menu}
                                            variants={{
                                                hidden: { opacity: 0, y: 8 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                            transition={springTransition}
                                        >
                                            {item.type === "link" ? (
                                                <a
                                                    href={item.href}
                                                    className="flex items-center min-h-[44px] px-3 py-2.5 rounded-xl text-[17px] font-medium text-foreground/80 hover:text-foreground hover:bg-white/[0.06] transition-all duration-[350ms]"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-3 px-3 py-2">
                                                        <span className="h-px w-3 bg-accent/40" />
                                                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 pl-2">
                                                        {sections.find(s => s.id === item.menu)?.links.map(link => (
                                                            <a
                                                                key={link.href}
                                                                href={link.href}
                                                                className="flex items-center gap-3 min-h-[44px] px-3 py-2 text-[15px] text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/[0.06] transition-all duration-[350ms]"
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                {link.icon && (
                                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.06] text-muted-foreground">
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

                                    {/* ── Mobile CTA buttons ── */}
                                    <motion.div
                                        className="flex flex-col gap-2.5 mt-3 pt-4 mx-1 border-t border-white/[0.06]"
                                        variants={{
                                            hidden: { opacity: 0, y: 4 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                        transition={{ ...springTransition, delay: 0.12 }}
                                    >
                                        {/* Wrap CTA children to make them full-width on mobile */}
                                        <div className="flex flex-col gap-2.5 [&>*]:w-full [&>*]:justify-center">
                                            {cta}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
