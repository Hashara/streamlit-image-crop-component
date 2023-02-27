import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React from "react"
import ReactDOM from "react-dom"
import Slider from "@material-ui/core/Slider"
import Cropper from "react-easy-crop"
import "./styles.css"
import { getOrientation } from "get-orientation/browser"
import * as events from "events"


class MyComponent extends StreamlitComponentBase {
  state = {
    imageSrc:null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 4 / 3,
  }
  //
  onCropChange = (crop: any) => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  onZoomChange = (zoom: number | number[]) => {
    this.setState({ zoom })
  }

  setImageSrc = (newImageSrc: any) => {
    this.setState({ imageSrc: newImageSrc })
  }

  onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)


      this.setImageSrc(imageDataUrl)
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
                // classes={{ container: 'slider' }}
              />
            </div>
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
