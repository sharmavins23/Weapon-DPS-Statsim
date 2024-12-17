"use client";

import { runPrimarySimulation } from "@/calc/Primary";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Braton } from "@/data/weapons/primary/Braton";
import { zodResolver } from "@hookform/resolvers/zod";
import { HomeIcon, Moon, RefreshCw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { z } from "zod";

const formSchema = z.object({
    simulationTime: z.coerce.number().min(1).max(1_000),
    timeResolution: z.coerce.number().min(0.0001).max(1),
});

export default function Home() {
    const { setTheme } = useTheme();

    // Form data
    const [formData, setFormData] = useState({
        simulationTime: 10,
        timeResolution: 0.01,
    });

    // Chart data
    const [simOutput, setSimOutput] = useState(
        runPrimarySimulation(Braton, {
            simulationTime: 10,
            timeResolution: 0.01,
        }),
    );
    const chartConfig = {
        damage: {
            label: "TickDamage",
            color: "hsl(var(--chart-1))",
        },
        cumulative: {
            label: "Damage",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    // Input form definition
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            simulationTime: 10,
            timeResolution: 0.01,
        },
    });

    // On submission of the form...
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        // Update the form data
        setFormData({
            simulationTime: values.simulationTime,
            timeResolution: values.timeResolution,
        });
    }

    // On button press...
    function onSubmitButton() {
        // Re-run the simulation
        setSimOutput(
            runPrimarySimulation(Braton, {
                simulationTime: formData.simulationTime,
                timeResolution: formData.timeResolution,
            }),
        );
    }

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
                {/* Header/information */}
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
                    <CardContent>Currently in progress!</CardContent>
                </Card>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        l{" "}
                        <div className="flex flex-1 flex-col gap-4 pt-0">
                            {/* Simulator knobs */}
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                <Card className="flex-auto">
                                    <CardHeader>
                                        <CardTitle>Enemy Settings</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        To be implemented!
                                    </CardContent>
                                </Card>
                                <Card className="flex-auto">
                                    <CardHeader>
                                        <CardTitle>Level Scaling</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        To be implemented!
                                    </CardContent>
                                </Card>
                                <Card className="flex-auto">
                                    <CardHeader>
                                        <CardTitle>Simulator Options</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="simulationTime"
                                            render={({
                                                field,
                                            }: {
                                                field: any;
                                            }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Simulation Runtime
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="10"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Controls how long the
                                                        simulation runs for.
                                                        Don't set it too high!
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="timeResolution"
                                            render={({
                                                field,
                                            }: {
                                                field: any;
                                            }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Simulation Resolution
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.01"
                                                            step={0.01}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Controls the time
                                                        between ticks. Don't set
                                                        it too low.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Weapon modding/building */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Arsenal</CardTitle>
                                </CardHeader>
                                <CardContent>To be implemented!</CardContent>
                            </Card>

                            {/* StatSim */}
                            <Card>
                                <div className="flex flex-row">
                                    <CardHeader>
                                        <CardTitle>
                                            Inflicted DPS Simulation
                                        </CardTitle>
                                        <CardDescription>
                                            Simulation run over{" "}
                                            <b>{simOutput.metadata.time} </b>
                                            seconds, with{" "}
                                            <b>
                                                {
                                                    simOutput.metadata
                                                        .timeResolution
                                                }{" "}
                                            </b>{" "}
                                            seconds between ticks
                                        </CardDescription>
                                        <Button
                                            type="submit"
                                            onClick={onSubmitButton}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Re-run simulation
                                        </Button>
                                    </CardHeader>
                                </div>
                                <CardContent>
                                    <ChartContainer config={chartConfig}>
                                        <LineChart
                                            accessibilityLayer
                                            data={simOutput.data}
                                            margin={{
                                                top: 24,
                                                left: 24,
                                                right: 24,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                className="transition-all"
                                                dataKey="time"
                                                tickLine={true}
                                                tickMargin={10}
                                                minTickGap={15}
                                            />
                                            <YAxis tickLine={true} />
                                            <ChartTooltip
                                                cursor={true}
                                                content={
                                                    <ChartTooltipContent
                                                        indicator="line"
                                                        nameKey="cumulative"
                                                        labelFormatter={(
                                                            label,
                                                            payload,
                                                        ) =>
                                                            `${payload[0].payload.time.toFixed(2)} seconds`
                                                        }
                                                    />
                                                }
                                            />
                                            <Line
                                                dataKey="cumulative"
                                                type="linear"
                                                stroke="var(--color-cumulative)"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </Form>

                {/* SimFax */}
                <Card>
                    <CardHeader>
                        <CardTitle>Simulator metadata</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {simOutput.metadata.DPS.toFixed(3)} DPS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Damage per second (averaged)
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
