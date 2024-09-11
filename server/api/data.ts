export default defineEventHandler(async () => {
  const data = await $fetch('./data.json', {
    baseURL: import.meta.dev ? 'http://localhost:3000' : 'https://test-art.vercel.app/',
  })

  return data
})
