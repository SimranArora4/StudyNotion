import React from 'react'
import {FaArrowRight} from "react-icons/fa";
import {Link} from "react-router-dom";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button'
import Banner from '../assets/images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLineSection from '../components/core/HomePage/TimeLineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

export const Home = () => {
  return (
    <div>
        {/* {Section 1} */}
        <div className='relative mx-auto max-w-maxContent flex flex-col w-11/12 items-center justify-between text-white'>
            <Link to={"/signup"}>
            <div className='mt-16 p-1 group mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
            </div>
            </Link>
            <div className='text-center text-4xl font-semibold mt-7'>
              Empower your future with 
              <HighlightText text={"Coding Skills"}/>
            </div>
            
            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
               With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            <div className='flex flex-row gap-7 mt-8'>
              <CTAButton active={true} linkto={"/signup"}>Learn more</CTAButton>
              <CTAButton active={false} linkto={"/login"}>Book a demo</CTAButton>
            </div>

            <div className='shadow-blue-200 mx-3 my-12 w-[80%] h-auto'>
              <video muted loop autoPlay>
                <source src={Banner} type='video/mp4'></source>
              </video>
            </div>

            <div>
              <CodeBlocks 
              position={"lg:flex-row"} 
               heading={
                                <div className='text-3xl lg:text-4xl font-semibold'>
                                    Unlock Your
                                    <HighlightText text={"coding potential "} />
                                    with our online courses
                                </div>
                            }
            subheading={ "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={
                                {
                                    text: "try it yourself",
                                    linkto: "/signup",
                                    active: true,
                                }
                            }
                            ctabtn2={
                                {
                                    text: "learn more",
                                    linkto: "/login",
                                    active: false,
                                }
                            }
            codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
            codeColor={"text-yellow-25"}
              />

              <CodeBlocks 
              position={"lg:flex-row-reverse"} 
               heading={
                                <div className='text-3xl lg:text-4xl font-semibold'>
                                    Start
                                    <HighlightText text={"coding in seconds "} />
                                </div>
                            }
            subheading={ "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={
                                {
                                    text: "Continue Lesson",
                                    linkto: "/signup",
                                    active: true,
                                }
                            }
                            ctabtn2={
                                {
                                    text: "Learn More",
                                    linkto: "/login",
                                    active: false,
                                }
                            }
            codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
            codeColor={"text-yellow-25"}
              />
            </div>
            <ExploreMore/>
        </div>
        {/* Section 2 */}
            <div className='bg-pure-greys-5 text-richblack-700'>
              <div className='homepage_bg h-[333px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col mx-auto justify-between gap-5 items-center'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white'>
                  <CTAButton active={true} linkto={"/signup"}>
                  <div className='flex items-center gap-2'>
                    Explore full Catalog
                    <FaArrowRight/>
                  </div>
                  </CTAButton>
                  <CTAButton active={false} linkto={"/login"}>
                  <div className='flex items-center gap-2'>
                    Learn More
                    <FaArrowRight/>
                  </div>
                  </CTAButton>
                </div>
                </div>
              </div>

              <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
             
              <div className='flex flex-row gap-5 mb-10 mt-[95px] justify-center'>
                <div className='text-4xl font-semibold w-[45%]'>
                Get the Skills you need for a <HighlightText text={" Job that is in Demand "}/>
                </div>

              <div className='flex flex-col gap-10 w-[40%]'>
                <div className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                </div>
                <div className='w-[30%] '>
                <CTAButton active={true} linkto={"/signup"} > Learn More</CTAButton>
                </div>
              </div>
              </div>
              <TimeLineSection></TimeLineSection>
              <LearningLanguageSection/>
              </div>
            </div>

            {/* Section 3 */}
            <div className='flex flex-col w-11/12 mx-auto max-w-maxContent items-center justify-between gap-8 bg-richblack-900 text-white'>
            <InstructorSection/>
            <h2 className='text-center text-4xl font-semibold mt-10'>
              Review from Other Learners
            </h2>
            {/* Review slider here */}
            <ReviewSlider/>
            </div>
            {/* Footer */}
            <Footer/>
            {/* Section 4 */}
    </div>
  );
}
export default Home;