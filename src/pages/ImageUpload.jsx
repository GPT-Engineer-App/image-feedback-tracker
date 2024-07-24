import React, { useState } from 'react';
import { useAddAnnotation } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotation, setAnnotation] = useState('');
  const addAnnotation = useAddAnnotation();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setCurrentImageIndex(0);
  };

  const handleAnnotationChange = (value) => {
    setAnnotation(value);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !annotation) {
      toast.error("Please select images and provide an annotation");
      return;
    }

    try {
      const currentFile = selectedFiles[currentImageIndex];
      // In a real application, you would upload the image to a storage service
      // and get a URL. For this example, we'll use a placeholder URL.
      const imageUrl = 'https://example.com/placeholder-image.jpg';

      await addAnnotation.mutateAsync({ imageUrl, annotation });
      toast.success("Image annotated successfully");
      
      // Move to the next image or finish if all images are annotated
      if (currentImageIndex < selectedFiles.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setAnnotation('');
      } else {
        toast.success("All images have been annotated");
        setSelectedFiles([]);
        setCurrentImageIndex(0);
        setAnnotation('');
      }
    } catch (error) {
      toast.error("Failed to annotate image");
      console.error(error);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setAnnotation('');
    }
  };

  const handleNext = () => {
    if (currentImageIndex < selectedFiles.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setAnnotation('');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Batch Image Upload and Annotation</h1>
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        {selectedFiles.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <img
                src={URL.createObjectURL(selectedFiles[currentImageIndex])}
                alt={`Preview ${currentImageIndex + 1}`}
                className="mb-4 max-w-full h-auto"
              />
              <div className="flex justify-between items-center mb-4">
                <Button onClick={handlePrevious} disabled={currentImageIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span>{`${currentImageIndex + 1} / ${selectedFiles.length}`}</span>
                <Button onClick={handleNext} disabled={currentImageIndex === selectedFiles.length - 1}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <Select onValueChange={handleAnnotationChange} value={annotation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select annotation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="okay">Okay</SelectItem>
                  <SelectItem value="bad">Bad</SelectItem>
                  <SelectItem value="terrible">Terrible</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSubmit} className="w-full mt-4">
                Annotate and Continue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;