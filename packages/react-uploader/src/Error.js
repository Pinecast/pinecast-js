import React from 'react';


const ERRORS = {
    file_too_big_image: gettext('The image you are trying to upload is too large to be uploaded. Images must be less than two megabytes.'),
    file_too_big_audio: gettext('The audio file you are trying to upload is too large for your plan.'),
    file_read_error: gettext('The file could not be read. Your browser reported it as zero bytes. Please try again.'),
    image_too_big: gettext('Images are limited to 2MB. Please select an image file with a smaller file size.'),
    max_size: gettext('Warning! The image exceeds the Apple Podcasts maximum size of 3000x3000px.'),
    min_size: gettext('Warning! The image does not meet the Apple Podcasts minimum size of 1400x1400px.'),
    not_square: gettext('Warning! The image is not square. This may cause distortion on some devices.'),

    dpi: gettext('Warning! This image is not 72 DPI. Apple Podcasts may not be able to display it.'),
    color_space: gettext('Warning! This image is not using the RGB color space. Apple Podcasts may not be able to display it.'),
    orientation: gettext('Warning! This image has been rotated using the "Orientation" flag rather than physically rotating the image. This may cause the image to display incorrectly on some devices.'),

    no_wav: gettext('WAV files cannot be used for episode audio. Encode your WAV file as an MP3 before uploading.'),
};

const ErrorComponent = ({error}) =>
    error ?
        <div
            className='warning'
            style={{
                flex: '1 1 100%',
                margin: '0 5px',
            }}
        >
            {ERRORS[error]}
        </div> :
        null;

export default ErrorComponent;
