import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, Chapter } from '@/mock/data'
import { mockQuestions } from '@/mock/data'

export interface LearningPlanItem {
  chapter: Chapter
  reason: string
}

export const useAssessmentStore = defineStore('assessment', () => {
  const currentStep = ref(0)
  const answers = ref<Record<string, string[]>>({})
  const knowledgeBlindSpots = ref<string[]>([])
  const completed = ref(false)
  const questions = ref<Question[]>(mockQuestions)

  const totalSteps = computed(() => questions.value.length)
  
  const currentQuestion = computed(() => questions.value[currentStep.value])

  const correctCount = computed(() => {
    let count = 0
    questions.value.forEach(q => {
      const userAnswer = answers.value[q.id] || []
      const isCorrect = 
        userAnswer.length === q.correctAnswers.length &&
        userAnswer.every(a => q.correctAnswers.includes(a))
      if (isCorrect) count++
    })
    return count
  })

  const accuracy = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round((correctCount.value / questions.value.length) * 100)
  })

  const submitAnswer = (questionId: string, selectedOptions: string[]) => {
    answers.value[questionId] = selectedOptions
  }

  const nextStep = () => {
    if (currentStep.value < totalSteps.value - 1) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const calculateBlindSpots = () => {
    questions.value.forEach(q => {
      const userAnswer = answers.value[q.id] || []
      const isCorrect = 
        userAnswer.length === q.correctAnswers.length &&
        userAnswer.every(a => q.correctAnswers.includes(a))
      if (!isCorrect) {
        if (!knowledgeBlindSpots.value.includes(q.knowledgePoint)) {
          knowledgeBlindSpots.value.push(q.knowledgePoint)
        }
      }
    })
    completed.value = true
  }

  const generateLearningPlan = (allChapters: Chapter[]): LearningPlanItem[] => {
    const plan: LearningPlanItem[] = []
    
    knowledgeBlindSpots.value.forEach(blindSpot => {
      const questionWithBlindSpot = questions.value.find(q => q.knowledgePoint === blindSpot)
      const chapter = allChapters.find(c => c.id === questionWithBlindSpot?.chapterId)
      if (chapter) {
        plan.push({
          chapter,
          reason: `针对知识盲点: ${blindSpot}`
        })
      }
    })

    return plan
  }

  const resetAssessment = () => {
    currentStep.value = 0
    answers.value = {}
    knowledgeBlindSpots.value = []
    completed.value = false
  }

  return {
    currentStep,
    answers,
    knowledgeBlindSpots,
    completed,
    questions,
    totalSteps,
    currentQuestion,
    correctCount,
    accuracy,
    submitAnswer,
    nextStep,
    prevStep,
    calculateBlindSpots,
    generateLearningPlan,
    resetAssessment
  }
})
