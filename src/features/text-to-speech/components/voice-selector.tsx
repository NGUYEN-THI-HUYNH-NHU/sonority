"use client";

import { useStore } from "@tanstack/react-form";

import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import { useTTSVoices } from "../contexts/tts-voices-context";
import { ttsFormOptions } from "./text-to-speech-form";

export function VoiceSelector() {
  const { customVoices, systemVoices, allVoices: voices } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);
  const voiceId = useStore(form.store, (s) => s.values.voiceId);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  // Filter out voices with empty IDs to avoid Select validation error
  const filteredCustomVoices = customVoices.filter((v) => v.id && v.id.trim());
  const filteredSystemVoices = systemVoices.filter((v) => v.id && v.id.trim());
  const filteredVoices = voices.filter((v) => v.id && v.id.trim());

  const filteredSelectedVoice = filteredVoices.find((v) => v.id === voiceId);
  const filteredHasMissingSelectedVoice =
    Boolean(voiceId) && !filteredSelectedVoice;
  const currentVoice = filteredSelectedVoice
    ? filteredSelectedVoice
    : filteredHasMissingSelectedVoice
      ? {
          id: voiceId,
          name: "Unavailable voice",
          category: null as null,
        }
      : filteredVoices[0];

  // Use currentVoice.id if voiceId is empty to avoid Select validation error
  const selectValue = voiceId || currentVoice?.id || "";

  return (
    <Field>
      <FieldLabel>Voice style</FieldLabel>
      <Select
        value={selectValue}
        onValueChange={(v) => form.setFieldValue("voiceId", v)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-full h-auto gap-1 rounded-lg bg-white px-2 py-1">
          <SelectValue>
            {currentVoice && (
              <>
                <VoiceAvatar seed={currentVoice.id} name={currentVoice.name} />
                <span className="truncate text-sm font-medium tracking-tight">
                  {currentVoice.name}
                  {currentVoice.category &&
                    ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
                </span>
              </>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredHasMissingSelectedVoice && currentVoice && (
            <>
              <SelectGroup>
                <SelectLabel>Selected Voice</SelectLabel>
                <SelectItem value={currentVoice.id}>
                  <VoiceAvatar
                    seed={currentVoice.id}
                    name={currentVoice.name}
                  />
                  <span className="truncate text-sm font-medium">
                    {currentVoice.name}
                    {currentVoice.category &&
                      ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`}
                  </span>
                </SelectItem>
              </SelectGroup>
              {(filteredCustomVoices.length > 0 ||
                filteredSystemVoices.length > 0) && <SelectSeparator />}
            </>
          )}
          {filteredCustomVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Team Voices</SelectLabel>
              {filteredCustomVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {filteredCustomVoices.length > 0 &&
            filteredSystemVoices.length > 0 && <SelectSeparator />}
          {filteredSystemVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Built-in Voices</SelectLabel>
              {filteredSystemVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}
