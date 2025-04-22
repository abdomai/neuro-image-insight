
import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ResultDisplay } from "@/components/ResultDisplay";
import { Button } from "@/components/ui/button";
import { Brain, Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AnalysisResult {
  confidence: number;
  prediction: string;
  status: string;
}

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select a brain scan image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://51.21.132.192:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Result: ${data.prediction}`,
        variant: data.prediction === "Tumor Detected" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">NeuroImage Insight</h1>
          </div>
          <p className="text-sm text-gray-500">Brain Tumor Detection</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Brain Scan</h2>
          <p className="text-gray-600 mb-6">
            Upload a clear MRI or CT scan image of the brain for analysis. The AI model will 
            analyze the image and detect the presence of a tumor.
          </p>
          
          <ImageUploader 
            onImageSelect={handleImageSelect}
            isLoading={isAnalyzing}
          />
          
          <div className="mt-6">
            <Button 
              onClick={analyzeImage} 
              disabled={!selectedFile || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <ResultDisplay result={result} />
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Important Note</h2>
          <p className="text-gray-600 text-sm">
            This tool is for educational and demonstration purposes only. It should not be used 
            for medical diagnosis. Always consult with qualified healthcare professionals for 
            proper diagnosis and treatment.
          </p>
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            NeuroImage Insight - AI-Powered Brain Tumor Detection Tool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
