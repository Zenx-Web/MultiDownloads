import { resolveDownloadUrl } from './jobStatus';

const parseFilename = (contentDisposition: string | null) => {
  if (!contentDisposition) {
    return 'download';
  }

  const utf8Match = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    const value = utf8Match[1].trim().replace(/"/g, '');
    try {
      return decodeURIComponent(value);
    } catch (_error) {
      return value;
    }
  }

  const asciiMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (asciiMatch && asciiMatch[1]) {
    return asciiMatch[1].trim();
  }

  return 'download';
};

export const downloadFileFromApi = async (downloadPath: string, apiUrl?: string) => {
  const absoluteUrl = resolveDownloadUrl(downloadPath, apiUrl);

  const response = await fetch(absoluteUrl, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(`Download request failed (${response.status})`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
  const fileName = parseFilename(contentDisposition);

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};
