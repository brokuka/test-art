<!-- eslint-disable no-console -->
<script setup lang="ts">
import { buttonLang, localLang, noDataLang, pathLang } from '~/lib/translates'
import { getObjectKeyByValue } from '~/lib/utils'

const {
  breadcrumbs,
  currentFolder,
  currentLevelItems,
  getAbsolutePath,
  getLocaleName,
  navigateBack,
  navigateToBreadcrumb,
  navigateToItem,
  selectedLocale,
  isLastBreadcrumb,
} = await useTree()

// Debug logging
watchEffect(() => console.log('Current Folder:', currentFolder.value))
watchEffect(() => console.log('Current Level Items:', currentLevelItems.value))
watchEffect(() => console.log('Breadcrumbs:', breadcrumbs.value))
watchEffect(() => console.log('Selected Locale:', selectedLocale.value))
</script>

<template>
  <div class="container py-2">
    <div class="mb-4 flex justify-between items-center">
      <Button v-if="breadcrumbs.length" variant="outline" @click="navigateBack">
        {{ buttonLang[selectedLocale] }}
      </Button>

      <Select v-model="selectedLocale">
        <SelectTrigger class="w-[180px] ml-auto">
          <SelectValue placeholder="Language" />
        </SelectTrigger>

        <SelectContent class="z-10">
          <SelectItem v-for="locale in localLang" :key="locale" :value="getObjectKeyByValue(localLang, locale)">
            {{ locale }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <Breadcrumb>
      <BreadcrumbList class="mb-4">
        <BreadcrumbItem v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.id">
          <BreadcrumbLink
            href="/" :class="{
              'pointer-events-none text-blue-500': isLastBreadcrumb(index),
            }" @click.prevent="navigateToBreadcrumb(index)"
          >
            {{ getLocaleName(breadcrumb) }}
          </BreadcrumbLink>

          <BreadcrumbSeparator v-if=" index < breadcrumbs.length - 1" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div
      v-if="currentLevelItems.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" :class="{
        'mt-9': !breadcrumbs.length,
      }"
    >
      <Card v-for="item in currentLevelItems" :key="item.id" @click="navigateToItem(item)">
        <h3 class="font-semibold">
          {{ getLocaleName(item) }}
        </h3>

        <p class="text-gray-600">
          {{ pathLang[selectedLocale] }}: {{ getAbsolutePath(item) }}
        </p>
      </Card>
    </div>

    <span v-else>
      {{ noDataLang[selectedLocale] }}
    </span>
  </div>
</template>
