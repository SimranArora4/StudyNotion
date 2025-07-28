import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import TimelineImage from '../../../assets/images/TimelineImage.png';

const TimeLineSection = () => {
    const timeline = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },

    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];
  return (
    <div>
        <div className='flex flex-row gap-15 items-center '>
            <div className='flex flex-col gap-5 w-[45%]'>
                {
                    timeline?.map((element,index) =>{
                        return(
                        <div className='flex flex-row gap-6' key={index}>
                            <div className='h-[50px] w-[50px] bg-white flex items-center rounded-full justify-center'>
                            <img src={element.Logo}></img>
                            </div>
                            <div className='flex flex-col'>
                               <h2 className='text-[18px] font-semibold'>{element.Heading}</h2> 
                                <p className='text-base'>{element.Description}</p>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200'>
                <img src={TimelineImage} alt='TimelineImage' className='shadow-white object-cover h-fit'></img>

                <div className='bg-caribbeangreen-700 absolute flex flex-row text-white uppercase py-10 left-[50%] translate-x-[-45%] translate-y-[-30%]'>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-30 text-sm'>years of Experience</p>
                    </div>
                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-30 text-sm'>Types of courses</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default TimeLineSection;