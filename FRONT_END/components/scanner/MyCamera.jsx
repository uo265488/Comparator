import React, { useState, useEffect } from "react";
import {
  BrowserBarcodeReader,
  NotFoundException,
  ChecksumException,
  FormatException
} from "@zxing/library";

import { Button } from "react-native-paper";
import { Box, FormLabel, NativeSelect } from "@mui/material";
import { findProductByBarcode } from "../../api/ApiService";

export default function MyCamera(props) {

  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [videoInputDevices, setVideoInputDevices] = useState([]);

  const [tempCode, setTempCode] = useState("8430807000538");

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
          props.setCode("");

          // As long as this error belongs into one of the following categories
          // the code reader is going to continue as excepted. Any other error
          // will stop the decoding loop.
          //
          // Excepted Exceptions:
          //
          //  - NotFoundException
          //  - ChecksumException
          //  - FormatException

          if (err instanceof NotFoundException) {
            console.log("No QR code found.");
          }

          if (err instanceof ChecksumException) {
            console.log("A code was found, but it's read value was not valid.");
          }

          if (err instanceof FormatException) {
            console.log("A code was found, but it was in a invalid format.");
          }
        }
      }
    );
  }

  async function sendCode() {
    var prod = await findProductByBarcode(tempCode);
    props.setProductos(prod.hits);
    
    props.setCode(tempCode);
  }

  useEffect(
    deviceId => {
      decodeContinuously(selectedDeviceId);
      console.log(`Started decode from camera with id ${selectedDeviceId}`);
    },
    [selectedDeviceId]
  );
 
  return (
    
    <Box sx={{bgcolor: 'background.default', display: 'flex', flexWrap: 'wrap', 
      height: '100%', justifyContent: 'center', pb: 5
    }}>
    
      <section className="container" id="demo-content">
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
          <video id="video"  width="100%" max-width="600px" padding-bottom="56.25%" />
        </div>

        <FormLabel>Código de barras: </FormLabel>
        <pre>
          <code id="result">{tempCode}</code>
        </pre>

          <Button mode="contained" id="registerButton" onClick={() => sendCode()}>Registrar código de barras</Button>
          <Button mode="contained" id="resetButton" onClick={() => resetClick()}>Resetear</Button> 

          </section>
    </Box>
  );
}