<template>
  <div class="es-home">
    <section class="es-home-action">
      <el-row style="width: 100%;" :gutter="20">
        <el-col v-for="item in actions" :key="item.icon" :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="es-home-action-item">
            <el-icon size="32" :color="item.color">
              <component :is="item.icon" />
            </el-icon>
            <Vue3Odometer :style="{ color: item.color }" class="es-action-text" :value="item.value" />
          </div>
        </el-col>
      </el-row>
    </section>
    <div class="es-home-charts">
      <el-row style="width: 100%;" :gutter="20">
        <el-col v-for="(option, index) in charts" :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="es-home-charts-item">
            <v-chart class="chart" :option="option" autoresize />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Vue3Odometer from 'vue3-odometer'
import 'odometer/themes/odometer-theme-default.css'
import { ref, onMounted } from 'vue'
const actions = ref([
  { color: 'rgb(24, 144, 255)', icon: 'KnifeFork', value: 0 },
  { color: 'rgb(255, 192, 105)', icon: 'IceTea', value: 0 },
  { color: 'rgb(92, 219, 211)', icon: 'Coffee', value: 0 },
  { color: 'rgb(179, 127, 235)', icon: 'IceCream', value: 0 },
  { color: 'rgb(255, 133, 192)', icon: 'Dessert', value: 0 },
  { color: 'rgb(255, 214, 102)', icon: 'GobletFull', value: 0 }
])
const commonOptions = {
  tooltip: {
    trigger: 'item'
  },
  grid: {
    top: '15%',
    bottom: '10%'
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false
    },
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
}
const charts = [
  {
    title: {
      text: '折线图',
      left: 'center',
    },
    ...commonOptions,
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  },
  {
    title: {
      text: 'Traffic Sources',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
    },
    series: [
      {
        name: 'Traffic Sources',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: 'Direct' },
          { value: 310, name: 'Email' },
          { value: 234, name: 'Ad Networks' },
          { value: 135, name: 'Video Ads' },
          { value: 1548, name: 'Search Engines' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  },
  {
    title: {
      text: '柱状图',
      left: 'center',
    },
    ...commonOptions,
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  }
]

onMounted(() => {
  actions.value.forEach(item => {
    item.value = Math.floor(Math.random() * 999) + 1
  })
})
</script>

<style lang='scss' scoped>
.es-home {
  width: 100%;
}
.es-home-action {
  width: 100%;
  display: flex;
  &-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ebeef5;
    transition: box-shadow 0.3s;
    cursor: pointer;
    border-radius: 2px;
    padding: 20px;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 20px;
    .es-action-text {
      margin-top: 16px;
    }

    &:hover {
      box-shadow: var(--es-box-shadow);
    }

    &+& {
      margin-left: 20px;
    }
  }
}

.es-home-charts {
  width: 100%;
  &-item {
    box-sizing: border-box;
    flex: 1;
    background-color: #fff;
    padding: 20px;
    box-shadow: var(--es-box-shadow);
    margin-bottom: 20px;
    height: 260px;
  }
}

</style>
