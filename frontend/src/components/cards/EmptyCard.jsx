import React from 'react'
import Lottie from 'lottie-react';

const EmptyCard = ({imgSrc,message}) => {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center gap-4 my-20'>
        <Lottie animationData={imgSrc} style={{height:350}}/>
        <p className='w-1/2 text-sm leading-8 text-center font-medium text-on-background'>
        {message}
        </p>
    </div>
  )
}

export default EmptyCard;