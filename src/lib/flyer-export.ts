export const FLYER_HEIGHT = 1536;
export const FLYER_WIDTH = FLYER_HEIGHT * 297 / 420;
export const A3_WIDTH_PX = 3508;
export const A3_HEIGHT_PX = 4961;

// PNG stores physical resolution in pixels per metre (300 dpi = 11811 px/m).
export async function withPrintResolution(png: Blob): Promise<Blob> {
  const bytes = new Uint8Array(await png.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const chunk = new Uint8Array(21);
  const chunkView = new DataView(chunk.buffer);
  chunkView.setUint32(0, 9);
  chunk.set([112, 72, 89, 115], 4); // pHYs
  chunkView.setUint32(8, 11811);
  chunkView.setUint32(12, 11811);
  chunk[16] = 1;
  let crc = 0xffffffff;
  for (const byte of chunk.subarray(4, 17)) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  chunkView.setUint32(17, (crc ^ 0xffffffff) >>> 0);
  const parts: BlobPart[] = [bytes.slice(0, 33), chunk];
  for (let offset = 33; offset < bytes.length;) {
    const length = view.getUint32(offset) + 12;
    const isResolution = bytes[offset + 4] === 112 && bytes[offset + 5] === 72
      && bytes[offset + 6] === 89 && bytes[offset + 7] === 115;
    if (!isResolution) parts.push(bytes.slice(offset, offset + length));
    offset += length;
  }
  return new Blob(parts, { type: 'image/png' });
}
