export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: string
  type: 'single' | 'multiple'
  text: string
  options: QuestionOption[]
  correctAnswers: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  knowledgePoint: string
  chapterId?: string
}

export interface Chapter {
  id: string
  title: string
  description: string
  duration: number
}

export interface Course {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  chapters: Chapter[]
  difficultyTag: '基础巩固' | '进阶' | '困难'
  progress: number
}

export interface LearningRecord {
  date: string
  studyHours: number
  courseCompleted: number
  accuracy: number
}

export interface AbilityScore {
  logic: number
  memory: number
  application: number
  creativity: number
  comprehension: number
  analysis: number
}

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'single',
    text: '以下哪个选项是 JavaScript 中声明变量的关键字？',
    options: [
      { id: 'o1', text: 'var' },
      { id: 'o2', text: 'int' },
      { id: 'o3', text: 'string' },
      { id: 'o4', text: 'float' }
    ],
    correctAnswers: ['o1'],
    difficulty: 'easy',
    knowledgePoint: 'JavaScript基础',
    chapterId: 'ch1'
  },
  {
    id: 'q2',
    type: 'multiple',
    text: '以下哪些是 Vue 3 的核心特性？（多选）',
    options: [
      { id: 'o1', text: 'Composition API' },
      { id: 'o2', text: 'Teleport' },
      { id: 'o3', text: 'Class 组件' },
      { id: 'o4', text: 'Suspense' }
    ],
    correctAnswers: ['o1', 'o2', 'o4'],
    difficulty: 'medium',
    knowledgePoint: 'Vue3核心概念',
    chapterId: 'ch2'
  },
  {
    id: 'q3',
    type: 'single',
    text: 'CSS 中 flex-direction 的默认值是什么？',
    options: [
      { id: 'o1', text: 'column' },
      { id: 'o2', text: 'row' },
      { id: 'o3', text: 'row-reverse' },
      { id: 'o4', text: 'column-reverse' }
    ],
    correctAnswers: ['o2'],
    difficulty: 'easy',
    knowledgePoint: 'Flex布局',
    chapterId: 'ch3'
  },
  {
    id: 'q4',
    type: 'multiple',
    text: '以下哪些是 TypeScript 的基本类型？（多选）',
    options: [
      { id: 'o1', text: 'number' },
      { id: 'o2', text: 'boolean' },
      { id: 'o3', text: 'string' },
      { id: 'o4', text: 'object' }
    ],
    correctAnswers: ['o1', 'o2', 'o3'],
    difficulty: 'medium',
    knowledgePoint: 'TypeScript基础',
    chapterId: 'ch4'
  },
  {
    id: 'q5',
    type: 'single',
    text: 'HTTP 状态码 404 代表什么含义？',
    options: [
      { id: 'o1', text: '服务器错误' },
      { id: 'o2', text: '请求成功' },
      { id: 'o3', text: '资源未找到' },
      { id: 'o4', text: '重定向' }
    ],
    correctAnswers: ['o3'],
    difficulty: 'easy',
    knowledgePoint: 'HTTP协议',
    chapterId: 'ch5'
  },
  {
    id: 'q6',
    type: 'single',
    text: 'React 中用于管理组件状态的 Hook 是？',
    options: [
      { id: 'o1', text: 'useEffect' },
      { id: 'o2', text: 'useState' },
      { id: 'o3', text: 'useContext' },
      { id: 'o4', text: 'useRef' }
    ],
    correctAnswers: ['o2'],
    difficulty: 'medium',
    knowledgePoint: 'React基础',
    chapterId: 'ch6'
  },
  {
    id: 'q7',
    type: 'multiple',
    text: '以下哪些是常用的状态管理库？（多选）',
    options: [
      { id: 'o1', text: 'Redux' },
      { id: 'o2', text: 'Pinia' },
      { id: 'o3', text: 'Vuex' },
      { id: 'o4', text: 'Express' }
    ],
    correctAnswers: ['o1', 'o2', 'o3'],
    difficulty: 'hard',
    knowledgePoint: '状态管理',
    chapterId: 'ch7'
  },
  {
    id: 'q8',
    type: 'single',
    text: 'Git 中用于创建新分支的命令是？',
    options: [
      { id: 'o1', text: 'git new' },
      { id: 'o2', text: 'git branch' },
      { id: 'o3', text: 'git create' },
      { id: 'o4', text: 'git make' }
    ],
    correctAnswers: ['o2'],
    difficulty: 'easy',
    knowledgePoint: 'Git版本控制',
    chapterId: 'ch8'
  }
]

export const mockCourses: Course[] = [
  {
    id: 'course1',
    title: 'Vue 3 入门到精通',
    description: '全面掌握 Vue 3 的核心概念与实战技巧',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop',
    duration: 3600,
    chapters: [
      { id: 'ch1', title: 'Vue 3 环境搭建', description: '安装 Node.js 和创建项目', duration: 600 },
      { id: 'ch2', title: 'Composition API 详解', description: '深入理解 setup 语法', duration: 1200 },
      { id: 'ch3', title: '响应式原理', description: 'Ref 和 Reactive 的工作机制', duration: 900 },
      { id: 'ch4', title: '组件通信', description: 'Props、Emit、Provide/Inject', duration: 900 }
    ],
    difficultyTag: '基础巩固',
    progress: 0
  },
  {
    id: 'course2',
    title: 'TypeScript 高级实战',
    description: '掌握 TypeScript 类型系统的高级用法',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
    duration: 2700,
    chapters: [
      { id: 'ch5', title: '类型基础', description: '基本数据类型介绍', duration: 450 },
      { id: 'ch6', title: '接口与类型别名', description: 'Interface 和 Type 的区别', duration: 750 },
      { id: 'ch7', title: '泛型编程', description: '灵活的类型参数化', duration: 900 },
      { id: 'ch8', title: '类型体操', description: '高级类型操作', duration: 600 }
    ],
    difficultyTag: '进阶',
    progress: 0
  },
  {
    id: 'course3',
    title: 'ECharts 数据可视化',
    description: '使用 ECharts 构建炫酷的数据图表',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    duration: 2400,
    chapters: [
      { id: 'ch9', title: 'ECharts 基础配置', description: '初始化和基础配置项', duration: 600 },
      { id: 'ch10', title: '柱状图与折线图', description: '常用图表类型详解', duration: 900 },
      { id: 'ch11', title: '雷达图与饼图', description: '特殊图表的使用场景', duration: 900 }
    ],
    difficultyTag: '困难',
    progress: 0
  }
]

export const mockLearningHistory: LearningRecord[] = [
  { date: '周一', studyHours: 2.5, courseCompleted: 1, accuracy: 85 },
  { date: '周二', studyHours: 3.2, courseCompleted: 2, accuracy: 78 },
  { date: '周三', studyHours: 1.8, courseCompleted: 1, accuracy: 92 },
  { date: '周四', studyHours: 4.0, courseCompleted: 3, accuracy: 88 },
  { date: '周五', studyHours: 2.1, courseCompleted: 2, accuracy: 75 },
  { date: '周六', studyHours: 5.5, courseCompleted: 4, accuracy: 90 },
  { date: '周日', studyHours: 3.8, courseCompleted: 3, accuracy: 82 }
]

export const mockAbilityScores: AbilityScore = {
  logic: 78,
  memory: 85,
  application: 72,
  creativity: 65,
  comprehension: 80,
  analysis: 70
}
