import React, { useState, useEffect } from 'react';

const ProductImageLoader = ({ imageName, alt, ...props }) => {
  const defaultImage = require('../static/images/producto.png');
  const [imgSrc, setImgSrc] = useState(defaultImage);

  useEffect(() => {
    let isMounted = true;
    const loadImage = async () => {
      try {
        const image = await import(`../static/images/${imageName}.jpg`);
        if (isMounted) {
          setImgSrc(image.default);
        }
      } catch (error) {
        if (isMounted) {
          setImgSrc(defaultImage);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imageName]);

  return <img src={imgSrc} alt={alt} {...props} />;
};

export default ProductImageLoader;
