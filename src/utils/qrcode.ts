import QRCode from 'qrcode';

/**
 * Generates a QR code image from the given text.
 *
 * @param text The text to encode into the QR code.
 * @returns A promise that resolves to a base64 string representing the QR code image.
 */
export const generateQRCodeImage = async (text: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(text);
    return qrCode;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};
