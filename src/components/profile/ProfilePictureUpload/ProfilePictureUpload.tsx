import React, { useState, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
  optimizeImage, 
  createCircularCrop, 
  validateImageFile, 
  formatFileSize,
  type OptimizedImage 
} from '../../../utils/imageOptimization';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4px;
`;

const ProfileImage = styled.img<{ uploading?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background: #f3f4f6;
  transition: all 0.3s ease;
  filter: ${props => props.uploading ? 'blur(2px) brightness(0.7)' : 'none'};
`;

const DefaultAvatar = styled.div<{ uploading?: boolean }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  filter: ${props => props.uploading ? 'blur(2px) brightness(0.7)' : 'none'};
`;

const UploadOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: ${props => props.visible ? 1 : 0};
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  color: white;
  font-size: 2rem;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s linear infinite;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const UploadArea = styled.div<{ isDragOver: boolean; hasError: boolean }>`
  border: 2px dashed ${props => 
    props.hasError ? '#ef4444' :
    props.isDragOver ? '#667eea' : 'rgba(102, 126, 234, 0.3)'
  };
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background: ${props => 
    props.hasError ? 'rgba(239, 68, 68, 0.05)' :
    props.isDragOver ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.5)'
  };

  &:hover {
    border-color: ${props => props.hasError ? '#ef4444' : '#667eea'};
    background: ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  }
`;

const UploadIcon = styled.div<{ isDragOver: boolean }>`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${props => props.isDragOver ? pulse : 'none'} 1s ease-in-out infinite;
  filter: grayscale(${props => props.isDragOver ? 0 : 0.3});
  transition: all 0.3s ease;
`;

const UploadText = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const ImageInfo = styled.div`
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const InfoTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📊';
    font-size: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const InfoItem = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const UploadButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
`;

interface ProfilePictureUploadProps {
  currentImage?: string;
  onImageUpload?: (optimizedImage: OptimizedImage) => Promise<void>;
  onImageRemove?: () => Promise<void>;
  uploading?: boolean;
  maxFileSize?: number; // in bytes
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  uploading = false,
  maxFileSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${formatFileSize(maxFileSize)}`);
      return;
    }

    try {
      // Create optimized versions
      const [optimized, circular] = await Promise.all([
        optimizeImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.8 }),
        createCircularCrop(file, 200)
      ]);

      setOptimizedImage(optimized);
      setPreviewImage(circular.dataUrl);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setOptimizedImage(null);
      setPreviewImage(currentImage || null);
    }
  }, [maxFileSize, currentImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleSave = async () => {
    if (optimizedImage && onImageUpload) {
      try {
        await onImageUpload(optimizedImage);
        setOptimizedImage(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image');
      }
    }
  };

  const handleRemove = async () => {
    if (onImageRemove) {
      try {
        await onImageRemove();
        setPreviewImage(null);
        setOptimizedImage(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove image');
      }
    }
  };

  const getUserInitials = () => {
    // This would typically come from user data
    return '👤';
  };

  return (
    <Container>
      <Title>Profile Picture</Title>
      <Subtitle>
        Upload a photo to personalize your profile. We'll automatically optimize it for you.
      </Subtitle>

      <ProfileImageContainer>
        {previewImage ? (
          <ProfileImage src={previewImage} alt="Profile" uploading={uploading} />
        ) : (
          <DefaultAvatar uploading={uploading}>
            {getUserInitials()}
          </DefaultAvatar>
        )}
        
        <UploadOverlay visible={uploading}>
          <LoadingSpinner />
        </UploadOverlay>
      </ProfileImageContainer>

      <UploadArea
        isDragOver={isDragOver}
        hasError={!!error}
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon isDragOver={isDragOver}>📸</UploadIcon>
        <UploadText>
          {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
        </UploadText>
        <UploadSubtext>
          PNG, JPG, WebP up to {formatFileSize(maxFileSize)}
        </UploadSubtext>
      </UploadArea>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {error && (
        <ErrorMessage>
          ⚠️ {error}
        </ErrorMessage>
      )}

      {optimizedImage && (
        <ImageInfo>
          <InfoTitle>Optimized Image Details</InfoTitle>
          <InfoGrid>
            <InfoItem><strong>Size:</strong> {formatFileSize(optimizedImage.size)}</InfoItem>
            <InfoItem><strong>Format:</strong> {optimizedImage.format.toUpperCase()}</InfoItem>
            <InfoItem><strong>Width:</strong> {optimizedImage.width}px</InfoItem>
            <InfoItem><strong>Height:</strong> {optimizedImage.height}px</InfoItem>
          </InfoGrid>
        </ImageInfo>
      )}

      <ButtonGroup>
        {optimizedImage && (
          <UploadButton
            onClick={handleSave}
            loading={uploading}
            disabled={uploading}
          >
            Save Picture
          </UploadButton>
        )}
        
        {(previewImage || currentImage) && (
          <Button
            variant="outline"
            onClick={handleRemove}
            disabled={uploading}
          >
            Remove Picture
          </Button>
        )}
        
        {!optimizedImage && !currentImage && (
          <UploadButton
            onClick={handleUploadClick}
            disabled={uploading}
          >
            Choose Photo
          </UploadButton>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default ProfilePictureUpload;