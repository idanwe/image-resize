import 'blueimp-canvas-to-blob';

exports default function ImageResize (file, options, callback) {
  if (!file || !file instanceof File) {
    return callback(new Error('file must be type of File'));
  }

  const MAX_WIDTH = options.width || 800;
  const MAX_HEIGHT = options.height || 600;
  const QUALITY = options.quality || 0.55;

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = document.createElement('img');
    img.src = e.target.result;

    img.onload = function () {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // TODO: add original file name
      canvas.toBlob(blob => {
        blob.name = file.name;
        return callback(blob);
      }, 'image/jpeg', QUALITY);

      // show preview
      if (options.preview) { // TODO: move the preview to imageUpload template
        const thumbnail = document.createElement('img');
        thumbnail.src = canvas.toDataURL('image/jpeg', 0.3);
        $(options.preview).html(thumbnail);
      }
    };
  };

  reader.readAsDataURL(file);
};
