import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useCallback } from "react"
import Slider from "@material-ui/core/Slider"
import Cropper from "react-easy-crop"
import "./styles.css"
import Button from "@material-ui/core/Button"
import { getCroppedImg, getRotatedImage } from "./canvasUtil.js"

interface State {
  imageSrc: string | null
  crop: { x: number; y: number }
  rotation: number
  zoom: number
  croppedAreaPixels: { width: number; height: number; x: number; y: number } | null
  croppedImage: string | null
}

class ImageCropComponent extends StreamlitComponentBase<State> {
  state = {
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1 / 1,
    croppedAreaPixels: null,
    rotation: 0,
    croppedImage: null,
  }

  //
  onCropChange = (crop: any) => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels)
    this.setCroppedAreaPixels(croppedAreaPixels)
  }

  onZoomChange = (zoom: any ) => {
    // this.setState({ zoom })
    if (Array.isArray(zoom)) {
      this.setState({ zoom: zoom[0] });
    } else {
      this.setState({ zoom });
    }
  }

  setImageSrc = (newImageSrc: any) => {
    const frameSize = 75; // the size of the frame you want to add
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width + frameSize * 2;
      canvas.height = img.height + frameSize * 2;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, frameSize, frameSize);
      const newDataUrl = canvas.toDataURL();
      this.setState({ imageSrc: newDataUrl });
    };
    img.src = newImageSrc;
    this.setState({ imageSrc: newImageSrc })
  }

  setCroppedImage = (newCroppedImage: any) => {
    this.setState({ croppedImage: newCroppedImage })
  }
  setCroppedAreaPixels = (newCroppedAreaPixels: any) => {
    this.setState({ croppedAreaPixels: newCroppedAreaPixels })
  }

  setRotation = (newRotation: any) => {
    this.setState({ rotation: newRotation })
  }

  onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)


      this.setImageSrc(imageDataUrl)
    }
  }

  showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        this.state.imageSrc,
        this.state.croppedAreaPixels,
        this.state.rotation,
      )
      console.log("donee", { croppedImage })
      this.setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }


  onClose = () => {
    this.setCroppedImage(null)
  }


  handleDownload = async () => {
    const imgUrl = this.state.croppedImage; // replace with your image URL

    if (imgUrl != null) {
      const imgResponse = await fetch(imgUrl);
      const imgBlob = await imgResponse.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(imgBlob);
      downloadLink.download = 'image.jpg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

  }


  render() {
    return (

      <div className="App">

        {this.state.imageSrc ? (
          <React.Fragment>
            <div className="crop-container">
              <Cropper
                image={this.state.imageSrc}
                crop={this.state.crop}
                zoom={this.state.zoom}
                aspect={this.state.aspect}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
            <div className="controls">
              <Slider
                value={this.state.zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => this.onZoomChange(zoom)}
                className = "slider"
              />
            </div>
            <Button
              onClick={this.showCroppedImage}
              variant="contained"
              color="primary"
              className="cropButton"
            >
              Show Result
            </Button>

            {this.state.croppedImage ? (
              <>
                <h1> Preview </h1>
                <div className="container">
                  <div className="row">
                    <img src={this.state.croppedImage} alt="Cropped" height="300px"/>
                  </div>
                  <div className="row">
                    <div className="col-4">

                    </div>

                    <div className="col-4">
                      <Button
                        onClick={this.onClose}
                        variant="contained"
                        color="primary"
                        className="cropButton"
                      >
                        Close
                      </Button>
                    </div>

                    <div className="col-4">

                      <Button
                        onClick={this.handleDownload}
                        variant="contained"
                        color="primary"
                        className="cropButton"
                      >
                        Download
                      </Button>
                    </div>


                  </div>

                </div>


              </>
            ) : (
              <p>Cropped image will appear here</p>
            )}

          </React.Fragment>
        ) : (
          <input type="file" onChange={this.onFileChange} accept="image/*" />
        )}
      </div>

    )

  }
}

function readFile(file: any) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

export default withStreamlitConnection(ImageCropComponent)
