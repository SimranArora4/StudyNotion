import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explorer';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];
const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses,setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) =>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=>course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
  return (
    <div>
        <div className='text-center font-semibold text-4xl'>
            Unlock the 
            <HighlightText text={"power of code"}/>
        </div>
        <p className='text-center text-[16px] text-richblack-300 mt-3'>Learn to build anything you can imagine</p>
        <div className='flex flex-row mt-5 bg-richblack-800 rounded-full mb-5 border-richblack-100 px-1 py-1 w-fit mx-auto'>
           { tabsName?.map((element,index) =>{
            return(
                <div className={`text-[16px] flex flex-row items-center gap-2 
                ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium" :
                    "text-richblack-200"} rounded-full hover:bg-richblack-900 hover:text-richblack-5 transition-all duration-200 cursor-pointer px-7 py-2
                }`}
                key={index}
                onClick={()=>setMyCards(element)}>
                    {element}
                </div>
            )
           }
           )}
        </div>
        <div className='lg:h-[90px]'></div>

        {/* Course card  */}
        <div className='flex flex-row justify-center gap-5'>
            {courses?.map((element,index)=>{
                return(
                    <CourseCard 
                    key={index}
                    cardData = {element}
                    currentCard = {currentCard}
                    setCurrentCard = {setCurrentCard} />
                )
            })}
        </div>
    </div>
  )
}

export default ExploreMore;