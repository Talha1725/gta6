"use client"

import { useEffect, useRef } from "react"

export default function PriceHistoryChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data points (price in ETH over time)
    const data = [
      { date: "Jul 21", price: 10 },
      { date: "Jan 22", price: 12 },
      { date: "Jul 22", price: 15 },
      { date: "Jan 23", price: 18 },
      { date: "Jul 23", price: 22 },
      { date: "Jan 24", price: 25 },
      { date: "Jul 24", price: 30 },
    ]

    // Chart dimensions
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart background
    ctx.fillStyle = "#231A2D"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Find max price for scaling
    const maxPrice = Math.max(...data.map((d) => d.price)) * 1.1

    // Draw grid lines
    ctx.strokeStyle = "#3A2A45"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw price points and connect them
    ctx.beginPath()
    ctx.strokeStyle = "#F0B90B" // Gold/yellow color similar to the image
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth
      const y = padding + chartHeight - (point.price / maxPrice) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#F0B90B"
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw date label
      if (i % 2 === 0) {
        ctx.fillStyle = "#999"
        ctx.font = "10px var(--font-pixel), monospace"
        ctx.textAlign = "center"
        ctx.fillText(point.date, x, canvas.height - 10)
      }
    })

    ctx.stroke()

    // Draw y-axis labels (price)
    ctx.fillStyle = "#999"
    ctx.font = "10px var(--font-pixel), monospace"
    ctx.textAlign = "right"

    const yLabels = 5
    for (let i = 0; i <= yLabels; i++) {
      const value = Math.round((maxPrice * i) / yLabels)
      const y = padding + chartHeight - (i / yLabels) * chartHeight
      ctx.fillText(value.toString(), padding - 10, y + 3)
    }

    // Add "Value (ETH)" label on the left side
    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillStyle = "#999"
    ctx.font = "10px var(--font-pixel), monospace"
    ctx.fillText("Value (ETH)", 0, 0)
    ctx.restore()

    // Add "Average Price" label on the right side
    ctx.save()
    ctx.translate(canvas.width - 15, canvas.height / 2)
    ctx.rotate(Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillStyle = "#999"
    ctx.font = "10px var(--font-pixel), monospace"
    ctx.fillText("Average Price", 0, 0)
    ctx.restore()
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
