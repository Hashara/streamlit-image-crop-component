import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useCallback } from "react"
import ReactDOM from "react-dom"
import Slider from "@material-ui/core/Slider"
import Cropper from "react-easy-crop"
import "./styles.css"
import { getOrientation } from "get-orientation/browser"
import * as events from "events"
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

class MyComponent extends StreamlitComponentBase<State> {
  state = {
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 4 / 3,
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

  onZoomChange = (zoom: number ) => {
    this.setState({ zoom })
  }

  setImageSrc = (newImageSrc: any) => {
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
            {/*<div className="controls">*/}
            {/*  <Slider*/}
            {/*    value={this.state.zoom}*/}
            {/*    min={1}*/}
            {/*    max={3}*/}
            {/*    step={0.1}*/}
            {/*    aria-labelledby="Zoom"*/}
            {/*    onChange={(e, zoom) => this.onZoomChange(this.state.zoom)}*/}
            {/*    className = "slider"*/}
            {/*  />*/}
            {/*</div>*/}
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
                  <img src={this.state.croppedImage} alt="Cropped" height="100px" />
                  <Button
                    onClick={this.onClose}
                    variant="contained"
                    color="primary"
                    className="cropButton"
                  >
                    Close
                  </Button>

                  <Button
                    onClick={this.onClose}
                    variant="contained"
                    color="primary"
                    className="cropButton"
                  >
                    Download Image
                  </Button>
                </div>


              </>
            ) : (
              <h1>hi</h1>
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

export default withStreamlitConnection(MyComponent)
