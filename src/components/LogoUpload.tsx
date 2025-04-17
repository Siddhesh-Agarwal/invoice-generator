
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, X } from 'lucide-react';

interface LogoUploadProps {
  logoUrl: string | null;
  onLogoChange: (url: string | null) => void;
}

const LogoUpload = ({ logoUrl, onLogoChange }: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Make sure it's an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onLogoChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {logoUrl ? (
        <div className="flex items-center space-x-2">
          <div className="relative inline-block border border-border rounded p-2">
            <img src={logoUrl} alt="Business Logo" className="h-16 max-w-[200px]" />
            <button
              onClick={handleRemoveLogo}
              className="absolute -top-2 -right-2 bg-transparent rounded-full border border-border p-1 shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
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
          className="flex items-center border-border bg-transparent cursor-pointer"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload Logo
        </Button>
      )}
    </div>
  );
};

export default LogoUpload;
