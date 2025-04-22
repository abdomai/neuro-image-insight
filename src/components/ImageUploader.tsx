
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Loader, Check, X, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

export function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed rounded-md p-6 transition-colors",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
            selectedImage ? "border-green-500" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden"
            onChange={handleInputChange} 
          />

          {selectedImage ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="relative w-full max-w-md">
                <img
                  src={selectedImage}
                  alt="Selected brain scan"
                  className="w-full h-auto max-h-[300px] object-contain rounded-md"
                />
                {!isLoading && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">Image selected</p>
              {isLoading && <Loader className="h-6 w-6 animate-spin text-blue-500" />}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-blue-50">
                <Image className="h-10 w-10 text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Drag and drop your brain scan image</p>
                <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
              </div>
              <Button onClick={handleButtonClick} disabled={isLoading}>
                Browse Files
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
