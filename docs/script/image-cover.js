function processImageForCover(imgElement, options = {}) {
    const {
        container = document.body,
        useObjectFit = true,
        useBackground = false,
        preferContain = true
    } = options;

    if (!imgElement) {
        console.error('Elemento de imagem não fornecido');
        return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = function() {
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const containerWidth = container.clientWidth || window.innerWidth;
        const containerHeight = container.clientHeight || window.innerHeight;

        console.log(`Dimensões da imagem: ${imgWidth}x${imgHeight}`);
        console.log(`Dimensões do container: ${containerWidth}x${containerHeight}`);

        if (useBackground) {
            container.style.backgroundImage = `url(${imgElement.src})`;
            container.style.backgroundSize = preferContain ? 'contain' : 'cover';
            container.style.backgroundPosition = 'center';
            container.style.backgroundRepeat = 'no-repeat';
        } else if (useObjectFit) {
            const isHorizontal = imgWidth > imgHeight;
            const isVertical = imgHeight > imgWidth;
            const isSquare = Math.abs(imgWidth - imgHeight) < 50;
            
            imgElement.style.width = '100%';
            imgElement.style.objectPosition = 'center';

            const imgRatio = imgWidth / imgHeight;
            const containerWidth = container.clientWidth || imgElement.parentElement.clientWidth;
            
            let calculatedHeight;
            
            if (isHorizontal) {
                calculatedHeight = containerWidth / imgRatio;
                imgElement.style.height = `${calculatedHeight}px`;
                imgElement.style.objectFit = 'contain';
                imgElement.style.maxHeight = '300px';
            } else if (isVertical) {
                calculatedHeight = Math.min(containerWidth / imgRatio, 300);
                imgElement.style.height = `${calculatedHeight}px`;
                imgElement.style.objectFit = 'cover';
            } else {
                calculatedHeight = containerWidth;
                imgElement.style.height = `${calculatedHeight}px`;
                imgElement.style.objectFit = 'cover';
            }
            
            if (calculatedHeight < 120) {
                imgElement.style.height = '120px';
                imgElement.style.objectFit = 'cover';
            }
            if (calculatedHeight > 300) {
                imgElement.style.height = '300px';
            }
            
            console.log(`Altura calculada: ${calculatedHeight}px para imagem ${imgWidth}x${imgHeight}`);
        } else {
            let finalWidth, finalHeight, finalX, finalY;

            if (preferContain) {
                if (imgRatio > containerRatio) {
                    finalWidth = containerWidth;
                    finalHeight = containerWidth / imgRatio;
                    finalX = 0;
                    finalY = (containerHeight - finalHeight) / 2;
                } else {
                    finalHeight = containerHeight;
                    finalWidth = containerHeight * imgRatio;
                    finalX = (containerWidth - finalWidth) / 2;
                    finalY = 0;
                }
            } else {
                if (imgRatio > containerRatio) {
                    finalHeight = containerHeight;
                    finalWidth = containerHeight * imgRatio;
                    finalX = (containerWidth - finalWidth) / 2;
                    finalY = 0;
                } else {
                    finalWidth = containerWidth;
                    finalHeight = containerWidth / imgRatio;
                    finalX = 0;
                    finalY = (containerHeight - finalHeight) / 2;
                }
            }

            imgElement.style.width = `${finalWidth}px`;
            imgElement.style.height = `${finalHeight}px`;
            imgElement.style.position = 'absolute';
            imgElement.style.left = `${finalX}px`;
            imgElement.style.top = `${finalY}px`;
        }

        imgElement.classList.add('image-cover');
    };

    img.onerror = function() {
        console.error('Erro ao carregar a imagem');
    };

    img.src = imgElement.src;
}

function processUploadedImage(file, callback) {
    if (!file || !file.type.startsWith('image/')) {
        console.error('Arquivo não é uma imagem válida');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            
            console.log(`Imagem carregada: ${imgWidth}x${imgHeight}`);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const maxWidth = 1920;
            const maxHeight = 1080;
            
            let width = imgWidth;
            let height = imgHeight;
            
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            callback(dataUrl, { width, height, originalWidth: imgWidth, originalHeight: imgHeight });
        };
        
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function setupImageUpload(inputElement, options = {}) {
    const {
        previewElement = null,
        onImageProcessed = null,
        maxWidth = 1920,
        maxHeight = 1080
    } = options;

    if (!inputElement) {
        console.error('Elemento input não fornecido');
        return;
    }

    inputElement.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) return;

        processUploadedImage(file, (dataUrl, dimensions) => {
            console.log('Imagem processada:', dimensions);
            
            if (previewElement) {
                previewElement.src = dataUrl;
                processImageForCover(previewElement, { useObjectFit: true });
            }
            
            if (onImageProcessed) {
                onImageProcessed(dataUrl, dimensions);
            }
        });
    });
}

function applyCoverToImages(className = 'event-image') {
    const images = document.querySelectorAll(`.${className}`);
    
    images.forEach(img => {
        processImageForCover(img, { useObjectFit: true, preferContain: false });
    });
}

window.processImageForCover = processImageForCover;
window.processUploadedImage = processUploadedImage;
window.setupImageUpload = setupImageUpload;
window.applyCoverToImages = applyCoverToImages;

document.addEventListener('DOMContentLoaded', function() {
    applyCoverToImages('event-image');

    const eventImages = document.querySelectorAll('.event-card img');
    eventImages.forEach(img => {
        const imgObj = new Image();
        imgObj.crossOrigin = 'anonymous';
        
        imgObj.onload = function() {
            const imgWidth = imgObj.naturalWidth;
            const imgHeight = imgObj.naturalHeight;
            const wrapper = img.closest('.event-image-wrapper');
            
            if (wrapper) {
                const containerWidth = wrapper.clientWidth;
                const imgRatio = imgWidth / imgHeight;
                
                let idealHeight;
                let objectFitValue;
                
                if (imgWidth > imgHeight) {
                    idealHeight = Math.round(containerWidth / imgRatio);
                    objectFitValue = 'cover';

                    if (idealHeight > 400) {
                        idealHeight = 400;
                    }
                    if (idealHeight < 150) {
                        idealHeight = 150;
                    }
                } else if (imgHeight > imgWidth) {
                    idealHeight = Math.round(Math.min(containerWidth / imgRatio, 400));
                    objectFitValue = 'cover';

                    if (idealHeight < 150) {
                        idealHeight = 150;
                    }
                } else {
                    idealHeight = containerWidth;
                    objectFitValue = 'cover';
                    
                    if (idealHeight > 400) {
                        idealHeight = 400;
                    }
                    if (idealHeight < 150) {
                        idealHeight = 150;
                    }
                }
                
                wrapper.style.height = `${idealHeight}px`;
                img.style.objectFit = objectFitValue;
                
                console.log(`Imagem ${imgWidth}x${imgHeight}: Altura definida como ${idealHeight}px, object-fit: ${objectFitValue}`);
            }
        };
        
        imgObj.src = img.src;
    });
    
    const customUpload = document.getElementById('custom-image-upload');
    if (customUpload) {
        setupImageUpload(customUpload, {
            previewElement: document.querySelector('.image-checkbox img[data-preview]'),
            onImageProcessed: function(dataUrl, dimensions) {
                console.log('Imagem customizada processada:', dimensions);
                customUpload.dataset.processedImage = dataUrl;
            }
        });
    }
});
