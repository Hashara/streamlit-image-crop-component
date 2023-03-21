import setuptools

setuptools.setup(
    name="streamlit-image-crop-component",
    version="0.0.1",
    author="Hashara Kumarasinghe",
    author_email="kumarasinghe.k.a.s.h@gmail.com",
    description="image crop component for streamlit",
    long_description="This component is used to crop images in streamlit",
    long_description_content_type="text/plain",
    url="",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit >= 0.63",
    ],
)
