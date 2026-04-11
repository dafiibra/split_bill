import cv2
import numpy as np


class ImagePreprocessor:
    """Preprocesses receipt images for better OCR accuracy."""

    @staticmethod
    def preprocess(image_bytes: bytes) -> np.ndarray:
        """
        Apply preprocessing pipeline:
        1. Decode image
        2. Convert to grayscale
        3. Apply adaptive thresholding
        4. Noise reduction
        """
        # Decode image from bytes
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image")

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply Gaussian blur for noise reduction
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        # Adaptive thresholding for varying lighting conditions
        thresh = cv2.adaptiveThreshold(
            blurred, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=11,
            C=2,
        )

        # Morphological operations to clean up
        kernel = np.ones((1, 1), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        return cleaned

    @staticmethod
    def preprocess_for_easyocr(image_bytes: bytes) -> np.ndarray:
        """
        Lighter preprocessing for EasyOCR (it does internal preprocessing).
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Could not decode image")

        # EasyOCR works well with the original image,
        # but slight denoising helps
        denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

        return denoised
