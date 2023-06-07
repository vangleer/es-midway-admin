<template>
  <div class="es-content">
    <div class="es-views">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>
