import React from 'react';


const ERRORS = {
    file_too_big: gettext('The file you are trying to upload is too large for your plan.'),
    image_too_big: gettext('Images are limited to 2MB. Please select an image file with a smaller file size.'),
    max_size: gettext('Warning! The image exceeds the iTunes maximum size of 3000x3000px.'),
    min_size: gettext('Warning! The image does not meet the iTunes minimum size of 1400x1400px.'),
    not_square: gettext('Warning! The image is not square. This may cause distortion on some devices.'),

    dpi: gettext('Warning! This image is not 72 DPI. iTunes may not be able to display it.'),
    color_space: gettext('Warning! This image is not using the RGB color space. iTunes may not be able to display it.'),
    orientation: gettext('Warning! This image has been rotated using the "Orientation" flag rather than physically rotating the image. This may cause the image to display incorrectly on some devices.'),
};

const ErrorComponent = ({error}) =>
    error ?
        <div className='warning'>{ERRORS[error]}</div> :
        null;

export default ErrorComponent;
