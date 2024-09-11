export default defineEventHandler(async () => {
  const data = await $fetch('./data.json', {
    baseURL: 'http://localhost:3000',
  })

  return data
})
