import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { updateJob } from './jobService';

const uploadsDir = path.resolve(process.cwd(), 'uploads');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

/**
 * Generate QR Code from text/URL
 */
export const generateQRCode = async (
  text: string,
  size: number,
  jobId: string
): Promise<string> => {
  ensureUploadsDir();
  const fileName = `qr-${jobId}.png`;
  const outputPath = path.join(uploadsDir, fileName);

  await QRCode.toFile(outputPath, text, {
    width: size,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  const downloadUrl = `/uploads/${fileName}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
  });

  return outputPath;
};

/**
 * Generate Hash from file or text
 */
export const generateHash = async (
  inputPath: string | null,
  text: string | null,
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512',
  jobId: string
): Promise<string> => {
  ensureUploadsDir();
  const hash = crypto.createHash(algorithm);

  if (inputPath && fs.existsSync(inputPath)) {
    // Hash file
    const fileBuffer = fs.readFileSync(inputPath);
    hash.update(fileBuffer);
  } else if (text) {
    // Hash text
    hash.update(text);
  } else {
    throw new Error('No input provided for hash generation');
  }

  const hashResult = hash.digest('hex');
  
  // Save hash to a text file
  const fileName = `hash-${jobId}.txt`;
  const outputPath = path.join(uploadsDir, fileName);
  fs.writeFileSync(outputPath, `${algorithm.toUpperCase()}: ${hashResult}`);

  const downloadUrl = `/uploads/${fileName}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
    metadata: { hash: hashResult },
  });

  if (inputPath && fs.existsSync(inputPath)) {
    fs.unlink(inputPath, (error) => {
      if (error) {
        console.warn(`⚠ Failed to delete temporary input for hash job ${jobId}:`, error.message);
      }
    });
  }

  return hashResult;
};

/**
 * Format Text (case conversion, trimming)
 */
export const formatText = async (
  text: string,
  operation: 'uppercase' | 'lowercase' | 'titlecase' | 'capitalize' | 'trim' | 'removeSpaces',
  jobId: string
): Promise<string> => {
  ensureUploadsDir();
  let result: string;

  switch (operation) {
    case 'uppercase':
      result = text.toUpperCase();
      break;
    case 'lowercase':
      result = text.toLowerCase();
      break;
    case 'titlecase':
      result = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      break;
    case 'capitalize':
      result = text.charAt(0).toUpperCase() + text.slice(1);
      break;
    case 'trim':
      result = text.trim().replace(/\s+/g, ' ');
      break;
    case 'removeSpaces':
      result = text.replace(/\s/g, '');
      break;
    default:
      result = text;
  }

  const stats = {
    characters: result.length,
    words: result.trim().split(/\s+/).filter(Boolean).length,
    lines: result.split('\n').length,
  };

  // Save to file
  const fileName = `text-${jobId}.txt`;
  const outputPath = path.join(uploadsDir, fileName);
  fs.writeFileSync(outputPath, result);

  const downloadUrl = `/uploads/${fileName}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
    metadata: { stats, formattedText: result },
  });

  return result;
};

/**
 * Extract Color Palette from Image
 */
export const extractColorPalette = async (
  inputPath: string,
  colorCount: number,
  jobId: string
): Promise<string[]> => {
  ensureUploadsDir();
  const ColorThief = require('colorthief');

  let palette: number[][] | null = null;
  let usedFallback = false;
  try {
    palette = await ColorThief.getPalette(inputPath, colorCount);
  } catch (error) {
    console.warn(`⚠ ColorThief failed for palette job ${jobId}:`, (error as Error).message);
  }

  // Fallback to dominant color if palette detection fails
  if (!Array.isArray(palette) || palette.length === 0) {
    const stats = await sharp(inputPath).stats();
    const dominant = stats?.dominant;

    if (!dominant) {
      throw new Error('Unable to detect colors from the provided image');
    }

    const fallbackColor: number[] = [
      Math.round(dominant.r),
      Math.round(dominant.g),
      Math.round(dominant.b),
    ];

    usedFallback = true;
    palette = Array.from({ length: Math.max(1, colorCount) }, () => fallbackColor);
  }

  // Convert RGB arrays to hex
  const hexColors = palette.map((rgb: number[]) => {
    const [r, g, b] = rgb;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  });

  // Create visual palette image
  const colorBlockWidth = 200;
  const colorBlockHeight = 100;
  const paletteWidth = colorBlockWidth * Math.min(colorCount, 5);
  const paletteHeight = colorBlockHeight * Math.ceil(colorCount / 5);

  // Create color blocks
  const colorBlocks = await Promise.all(
    hexColors.map(async (color: string) => {
      return sharp({
        create: {
          width: colorBlockWidth,
          height: colorBlockHeight,
          channels: 3,
          background: color,
        },
      })
        .png()
        .toBuffer();
    })
  );

  // Combine blocks
  const rows: Buffer[][] = [];
  for (let i = 0; i < colorBlocks.length; i += 5) {
    rows.push(colorBlocks.slice(i, i + 5));
  }

  const rowImages = await Promise.all(
    rows.map(async (row) => {
      const composites = row.map((buffer, index) => ({
        input: buffer,
        left: index * colorBlockWidth,
        top: 0,
      }));

      return sharp({
        create: {
          width: colorBlockWidth * row.length,
          height: colorBlockHeight,
          channels: 3,
          background: { r: 255, g: 255, b: 255 },
        },
      })
        .composite(composites)
        .png()
        .toBuffer();
    })
  );

  // Stack rows vertically
  const composites = rowImages.map((buffer, index) => ({
    input: buffer,
    left: 0,
    top: index * colorBlockHeight,
  }));

  const fileName = `palette-${jobId}.png`;
  const outputPath = path.join(uploadsDir, fileName);
  await sharp({
    create: {
      width: paletteWidth,
      height: paletteHeight,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  const downloadUrl = `/uploads/${fileName}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
    metadata: {
      colors: hexColors,
      detectionMethod: usedFallback ? 'fallback' : 'palette',
    },
  });

  if (fs.existsSync(inputPath)) {
    fs.unlink(inputPath, (error) => {
      if (error) {
        console.warn(`⚠ Failed to delete temporary input for palette job ${jobId}:`, error.message);
      }
    });
  }

  return hexColors;
};

/**
 * Generate Favicon from Image
 */
export const generateFavicon = async (
  inputPath: string,
  jobId: string
): Promise<string> => {
  ensureUploadsDir();
  const toIco = require('to-ico');
  
  // Generate multiple sizes
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(inputPath)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toBuffer()
    )
  );

  // Create ICO file
  const icoBuffer = await toIco(pngBuffers);

  const fileName = `favicon-${jobId}.ico`;
  const outputPath = path.join(uploadsDir, fileName);
  fs.writeFileSync(outputPath, icoBuffer);

  const downloadUrl = `/uploads/${fileName}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
  });

  if (fs.existsSync(inputPath)) {
    fs.unlink(inputPath, (error) => {
      if (error) {
        console.warn(`⚠ Failed to delete temporary input for favicon job ${jobId}:`, error.message);
      }
    });
  }

  return outputPath;
};
