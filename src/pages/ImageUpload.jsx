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

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [annotation, setAnnotation] = useState('');
  const addAnnotation = useAddAnnotation();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAnnotationChange = (value) => {
    setAnnotation(value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !annotation) {
      toast.error("Please select an image and annotation");
      return;
    }

    try {
      // In a real application, you would upload the image to a storage service
      // and get a URL. For this example, we'll use a placeholder URL.
      const imageUrl = 'https://example.com/placeholder-image.jpg';

      await addAnnotation.mutateAsync({ imageUrl, annotation });
      toast.success("Image uploaded and annotated successfully");
      setSelectedFile(null);
      setImagePreview(null);
      setAnnotation('');
    } catch (error) {
      toast.error("Failed to upload and annotate image");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Image Upload and Annotation</h1>
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mb-4 max-w-full h-auto" />
        )}
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
        <Button onClick={handleSubmit} className="w-full">
          Upload and Annotate
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;