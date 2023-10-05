import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import { api } from "~/utils/api";

type QuizOptionProps = {
  id: number,
  content: string
  imagePath: string
  onSelect: (id: number) => void
  answer: number
  correct: boolean
}

function QuizOption({ content, imagePath, onSelect, id, answer, correct }: QuizOptionProps) {
  const isAnswered = answer > 0
  const isWrong = answer === id && !correct
  const showCorrectSelection = isAnswered && correct
  return (
    <div>
      <button onClick={() => onSelect(id)} className={
        `bg-gray-200 rounded w-full flex items-center py-2 px-4 
        ${!isAnswered ? 'hover:ring-2 hover:bg-gray-300' : ''} 
        ${isWrong ? 'ring-4 ring-red-300 bg-red-100' : ''} 
        ${showCorrectSelection ? 'ring-4 ring-green-300 bg-green-100' : ''}`
      }>
        <Image 
          src={`https://image.tmdb.org/t/p/w185${imagePath}`}
          width={92}
          height={138}
          alt=""  
        />
        <span className="grow">
          {content}
        </span>
      </button>
    </div>
  )
}

export default function Quiz() {
  const [answer, setAnswer] = useState(0)
  const utils = api.useContext()
  const { data: quiz } = api.quiz.getQuiz.useQuery(undefined, {
    cacheTime: Infinity,
    staleTime: Infinity
  })
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  if (!quiz) return null
  const title = quiz.title ?? ''
  const options = quiz.actors || []
  const year = (quiz.release_date ?? '').split('-')[0]
  const isCorrect = answer === quiz.actors.find(a => a.correct)?.id

  const handleNext = () => {
    setAnswer(0)
    utils.quiz.invalidate()
      .catch(console.error)
  }

  const handleSelectOption = (id: number) => {
    if (answer > 0) return
    setAnswer(id)
  }

  return (
    <div className="">
      <div className="ml-5 text-blue-950 text-3xl">Who starred in...</div>
      <div className="flex justify-center mt-10 text-xl"><span className="font-bold">{title}</span>&nbsp;&nbsp;({year})</div>
      <div className="grid grid-cols-2 gap-4 m-5">
        {options.map((v, i) => (
          <QuizOption
            key={i}
            id={ v.id}
            content={v.name}
            imagePath={v.profile_path}
            answer={answer}
            correct={v.correct}
            onSelect={handleSelectOption}
          />
        ))}
      </div>
      {!!answer &&
        <div className="flex flex-col justify-center items-center mt-4">
          {isCorrect
            ? <span className='flex'><FontAwesomeIcon icon={faCircleCheck} className='text-green-900 w-6 pr-2'/>Correct!</span>
            : <span className='flex'><FontAwesomeIcon icon={faCircleXmark} className='text-red-900 w-6 pr-2'/>Incorrect</span>
          }  
          <button className="bg-gray-200 py-2 px-4 rounded mt-2 hover:ring-2 hover:bg-gray-300" onClick={handleNext}>Next</button>
        </div>
      }
    </div>
  )
}