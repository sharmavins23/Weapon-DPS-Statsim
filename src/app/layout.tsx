import "@/app/globals.css"; // Import global styles
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
    title: "Warframe DPS StatSim",
    description:
        "A fully featured DPS (and status effect!) simulator for Warframe.",
};

type RootLayoutProps = {
    children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html lang="en" suppressHydrationWarning>
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </>
    );
}
