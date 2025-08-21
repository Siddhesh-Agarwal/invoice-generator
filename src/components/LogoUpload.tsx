import {ImageIcon, X} from "lucide-react";
import type React from "react";
import {useRef} from "react";

import {Button} from "@/components/ui/button";
import {Input} from "./ui/input";

interface LogoUploadProps {
  logoUrl?: string;
  onLogoChange: (url?: string) => void;
}

const LogoUpload = ({logoUrl, onLogoChange}: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Make sure it's an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onLogoChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = () => {
    onLogoChange();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4">
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {logoUrl ? (
        <div className="flex items-center space-x-2">
          <div className="relative inline-block rounded border border-border p-2">
            <img
              src={logoUrl}
              alt="Business Logo"
              className="h-16 max-w-[200px]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemoveLogo}
              className="-top-2 -right-2 absolute rounded-full shadow-sm"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={handleButtonClick}
          >
            Change Logo
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          type="button"
          onClick={handleButtonClick}
          className="flex cursor-pointer items-center border-border bg-transparent"
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Upload Logo
        </Button>
      )}
    </div>
  );
};

export default LogoUpload;
