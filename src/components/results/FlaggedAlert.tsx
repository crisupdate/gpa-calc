import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Props {
  flaggedSections: string[];
  confidence:      number;
}

export function FlaggedAlert({ flaggedSections, confidence }: Props) {
  if (flaggedSections.length === 0 && confidence >= 0.8) return null;

  return (
    <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-50/50 text-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-200">
      <AlertTriangle className="h-4 w-4 !text-yellow-600" />
      <AlertTitle className="text-yellow-800 dark:text-yellow-300">
        Extraction Warning
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-1 text-yellow-700 dark:text-yellow-400">
        {confidence < 0.8 && (
          <p>
            Confidence score: {Math.round(confidence * 100)}% — some data may be
            inaccurate. Consider uploading a clearer version of the transcript.
          </p>
        )}
        {flaggedSections.map((section, i) => (
          <p key={i}>• {section}</p>
        ))}
      </AlertDescription>
    </Alert>
  );
}