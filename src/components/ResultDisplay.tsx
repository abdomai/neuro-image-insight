
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  confidence: number;
  prediction: string;
  status: string;
}

interface ResultDisplayProps {
  result: AnalysisResult | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result) return null;

  const confidencePercentage = Math.round(result.confidence * 100);
  const isTumorDetected = result.prediction === "Tumor Detected";

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className={`p-2 rounded-full ${isTumorDetected ? "bg-red-100" : "bg-green-100"}`}>
          <Brain className={`h-6 w-6 ${isTumorDetected ? "text-red-500" : "text-green-500"}`} />
        </div>
        <div>
          <CardTitle className={isTumorDetected ? "text-red-600" : "text-green-600"}>
            {result.prediction}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Confidence Level</span>
              <span className="text-sm font-medium">{confidencePercentage}%</span>
            </div>
            <Progress 
              value={confidencePercentage} 
              className={`h-2 ${isTumorDetected ? "bg-red-100" : "bg-green-100"}`} 
            />
          </div>
          <div className="text-sm text-gray-500">
            {isTumorDetected 
              ? "The analysis indicates the presence of a tumor with high confidence. Please consult with a healthcare professional for proper diagnosis."
              : "No tumor detected in the provided image. Regular check-ups are still recommended."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
