import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { mockCourses } from '@/mock/data'
import type { Course, Question } from '@/mock/data'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>(mockCourses)
  const currentCourseId = ref<string | null>(null)
  const currentTime = ref(0)
  const totalDuration = ref(0)
  const consecutiveCorrectCount = ref(0)
  const consecutiveWrongCount = ref(0)
  const showQuizModal = ref(false)
  const currentQuizQuestion = ref<Question | null>(null)
  const quizProgressPoints = ref([0.3, 0.7])
  const shownQuizPoints = ref<number[]>([])

  const currentCourse = computed(() => 
    courses.value.find(c => c.id === currentCourseId.value) || null
  )

  const currentProgress = computed(() => {
    if (!totalDuration.value) return 0
    return currentTime.value / totalDuration.value
  })

  const loadProgressFromStorage = () => {
    const saved = localStorage.getItem('learning-progress')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.courseId === currentCourseId.value) {
          currentTime.value = data.currentTime || 0
        }
      } catch (e) {
        console.error('Failed to load progress', e)
      }
    }
  }

  const saveProgressToStorage = () => {
    if (currentCourseId.value) {
      localStorage.setItem('learning-progress', JSON.stringify({
        courseId: currentCourseId.value,
        currentTime: currentTime.value,
        timestamp: Date.now()
      }))
    }
  }

  watch([currentTime, currentCourseId], () => {
    saveProgressToStorage()
  }, { deep: true })

  const setCurrentCourse = (courseId: string) => {
    currentCourseId.value = courseId
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      totalDuration.value = course.duration
      loadProgressFromStorage()
      shownQuizPoints.value = []
    }
  }

  const updatePlayTime = (time: number) => {
    currentTime.value = time
  }

  const checkShouldShowQuiz = (): Question | null => {
    const progress = currentProgress.value
    for (const point of quizProgressPoints.value) {
      if (progress >= point && !shownQuizPoints.value.includes(point)) {
        shownQuizPoints.value.push(point)
        const mockQuestions = [
          {
            id: 'vq1',
            type: 'single' as const,
            text: '关于本节内容，以下说法正确的是？',
            options: [
              { id: 'vo1', text: '选项A' },
              { id: 'vo2', text: '选项B（正确答案）' },
              { id: 'vo3', text: '选项C' },
              { id: 'vo4', text: '选项D' }
            ],
            correctAnswers: ['vo2'],
            difficulty: 'easy' as const,
            knowledgePoint: '当前章节'
          },
          {
            id: 'vq2',
            type: 'multiple' as const,
            text: '以下哪些知识点你已经掌握？（多选）',
            options: [
              { id: 'vo1', text: '知识点A' },
              { id: 'vo2', text: '知识点B' },
              { id: 'vo3', text: '知识点C' },
              { id: 'vo4', text: '知识点D' }
            ],
            correctAnswers: ['vo1', 'vo2', 'vo3'],
            difficulty: 'medium' as const,
            knowledgePoint: '当前章节'
          }
        ]
        const q = mockQuestions[Math.floor(Math.random() * mockQuestions.length)]
        return q
      }
    }
    return null
  }

  const submitQuizResult = (isCorrect: boolean) => {
    if (isCorrect) {
      consecutiveCorrectCount.value++
      consecutiveWrongCount.value = 0
    } else {
      consecutiveWrongCount.value++
      consecutiveCorrectCount.value = 0
    }
    adjustCourseDifficulty()
    showQuizModal.value = false
  }

  const adjustCourseDifficulty = () => {
    courses.value.forEach((_course, index) => {
      if (consecutiveCorrectCount.value >= 2) {
        courses.value[index].difficultyTag = '进阶'
      }
      if (consecutiveCorrectCount.value >= 3) {
        courses.value[index].difficultyTag = '困难'
      }
      if (consecutiveWrongCount.value >= 2) {
        courses.value[index].difficultyTag = '基础巩固'
      }
    })
  }

  const resetCourseProgress = () => {
    currentTime.value = 0
    consecutiveCorrectCount.value = 0
    consecutiveWrongCount.value = 0
    shownQuizPoints.value = []
  }

  return {
    courses,
    currentCourseId,
    currentTime,
    totalDuration,
    currentCourse,
    currentProgress,
    showQuizModal,
    currentQuizQuestion,
    consecutiveCorrectCount,
    consecutiveWrongCount,
    setCurrentCourse,
    updatePlayTime,
    loadProgressFromStorage,
    saveProgressToStorage,
    checkShouldShowQuiz,
    submitQuizResult,
    resetCourseProgress
  }
})
