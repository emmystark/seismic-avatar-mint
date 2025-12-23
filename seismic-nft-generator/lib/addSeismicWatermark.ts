// lib/addSeismicWatermark.ts

interface WatermarkOptions {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center-bottom';
  opacity?: number; // 0 to 1
  size?: 'small' | 'medium' | 'large';
  logoUrl?: string; // URL to SEISMIC logo image (optional)
}

export async function addSeismicWatermark(
  base64Image: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const {
    position = 'bottom-right',
    opacity = 0.7,
    size = 'medium',
    logoUrl = null
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the generated image
      ctx.drawImage(img, 0, 0);

      if (logoUrl) {
        // If logo image is provided, use it
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        
        logo.onload = () => {
          const logoSizes = {
            small: 0.15,
            medium: 0.2,
            large: 0.25
          };
          
          const logoWidth = canvas.width * logoSizes[size];
          const logoHeight = (logo.height / logo.width) * logoWidth;
          
          const padding = 20;
          let x = 0, y = 0;
          
          switch (position) {
            case 'bottom-right':
              x = canvas.width - logoWidth - padding;
              y = canvas.height - logoHeight - padding;
              break;
            case 'bottom-left':
              x = padding;
              y = canvas.height - logoHeight - padding;
              break;
            case 'top-right':
              x = canvas.width - logoWidth - padding;
              y = padding;
              break;
            case 'top-left':
              x = padding;
              y = padding;
              break;
            case 'center-bottom':
              x = (canvas.width - logoWidth) / 2;
              y = canvas.height - logoHeight - padding;
              break;
          }
          
          ctx.globalAlpha = opacity;
          ctx.drawImage(logo, x, y, logoWidth, logoHeight);
          ctx.globalAlpha = 1.0;
          
          resolve(canvas.toDataURL('image/png'));
        };
        
        logo.onerror = () => {
          // Fallback to text if logo fails to load
          addTextWatermark(ctx, canvas, position, opacity, size);
          resolve(canvas.toDataURL('image/png'));
        };
        
        logo.src = logoUrl;
      } else {
        // Use text watermark
        addTextWatermark(ctx, canvas, position, opacity, size);
        resolve(canvas.toDataURL('image/png'));
      }
    };

    img.onerror = reject;
    img.src = base64Image;
  });
}

function addTextWatermark(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  position: string,
  opacity: number,
  size: string
) {
  // Font sizes based on canvas size
  const fontSizes = {
    small: Math.floor(canvas.width * 0.03),
    medium: Math.floor(canvas.width * 0.04),
    large: Math.floor(canvas.width * 0.05)
  };
  
  const fontSize = fontSizes[size as keyof typeof fontSizes];
  ctx.font = `bold ${fontSize}px Arial`;
  
  const text = 'SEISMIC';
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;
  
  const padding = 20;
  let x = 0, y = 0;
  
  switch (position) {
    case 'bottom-right':
      x = canvas.width - textWidth - padding;
      y = canvas.height - padding;
      break;
    case 'bottom-left':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'top-right':
      x = canvas.width - textWidth - padding;
      y = padding + textHeight;
      break;
    case 'top-left':
      x = padding;
      y = padding + textHeight;
      break;
    case 'center-bottom':
      x = (canvas.width - textWidth) / 2;
      y = canvas.height - padding;
      break;
  }
  
  // Draw text with outline for better visibility
  ctx.globalAlpha = opacity;
  
  // Outline
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 3;
  ctx.strokeText(text, x, y);
  
  // Fill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(text, x, y);
  
  // Optional: Add a subtle glow effect
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fillText(text, x, y);
  
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
}

// Alternative: Create SEISMIC logo badge watermark
export async function addSeismicBadge(
  base64Image: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const {
    position = 'bottom-right',
    opacity = 0.8,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the generated image
      ctx.drawImage(img, 0, 0);

      // Create badge
      const badgeWidth = canvas.width * 0.15;
      const badgeHeight = badgeWidth * 0.4;
      const padding = 15;
      
      let x = 0, y = 0;
      
      switch (position) {
        case 'bottom-right':
          x = canvas.width - badgeWidth - padding;
          y = canvas.height - badgeHeight - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - badgeHeight - padding;
          break;
        case 'top-right':
          x = canvas.width - badgeWidth - padding;
          y = padding;
          break;
        case 'top-left':
          x = padding;
          y = padding;
          break;
        case 'center-bottom':
          x = (canvas.width - badgeWidth) / 2;
          y = canvas.height - badgeHeight - padding;
          break;
      }
      
      ctx.globalAlpha = opacity;
      
      // Draw rounded rectangle badge
      const radius = 8;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + badgeWidth - radius, y);
      ctx.quadraticCurveTo(x + badgeWidth, y, x + badgeWidth, y + radius);
      ctx.lineTo(x + badgeWidth, y + badgeHeight - radius);
      ctx.quadraticCurveTo(x + badgeWidth, y + badgeHeight, x + badgeWidth - radius, y + badgeHeight);
      ctx.lineTo(x + radius, y + badgeHeight);
      ctx.quadraticCurveTo(x, y + badgeHeight, x, y + badgeHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add SEISMIC text
      const fontSize = badgeHeight * 0.5;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SEISMIC', x + badgeWidth / 2, y + badgeHeight / 2);
      
      ctx.globalAlpha = 1.0;
      
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;
    img.src = base64Image;
  });
}