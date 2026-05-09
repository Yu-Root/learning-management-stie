<template>
  <div class="space-y-8" role="region" aria-label="数据仪表盘页面">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">学习数据概览</h2>
      <p class="text-gray-500">实时查看你的学习进度和能力分析</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="核心指标卡片列表">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100" role="listitem">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">本周学习时长</p>
            <p class="text-3xl font-bold text-gray-900">22.9 <span class="text-lg">小时</span></p>
          </div>
          <div class="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
            ⏱️
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100" role="listitem">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">已完成课程数</p>
            <p class="text-3xl font-bold text-gray-900">14 <span class="text-lg">门</span></p>
          </div>
          <div class="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
            📚
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100" role="listitem">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">平均正确率</p>
            <p class="text-3xl font-bold text-gray-900">84.3<span class="text-lg">%</span></p>
          </div>
          <div class="h-12 w-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
            ✅
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">学生能力雷达图</h3>
        <div 
          ref="radarChartRef" 
          class="w-full h-80"
          role="img"
          aria-label="能力雷达图，展示逻辑力、记忆力、应用力等六个维度的评分"
        ></div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">学习进度趋势图</h3>
        <div 
          ref="lineChartRef" 
          class="w-full h-80"
          role="img"
          aria-label="折线图，展示一周内学习时长和正确率的变化"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { mockAbilityScores, mockLearningHistory } from '@/mock/data'

const radarChartRef = ref<HTMLDivElement | null>(null)
const lineChartRef = ref<HTMLDivElement | null>(null)
let radarChart: echarts.ECharts | null = null
let lineChart: echarts.ECharts | null = null

const initRadarChart = () => {
  if (!radarChartRef.value) return
  
  radarChart = echarts.init(radarChartRef.value)
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: '逻辑力', max: 100 },
        { name: '记忆力', max: 100 },
        { name: '应用力', max: 100 },
        { name: '创造力', max: 100 },
        { name: '理解力', max: 100 },
        { name: '分析力', max: 100 }
      ],
      radius: '70%'
    },
    series: [
      {
        name: '能力评分',
        type: 'radar',
        data: [
          {
            value: [
              mockAbilityScores.logic,
              mockAbilityScores.memory,
              mockAbilityScores.application,
              mockAbilityScores.creativity,
              mockAbilityScores.comprehension,
              mockAbilityScores.analysis
            ],
            name: '我的能力',
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.3)'
            },
            lineStyle: {
              color: '#3b82f6'
            },
            itemStyle: {
              color: '#3b82f6'
            }
          }
        ]
      }
    ]
  }
  
  radarChart.setOption(option)
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  
  lineChart = echarts.init(lineChartRef.value)
  
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['学习时长(小时)', '正确率(%)']
    },
    xAxis: {
      type: 'category',
      data: mockLearningHistory.map(d => d.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '学习时长(小时)',
        position: 'left'
      },
      {
        type: 'value',
        name: '正确率(%)',
        position: 'right',
        max: 100
      }
    ],
    series: [
      {
        name: '学习时长(小时)',
        type: 'bar',
        data: mockLearningHistory.map(d => d.studyHours),
        color: '#3b82f6'
      },
      {
        name: '正确率(%)',
        type: 'line',
        yAxisIndex: 1,
        data: mockLearningHistory.map(d => d.accuracy),
        color: '#10b981',
        smooth: true
      }
    ]
  }
  
  lineChart.setOption(option)
}

const handleResize = () => {
  radarChart?.resize()
  lineChart?.resize()
}

onMounted(() => {
  initRadarChart()
  initLineChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  radarChart?.dispose()
  lineChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>
