"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { HomeIcon, Moon, Sun, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { CartesianGrid, Dot, Line, LineChart } from "recharts";

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
        color: "hsl(var(--chart-2))",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

export default function Home() {
    const { setTheme } = useTheme();

    return (
        <div>
            {/* Page Topper */}
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <b>Warframe DPS StatSim</b>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <HomeIcon className="h-[1.2rem] w-[1.2rem] mr-1" />{" "}
                                        StatSim
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </header>

            {/* Main flexbox */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Showroom */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Warframe DPS Stat(istics) Sim(ulator)
                        </CardTitle>
                        <CardDescription>
                            A fully featured DPS (and status effect!) simulator
                            for Warframe.
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Simulator Knobs */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="flex-auto">
                        <CardHeader>
                            <CardTitle>Enemy Settings</CardTitle>
                        </CardHeader>
                        <CardContent>Haiiii</CardContent>
                    </Card>
                    <Card className="flex-auto">
                        <CardHeader>
                            <CardTitle>Level Scaling</CardTitle>
                        </CardHeader>
                        <CardContent>Helloooo</CardContent>
                    </Card>
                    <Card className="flex-auto">
                        <CardHeader>
                            <CardTitle>Simulator Options</CardTitle>
                        </CardHeader>
                        <CardContent>Hewwwooooo</CardContent>
                    </Card>
                </div>

                {/* GunFax */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weapon Overview</CardTitle>
                    </CardHeader>
                </Card>

                {/* StatSim */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inflicted DPS Simulation</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 24,
                                    left: 24,
                                    right: 24,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            nameKey="visitors"
                                            hideLabel
                                        />
                                    }
                                />
                                <Line
                                    dataKey="visitors"
                                    type="natural"
                                    stroke="var(--color-visitors)"
                                    strokeWidth={2}
                                    dot={({ payload, ...props }) => {
                                        return (
                                            <Dot
                                                key={payload.browser}
                                                r={5}
                                                cx={props.cx}
                                                cy={props.cy}
                                                fill={payload.fill}
                                                stroke={payload.fill}
                                            />
                                        );
                                    }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            Trending up by 5.2% this month{" "}
                            <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>

                {/* SimFax */}
                <Card>
                    <CardHeader>
                        <CardTitle>Simulator metadata</CardTitle>
                    </CardHeader>
                    <CardContent>Lorem ipsum</CardContent>
                </Card>
            </div>
        </div>
    );
}
