import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import TimelineContent from "../../components/pages/TimelineContent"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

interface TimelinePageOptions extends FullPageLayout {
  sortOrder?: "newest" | "oldest"
}

function getTimelineContent(content: ProcessedContent[]): ProcessedContent {
  // Look for a timeline.md file in the content
  for (const [tree, file] of content) {
    const slug = file.data.slug!
    if (slug === "timeline") {
      return [tree, file]
    }
  }

  // Return default content if no timeline.md found
  return defaultProcessedContent({
    slug: "timeline" as FullSlug,
    frontmatter: {
      title: "Timeline",
      tags: [],
    },
  })
}

async function processTimelinePage(
  ctx: BuildCtx,
  timelineContent: ProcessedContent,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const slug = "timeline" as FullSlug
  const [tree, file] = timelineContent
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData: file.data,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  const content = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({
    ctx,
    content,
    slug,
    ext: ".html",
  })
}

export const TimelinePage: QuartzEmitterPlugin<Partial<TimelinePageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TimelineContent({ sortOrder: userOpts?.sortOrder }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "TimelinePage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const timelineContent = getTimelineContent(content)
      yield processTimelinePage(ctx, timelineContent, allFiles, opts, resources)
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      // Rebuild timeline page if any file changes (since it aggregates all files)
      const hasChanges = changeEvents.length > 0
      if (hasChanges) {
        const allFiles = content.map((c) => c[1].data)
        const timelineContent = getTimelineContent(content)
        yield processTimelinePage(ctx, timelineContent, allFiles, opts, resources)
      }
    },
  }
}
