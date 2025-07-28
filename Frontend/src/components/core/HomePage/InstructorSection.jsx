import React from 'react'
import Instructor from '../../../assets/images/Instructor.png';
import HighlightText from './HighlightText';
import CTAButton from '../../../components/core/HomePage/Button';
import { FaArrowRight } from 'react-icons/fa';

const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row gap-20 items-center'>
            <div className='w-[50%]'>
                <img src={Instructor} className='shadow-white '></img>
            </div>

            <div className='w-[50%] flex flex-col gap-10'>
                <div className='font-semibold text-4xl w-[50%]'>
                    Become an <HighlightText text={"Instructor"}/>
                </div>
                <p className='font-medium text-[16px] text-richblack-300 w-[80%]'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                <div className='w-fit'>
                    <CTAButton active={true} linkto={"/signup"}>
                <div className='flex flex-row gap-2 items-center'>
                    Start Learning Today 
                    <FaArrowRight/>
                </div>
                </CTAButton>
                </div>
                
            </div>

        </div>
    </div>
  )
}

export default InstructorSection