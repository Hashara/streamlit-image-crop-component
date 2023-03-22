This project is to create a custom component for streamlit which include following features:

1.	Upload a jpg image (or png)
2.	Display the image with a widget that allows Cropping, Adjusted Images (drag/move), and Zoom, manually by a user.
3.	Make the final image size to 900px X 900px 
4.	Return the output image, and allow to save and display separately. 




## Demo

![](./assets/demo.gif)

## installation

```pip install streamlit-image-crop-component```

## Example

```
from image_crop_component import image_crop_component


image_crop_component(name="image-cropper")
```
