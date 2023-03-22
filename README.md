This project is to create a custom component for streamlit which include following features:

1.	Input a jpg image (or png)
2.	Display the image with a widget that allows Cropping, Adjusted Images (drag/move), and Zoom, manually by a user.
3.	After you selected the image region (square) and zoom it, make the final image size to a specified number of pixels (let us say 900px X 900px) 
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