import React, { useState, useEffect } from "react";
import {
  BrowserBarcodeReader,
  NotFoundException,
  ChecksumException,
  FormatException
} from "@zxing/library";

import { Button } from "react-native-paper";
import { Box, FormLabel, NativeSelect, TextField, Typography } from "@mui/material";

export default function MyCamera(props) {

  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [tempCode, setTempCode] = useState("");

  const barcodeReader = new BrowserBarcodeReader();

  useEffect(() => {
    barcodeReader
      .getVideoInputDevices()
      .then(videoInputDevices => {
        setupDevices(videoInputDevices);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  function setupDevices(videoInputDevices) {
    const sourceSelect = document.getElementById("sourceSelect");

    // selects first device
    setSelectedDeviceId(videoInputDevices[0].deviceId);

    // setup devices dropdown
    if (videoInputDevices.length >= 1) {
      setVideoInputDevices(videoInputDevices)
    }
  }

  function resetClick() {
    barcodeReader.reset();
    setTempCode("");
    decodeContinuously(selectedDeviceId);
    console.log("Reset.");
  }

  function decodeContinuously(selectedDeviceId) {
    barcodeReader.decodeFromInputVideoDeviceContinuously(
      selectedDeviceId,
      "video",
      (result, err) => {
        if (result) {
          // properly decoded qr code
          console.log("Found QR code!", result);
          setTempCode(result.text);
          barcodeReader.abort();
        }

        if (err) {

          if (err instanceof NotFoundException) {
            console.log("No QR code found.");
          }

          if (err instanceof ChecksumException) {
            console.log("A code was found, but its read value was not valid.");
          }

          if (err instanceof FormatException) {
            console.log("A code was found, but it was in an invalid format.");
          }
        }
      }
    );
  }

  async function sendCode() {
    props.sendCode(tempCode);
    console.log("El codigo que se manda es")
    console.log(tempCode);
  }

  useEffect(
    deviceId => {
      decodeContinuously(selectedDeviceId);
      console.log(`Started decode from camera with id ${selectedDeviceId}`);
    },
    [selectedDeviceId]
  );

  const handleInputChange = (event) => {
    setTempCode(event.target.value);
  };

  return (
    <Box sx={{
      bgcolor: 'background.default', display: 'flex', flexWrap: 'wrap',
      height: '100%', justifyContent: 'center', pb: 5
    }}>
      <section className="container" id="demo-content">
        <Typography variant="h3" component="h1" align="center" style={{ marginTop: "1em" }} >
          Scanner de código de barras
        </Typography>
        <div id="sourceSelectPanel">
          <FormLabel htmlFor="sourceSelect">Change video source:  </FormLabel>
          <NativeSelect
            id="sourceSelect"
            onChange={() => setSelectedDeviceId(sourceSelect.value)}
          >
            {
              videoInputDevices.map(element => (
                <option key={element.deviceId} value={element.deviceId}>{element.label}</option>
              ))
            }
          </NativeSelect>
        </div>
        <div>
          <video id="video" width="100%" max-width="600px" padding-bottom="56.25%" />
        </div>
        <FormLabel>Código de barras: </FormLabel>
        <div >
          <TextField
            required
            id="outlined-required"
            label="Barcode"
            type="text"
            placeholder="Introduce el código de barras del producto..."
            value={tempCode}
            onChange={handleInputChange}
            style={{ marginBottom: '10px', marginTop: '4px' }}
            fullWidth
          />

          <Button mode="contained" id="registerButton" onClick={() => sendCode()} style={{ marginBottom: '10px' }}>
            REGISTRAR CÓDIGO DE BARRAS
          </Button>
          <Button mode="contained" id="resetButton" onClick={() => resetClick()}>RESETEAR CÓDIGO</Button>
        </div>
      </section>
    </Box>
  );
}