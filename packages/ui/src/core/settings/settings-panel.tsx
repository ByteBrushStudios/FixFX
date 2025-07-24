"use client"

import { useState, useEffect } from 'react'
import { Button } from '@ui/components/button'
import { Slider } from '@ui/components/slider'
import { Label } from '@ui/components/label'
import { Switch } from '@ui/components/switch'
import { ScrollArea } from '@ui/components/scroll-area'
import { Separator } from '@ui/components/separator'
import {
    Monitor,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    Contrast,
    PanelLeft,
    Languages,
    Check
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@utils/functions/cn'

export function SettingsPanel() {
    const { theme, setTheme } = useTheme()
    const [volume, setVolume] = useState(50)
    const [muted, setMuted] = useState(false)
    const [contrast, setContrast] = useState(100)

    useEffect(() => {
        if (muted) {
            setVolume(0)
        }
    }, [muted])

    return (
        <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Display</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Monitor className="h-5 w-5" />
                                <Label htmlFor="theme">Theme</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                >
                                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contrast">Contrast</Label>
                            <Slider
                                id="contrast"
                                min={50}
                                max={150}
                                step={1}
                                value={[contrast]}
                                onValueChange={([v]) => setContrast(v)}
                            />
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>50%</span>
                                <span>{contrast}%</span>
                                <span>150%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Sound</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                <Label htmlFor="volume">Main Volume</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="mute"
                                    checked={!muted}
                                    onCheckedChange={checked => setMuted(!checked)}
                                />
                            </div>
                        </div>

                        <Slider
                            id="volume"
                            min={0}
                            max={100}
                            step={1}
                            value={[volume]}
                            onValueChange={([v]) => setVolume(v)}
                            disabled={muted}
                            className={cn(muted && "opacity-50")}
                        />

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>{volume}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Language</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Languages className="h-5 w-5" />
                                <Label htmlFor="language">Preferred Language</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                    English
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}