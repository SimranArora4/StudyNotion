import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from '../../../assets/images/Know_your_progress.svg';
import compare_with_others from '../../../assets/images/Compare_with_others.svg';
import plan_your_progress from '../../../assets/images/Plan_your_lessons.svg';
import CTAButton from '../../../components/core/HomePage/Button'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
        <div className='flex flex-col gap-5 items-center'>
            <div className='text-4xl font-semibold items-center mx-auto'>
                Your Swiss Knife for 
                <HighlightText text={"learning any language"} />
            </div>
            <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

            <div className='flex flex-row items-center justify-center mt-5'>
                <img src={know_your_progress} className='object-contain -mr-32'></img>
                <img src={compare_with_others} className='object-contain'></img>
                <img src={plan_your_progress} className='object-contain -ml-36'></img>
            </div>
            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
            </div>
        </div>
    </div>
  )
}

export default LearningLanguageSection