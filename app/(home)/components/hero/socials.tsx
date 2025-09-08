import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Facebook, Instagram, TwitterIcon } from 'lucide-react'
import React from 'react'

const Socials = () => {
  return (
    <div className="w-full h-full">
      <div className="mb-0 flex items-center  space-x-1  ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-sm"
              >
                <Facebook className="h-2 w-2 bg-transparent" />
                <span className="sr-only">Facebook</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Follow us on Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-sm"
              >
                <TwitterIcon className="h-2 w-2 bg-transparent" />
                <span className="sr-only">Twitter</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Follow us on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-sm"
              >
                <Instagram className="h-2 w-2 bg-transparent" />
                <span className="sr-only">Instagram</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Follow us on Instagram</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Socials
