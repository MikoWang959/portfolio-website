(() => {
  document.querySelectorAll('.gallery-video-play').forEach(button => {
    button.addEventListener('click', () => {
      const videoId = button.dataset.youtubeId;
      if (!videoId) return;
      if (window.location.protocol === 'file:') {
        const startTime = Number(button.dataset.startTime || 0);
        const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}${startTime ? `&t=${startTime}s` : ''}`;
        const watchTab = window.open(watchUrl, '_blank', 'noopener');
        if (!watchTab) window.location.href = watchUrl;
        return;
      }
      const frame = document.createElement('iframe');
      frame.className = 'gallery-video-frame';
      frame.title = button.dataset.videoTitle || 'Portfolio video';
      const embedUrl = button.dataset.embedSrc || `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
      const separator = embedUrl.includes('?') ? '&' : '?';
      frame.src = `${embedUrl}${separator}autoplay=1&playsinline=1&rel=0`;
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      button.replaceWith(frame);
    }, { once: true });
  });

  const images = [...document.querySelectorAll('.project-gallery img:not(.gallery-video-poster)')];
  if (!images.length || !('HTMLDialogElement' in window)) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-label', 'Enlarged project image viewer');
  dialog.innerHTML = '<button class="image-viewer-close" type="button" aria-label="Close enlarged image">×</button><div class="image-viewer-frame"><img class="image-viewer-image" alt=""></div>';
  document.body.append(dialog);

  const closeButton = dialog.querySelector('.image-viewer-close');
  const enlargedImage = dialog.querySelector('.image-viewer-image');
  let opener = null;

  function openImage(image) {
    opener = image;
    enlargedImage.src = image.currentSrc || image.src;
    enlargedImage.alt = image.alt || 'Project image';
    dialog.showModal();
    closeButton.focus();
  }

  function closeViewer() {
    if (dialog.open) dialog.close();
  }

  images.forEach(image => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');
    image.setAttribute('aria-label', `View larger image: ${image.alt || 'Project image'}`);
    image.addEventListener('click', () => openImage(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImage(image);
      }
    });
  });

  closeButton.addEventListener('click', closeViewer);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeViewer();
  });
  dialog.addEventListener('close', () => {
    enlargedImage.removeAttribute('src');
    opener?.focus();
  });
})();
