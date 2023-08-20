export default function delay(time?: number) {
  return new Promise<void>((resolve) => {
    const ms = time ? time : 0
    setTimeout(() => resolve(), ms < 0 ? 0 : ms)
  })
}
