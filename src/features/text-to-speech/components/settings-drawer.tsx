import { Settings } from "lucide-react";
import { SettingsPanelSettings } from "@/features/text-to-speech/components/settings-panel-settings";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface SettingDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function SettingDrawer({
  open,
  onOpenChange,
  children,
}: SettingDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children ?? (
        <Button variant="outline" size="sm" asChild>
          <DrawerTrigger>
            <Settings className="size-4" />
          </DrawerTrigger>
        </Button>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <SettingsPanelSettings />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
