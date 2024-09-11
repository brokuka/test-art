<script setup lang="ts">
const emits = defineEmits<{
  click: []
}>()

function onClickCard() {
  emits('click')
}
</script>

<template>
  <button
    class="flex flex-col border border-input bg-background hover:bg-accent rounded-lg p-4 cursor-pointer hover:text-accent-foreground transition-colors"
    @click="onClickCard"
  >
    <slot />
  </button>
</template>
