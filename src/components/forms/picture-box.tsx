'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon } from 'lucide-react'

export function PictureBox() {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="aspect-square w-full relative bg-muted rounded-md overflow-hidden">
          {image ? (
            <Image
              src={image || "/placeholder.svg"}
              alt="Attached picture"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Input
          id="profile_pic"
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button onClick={handleAttachClick} className="w-full">
          Attach Picture
        </Button>
      </CardFooter>
    </Card>
  )
}

