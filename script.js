const url = './resume.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'libs/pdf/build/pdf.worker.js';

const loadingTask = pdfjsLib.getDocument(url);

async function createAnnotations(page, scale) {
  // Creates an Annotation layer

  const annotations = await page.getAnnotations();
  const view = page.view;

  for (var i = 0; i < annotations.length; i++) {
    const a = annotations[i];
    const rect = a.rect;
    const width = rect[2] - rect[0];
    const height = rect[3] - rect[1];
    console.log(width);

    const norm = pdfjsLib.Util.normalizeRect([
      rect[0],
      view[3] - rect[1] + view[1],
      rect[2],
      view[3] - rect[3] + view[1],
    ]);

    const div = document.getElementById('annotations');
    const anchor = document.createElement('a');
    anchor.href = a.url;
    anchor.style.left = (norm[0]*scale) + 'px';
    anchor.style.top = (norm[1]*scale) + 'px';
    anchor.style.width = (width*scale) + 'px';
    anchor.style.height = (height*scale) + 'px';
    div.appendChild(anchor);

  }
}

(async () => {
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  const scale = 1.5;
  const viewport = page.getViewport({ scale });
  // Support HiDPI-screens.
  const outputScale = window.devicePixelRatio || 1;

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + 'px';
  canvas.style.height = Math.floor(viewport.height) + 'px';

  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

  const renderContext = {
    canvasContext: context,
    transform,
    viewport,
  };

  createAnnotations(page, scale);
  page.render(renderContext);
})();
