
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
    <div className="min-h-screen bg-brand-50 text-brand-900">
      <header className="bg-white shadow-soft border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-medical-100 p-3 rounded-large">
              <Brain className="h-7 w-7 text-medical-600" />
            </div>
            <h1 className="text-3xl font-bold text-brand-800 tracking-tight">NeuroImage Insight</h1>
          </div>
          <p className="text-sm text-brand-500">Brain Tumor Detection AI</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-large shadow-medium p-8 border border-brand-100">
          <h2 className="text-2xl font-semibold mb-4 text-brand-700">Brain Scan Analysis</h2>
          <p className="text-brand-600 mb-6 leading-relaxed">
            Upload a clear MRI or CT scan for advanced AI-powered tumor detection. 
            Our machine learning model provides precise, data-driven insights to support medical professionals.
          </p>
          
          <ImageUploader 
            onImageSelect={handleImageSelect}
            isLoading={isAnalyzing}
          />
          
          <div className="mt-6">
            <Button 
              onClick={analyzeImage} 
              disabled={!selectedFile || isAnalyzing}
              className="w-full bg-medical-600 hover:bg-medical-700 text-white transition-colors duration-300"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                "Analyze Brain Scan"
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-brand-700">Analysis Results</h2>
            <ResultDisplay result={result} />
          </div>
        )}

        <div className="bg-medical-50 rounded-large p-6 border border-medical-100">
          <h2 className="text-xl font-semibold mb-3 text-medical-800">Medical Disclaimer</h2>
          <p className="text-brand-600 text-sm leading-relaxed">
            This AI-powered tool is for educational and screening purposes only. 
            It should not replace professional medical diagnosis. 
            Always consult healthcare professionals for comprehensive medical advice.
          </p>
        </div>
      </main>

      <footer className="bg-white border-t border-brand-100 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-brand-500">
            © 2025 NeuroImage Insight - AI-Powered Medical Screening Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

