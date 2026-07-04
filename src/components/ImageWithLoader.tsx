import React, { useState } from "react";

interface ImageWithLoaderProps {
  src?: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any; // Allow other standard image attributes
}

export const ImageWithLoader = ({ wrapperClassName = "", className = "", ...props }: ImageWithLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract sizing classes from className to apply to wrapper
  const sizingClasses = className.split(' ').filter(c => c.startsWith('w-') || c.startsWith('h-') || c.startsWith('aspect-') || c.startsWith('min-') || c.startsWith('max-')).join(' ');

  return (
    <div className={`relative flex flex-col justify-center overflow-hidden ${wrapperClassName || sizingClasses} ${!isLoaded ? 'bg-gray-100 min-h-[120px]' : ''}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10 w-full h-full min-h-[120px]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--gr)] rounded-full animate-spin mb-2 drop-shadow-sm"></div>
          <span className="text-xs text-gray-500 font-medium">Loading...</span>
        </div>
      )}
      <img
        {...props}
        className={`${className} ${!isLoaded ? 'opacity-0 h-0 w-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
        onError={(e) => {
          setHasError(true);
          setIsLoaded(true); // stop showing loader
          if (props.onError) props.onError(e);
        }}
      />
    </div>
  );
};
