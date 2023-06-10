import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { saveImage } from "../../api/ApiService";

export default function PhotoCaptureForm(props) {
  const [open, setOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [canvasElement, setCanvasElement] = useState(null);
  const [imageData, setImageData] = useState(undefined);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (videoElement && canvasElement) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
        });

      const handleCapture = () => {
        const context = canvasElement.getContext("2d");
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        const imageData = canvasElement.toDataURL("image/png");
        setImageData(imageData);
        setImageCaptured(true);
      };

      const captureButton = document.getElementById("captureButton");
      if (captureButton) {
        captureButton.addEventListener("click", handleCapture);
      }

      return () => {
        if (captureButton) {
          captureButton.removeEventListener("click", handleCapture);
        }
      };
    }
  }, [videoElement, canvasElement]);

  const saveCapturedImage = () => {
    saveImage(props.barcode, imageData);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Tomar foto de producto
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tomar foto</DialogTitle>
        <DialogContent>
          <video
            ref={(el) => setVideoElement(el)}
            id="videoElement"
            autoPlay
          ></video>
          <canvas
            ref={(el) => setCanvasElement(el)}
            id="canvasElement"
          ></canvas>
        </DialogContent>

        <DialogActions>
          {!imageCaptured ? (
            <Button id="captureButton">Capturar</Button>
          ) : (
            <Button onClick={saveCapturedImage}>Guardar Imagen</Button>
          )}
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
