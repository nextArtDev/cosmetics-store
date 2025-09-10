'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Stories,
  StoriesContent,
  Story,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryOverlay,
  StoryVideo,
} from './stories'

const stories = [
  {
    id: 1,
    author: 'ماسک صورت',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    fallback: 'AJ',
    video: '/videos/vs1.mp4',
  },
  {
    id: 2,
    author: 'آبرسان پوست',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    fallback: 'SC',
    video: '/videos/vs3.mp4',
  },
  {
    id: 3,
    author: 'رژ لب',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    fallback: 'MR',
    video: '/videos/vs4.mp4',
  },
  {
    id: 4,
    author: 'کرم پودر',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    fallback: 'EW',
    video: '/videos/vs5.mp4',
  },
]

const VideoStoryCarousel = () => (
  <section dir="ltr" className="w-full h-full">
    <Stories>
      <StoriesContent className="p-2 ">
        {stories.map((story) => (
          <ScrollArea
            key={story.id}
            dir="ltr"
            className="w-full whitespace-nowrap rounded-md"
          >
            <Story className="aspect-[3/4] w-[220px] ">
              <StoryVideo src={story.video} />
              <StoryOverlay />
              <StoryAuthor>
                {/* <StoryAuthorImage
                  fallback={story.fallback}
                  name={story.author}
                  src={story.avatar}
                /> */}
                <StoryAuthorName>{story.author}</StoryAuthorName>
              </StoryAuthor>
            </Story>
          </ScrollArea>
        ))}
      </StoriesContent>
    </Stories>
  </section>
)

export default VideoStoryCarousel
