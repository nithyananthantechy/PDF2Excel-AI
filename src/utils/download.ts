/**
 * Secure client-side file downloader utilities for PDF2Excel AI.
 * Bypasses iframe cookie restriction issues by executing in-context fetch
 * and serving files via dynamic object URLs.
 */

/**
 * Downloads the processed Excel spreadsheet from the server securely.
 * @param jobId The extraction job ID
 * @param fileName Current file name of the document
 */
export async function downloadExcel(jobId: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(`/api/download/${jobId}`);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Sanitize and prepare exported file name
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    const downloadName = `${baseName}_exported.xlsx`;

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Delay revocation slightly to allow prompt browser download completion
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 150);
  } catch (error) {
    console.error("Secure spreadsheet download occurred a failure:", error);
    alert("Unable to process high-security download. Please refresh the page and try again.");
  }
}

/**
 * Reconstructs and downloads the original uploaded PDF purely inside client memory.
 * @param base64Data Base64 representation from the database
 * @param fileName Desired save name of the document
 */
export function downloadOriginalPDF(base64Data: string, fileName: string): void {
  try {
    if (!base64Data) {
      throw new Error("No source document representation found associated with this job.");
    }

    // Isolate raw base64 contents
    let rawBase64 = base64Data;
    if (rawBase64.includes(";base64,")) {
      rawBase64 = rawBase64.split(";base64,")[1];
    }

    // Decode base64 to array buffer in safety
    const binaryString = window.atob(rawBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Serve as raw PDF blob
    const blob = new Blob([bytes], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 150);
  } catch (error: any) {
    console.error("Secure base64 file recovery download failed:", error);
    alert(`Could not download PDF document: ${error.message || 'Data integrity anomaly'}`);
  }
}
