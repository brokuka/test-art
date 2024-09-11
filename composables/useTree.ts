import type { Child, Data, LocaleOptions, Tree } from '~/lib/types'

export async function useTree() {
  const { data } = await useFetch<Data>('/api/data')

  const breadcrumbs = ref<Tree[]>([])
  const currentFolder = ref<Tree | null>(null)

  const selectedLocale = ref(data.value?.locale ?? 'ru')

  const hasValidLocale = (item: Tree | Child): boolean => {
    return item.locale && Object.keys(item.locale).some((key) => {
      const localeData = item.locale[key]

      return localeData && Object.keys(localeData).length
    })
  }

  const currentLevelItems = computed(() => {
    if (!data.value?.page_data.tree)
      return []

    const items = breadcrumbs.value.length === 0 ? data.value?.page_data.tree : (currentFolder.value?.childs || [])
    return items.filter(item => hasValidLocale(item))
  })

  const getLocaleItem = (item: Tree | Child): LocaleOptions | null => {
    if (!hasValidLocale(item))
      return null

    if (item.locale[selectedLocale.value] && Object.keys(item.locale[selectedLocale.value]).length) {
      return item.locale[selectedLocale.value]
    }

    const availableLocales = Object.keys(item.locale)
    for (const locale of availableLocales) {
      if (item.locale[locale] && Object.keys(item.locale[locale]).length) {
        return item.locale[locale]
      }
    }

    return null
  }

  const getLocaleName = (item: Tree | Child): string => {
    const localeItem = getLocaleItem(item)
    return localeItem?.cg_name || ''
  }

  const getAbsolutePath = (item: Tree | Child): string => {
    const localeItem = getLocaleItem(item)
    if (!localeItem)
      return ''

    const path = [...breadcrumbs.value, item].map((breadcrumb, index, array) => {
      const localeBreadcrumb = getLocaleItem(breadcrumb)
      if (!localeBreadcrumb)
        return ''

      return index === array.length - 1 && item.numchild === 0
        ? `${breadcrumb.id}_${localeBreadcrumb.cg_slug}`
        : localeBreadcrumb.cg_slug
    }).filter(Boolean)

    return path.join('/')
  }

  const navigateToItem = (item: Tree | Child) => {
    breadcrumbs.value.push(item)
    currentFolder.value = item
  }

  const navigateBack = () => {
    if (breadcrumbs.value.length > 0) {
      breadcrumbs.value.pop()
      currentFolder.value = breadcrumbs.value[breadcrumbs.value.length - 1] || null
    }
  }

  const navigateToBreadcrumb = (index: number) => {
    if (breadcrumbs.value.length >= 2 && breadcrumbs.value[index] === breadcrumbs.value.at(-1))
      return

    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    currentFolder.value = breadcrumbs.value[breadcrumbs.value.length - 1]
  }

  const isLastBreadcrumb = (index: number) => {
    return breadcrumbs.value.length >= 2 && breadcrumbs.value[index] === breadcrumbs.value.at(-1)
  }

  return {
    breadcrumbs,
    currentFolder,
    currentLevelItems,
    selectedLocale,
    getLocaleItem,
    getLocaleName,
    getAbsolutePath,
    navigateToItem,
    navigateBack,
    navigateToBreadcrumb,
    isLastBreadcrumb,
  }
}
