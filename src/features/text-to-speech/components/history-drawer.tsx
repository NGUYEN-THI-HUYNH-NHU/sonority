import { History } from "lucide-react";
import { SettingsPanelHistory } from "@/features/text-to-speech/components/settings-panel-history";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function HistoryDrawer() {
  return (
    <Drawer>
      <Button variant="outline" size="sm" asChild>
        <DrawerTrigger>
          <History className="size-4" />
        </DrawerTrigger>
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>History</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <SettingsPanelHistory />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
