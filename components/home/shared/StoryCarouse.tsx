import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  Story,
  StoryProgress,
  StoryControls,
  StorySlide,
  StoryOverlay,
} from './story'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const FABRIZIO_STORIES = [
  {
    title: 'Champions league will begin soon',
    caption: 'whos you are running for ?',
    storyImage: '/images/1.webp',
  },
  {
    title: "who's your favourite player ?",
    caption: 'who you think will win the champions league ?',
    storyImage: '/images/2.webp',
  },
]

const SHADCN_STORIES = [
  {
    title: 'Easy vibes',
    caption: 'In the System Prompts.',
    storyImage: '/images/3.webp',
  },
  {
    title: 'The new calendar.tsx is here',
    caption: `
      → Latest react-daypicker
      → Tailwind v3 and v4
      → Date, range & time pickers
      → Persian, Hijri & timezone support
      → 30+ examples to copy, paste, and build.
    `,
    storyImage: '/images/4.webp',
  },
  {
    title: '🤣🤣🤣🤣🤣',
    caption: 'Me walking away after adding min-w-0 and it works.',
    storyImage: '/images/1.webp',
  },
]

const NBA_STORIES = [
  {
    title: 'Shai follows 38 in Game 1 with 34 tonight 🔥🔥🔥',
    caption:
      'MOST POINTS EVER by a player in his first 2 career Finals games 🚨🚨',
    storyImage: '/images/1.webp',
  },
]

const StoryCarousel = () => {
  return (
    <section className="p-20 w-full place-content-center">
      <div className="flex gap-4 justify-center">
        {/* ======== FABRIZIO STORIES ======== */}
        <Dialog>
          <DialogTrigger>
            <Avatar className="size-12">
              <AvatarImage src="/images/01.webp" />
              <AvatarFallback>FR</AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="aspect-[12/16] w-auto h-[90vh] overflow-hidden p-0">
            <VisuallyHidden asChild>
              <DialogTitle>Story</DialogTitle>
            </VisuallyHidden>
            {/* ✅ Added Description */}
            <VisuallyHidden asChild>
              <DialogDescription>
                Instagram-style story viewer
              </DialogDescription>
            </VisuallyHidden>

            <Story
              className="relative size-full"
              duration={5000}
              mediaLength={FABRIZIO_STORIES.length}
            >
              <DialogHeader className="px-4 py-6">
                <div className="relative z-10 flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarImage src="/images/05.webp" alt="@fabrizioRomano" />
                    <AvatarFallback>FR</AvatarFallback>
                  </Avatar>
                  <StoryProgress
                    className="flex-1"
                    progressWrapClass="h-1.5"
                    progressActiveClass="bg-blue-500"
                  />
                  <StoryControls
                    variant="ghost"
                    className="text-white rounded-full"
                  />
                </div>
              </DialogHeader>
              {FABRIZIO_STORIES.map((story, idx) => (
                <StorySlide
                  key={idx}
                  index={idx}
                  className="absolute inset-0 size-full"
                >
                  <Image
                    src={story.storyImage}
                    className="w-full h-auto"
                    alt={story.title}
                    fill
                    draggable={false}
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 z-10 space-y-1 text-white p-4">
                    <a
                      className="text-secondary"
                      href="https://x.com/FabrizioRomano"
                    >
                      @FabrizioRomano
                    </a>
                    <h3 className="text-medium tracking-tight text-foreground-muted">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-200">{story.caption}</p>
                  </div>
                </StorySlide>
              ))}
              <StoryOverlay />
            </Story>
          </DialogContent>
        </Dialog>

        {/* ======== SHADCN STORIES ======== */}
        <Dialog>
          <DialogTrigger>
            <Avatar className="size-12">
              <AvatarImage src="/images/04.webp" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="aspect-[12/16] w-auto h-[90vh] overflow-hidden p-0 rounded-md">
            <VisuallyHidden asChild>
              <DialogTitle>Story</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden asChild>
              <DialogDescription>
                Instagram-style story viewer
              </DialogDescription>
            </VisuallyHidden>

            <Story
              className="relative size-full"
              duration={5000}
              mediaLength={SHADCN_STORIES.length}
            >
              <DialogHeader className="px-4 py-6">
                <div className="relative z-10 flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarImage src="/images/03.webp" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <StoryProgress
                    className="flex-1"
                    progressWrapClass="h-1.5"
                    progressActiveClass="bg-pink-500"
                  />
                  <StoryControls
                    variant="ghost"
                    className="text-white rounded-full"
                  />
                </div>
              </DialogHeader>
              {SHADCN_STORIES.map((story, idx) => (
                <StorySlide
                  key={idx}
                  index={idx}
                  className="absolute inset-0 size-full"
                >
                  <Image
                    src={story.storyImage}
                    className="w-full h-auto"
                    alt={story.title}
                    fill
                    draggable={false}
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 z-10 space-y-1 text-white p-4">
                    <a className="text-secondary" href="https://x.com/Shadcn">
                      @Shadcn
                    </a>
                    <h3 className="text-medium tracking-tight text-foreground-muted">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-200">{story.caption}</p>
                  </div>
                </StorySlide>
              ))}
              <StoryOverlay />
            </Story>
          </DialogContent>
        </Dialog>

        {/* ======== NBA STORIES ======== */}
        <Dialog>
          <DialogTrigger>
            <Avatar className="size-12">
              <AvatarImage src="/images/02.webp" alt="@nba" />
              <AvatarFallback>NB</AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent className="aspect-[12/16] w-auto h-[90vh] overflow-hidden p-0 rounded-md">
            <VisuallyHidden asChild>
              <DialogTitle>Story</DialogTitle>
            </VisuallyHidden>
            <VisuallyHidden asChild>
              <DialogDescription>
                Instagram-style story viewer
              </DialogDescription>
            </VisuallyHidden>

            <Story
              className="relative size-full"
              duration={8000}
              mediaLength={NBA_STORIES.length}
            >
              <DialogHeader className="px-4 py-6">
                <div className="relative z-10 flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarImage src="/images/01.webp" alt="@nba" />
                    <AvatarFallback>NB</AvatarFallback>
                  </Avatar>
                  <StoryProgress
                    className="flex-1"
                    progressWrapClass="h-1.5"
                    progressActiveClass="bg-red-500"
                  />
                  <StoryControls
                    variant="ghost"
                    className="text-white rounded-full"
                  />
                </div>
              </DialogHeader>
              {NBA_STORIES.map((story, idx) => (
                <StorySlide
                  key={idx}
                  index={idx}
                  className="absolute inset-0 size-full"
                >
                  <Image
                    src={story.storyImage}
                    className="w-full h-auto"
                    alt={story.title}
                    fill
                    draggable={false}
                    unoptimized
                  />
                  <div className="absolute bottom-4 left-4 z-10 space-y-1 text-white p-4">
                    <a className="text-secondary" href="https://x.com/nba">
                      @nba
                    </a>
                    <h3 className="text-medium tracking-tight text-foreground-muted">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-200">{story.caption}</p>
                  </div>
                </StorySlide>
              ))}
              <StoryOverlay />
            </Story>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

export default StoryCarousel
