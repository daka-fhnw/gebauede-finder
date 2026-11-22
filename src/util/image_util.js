export function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => {
      console.error(reader.error);
      reject("Laden der Bilddatei fehlgeschlagen.");
    };
    reader.readAsDataURL(file);
  });
}

export function transformImage(dataURL, properties) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const w = properties.widthPx;
      const h = Math.round(img.height * (w / img.width));
      const [cw, ch] = properties.rotate90 ? [h, w] : [w, h];
      const steps = [];
      if (properties.rotate90) {
        steps.push(new DOMMatrix([0, 1, -1, 0, h, 0]));
      }
      if (properties.mirrorX) {
        steps.push(new DOMMatrix([-1, 0, 0, 1, cw, 0]));
      }
      if (properties.mirrorY) {
        steps.push(new DOMMatrix([1, 0, 0, -1, 0, ch]));
      }
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cw, ch);
      if (steps.length !== 0) {
        const matrix = steps.reduce(
          (accumulator, current) => current.multiply(accumulator),
          new DOMMatrix(),
        );
        ctx.setTransform(matrix);
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", properties.qualityPerc));
    };
    img.onerror = () => reject("Transformation des Bildes fehlgeschlagen.");
    img.src = dataURL;
  });
}
