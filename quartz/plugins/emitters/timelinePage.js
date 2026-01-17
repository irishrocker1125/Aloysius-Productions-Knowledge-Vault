import HeaderConstructor from "../../components/Header";
import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { defaultProcessedContent } from "../vfile";
import { pathToRoot } from "../../util/path";
import {
  defaultListPageLayout,
  sharedPageComponents,
} from "../../../quartz.layout";
import TimelineContent from "../../components/pages/TimelineContent";
import { write } from "./helpers";
function getTimelineContent(content) {
  // Look for a timeline.md file in the content
  for (const [tree, file] of content) {
    const slug = file.data.slug;
    if (slug === "timeline") {
      return [tree, file];
    }
  }
  // Return default content if no timeline.md found
  return defaultProcessedContent({
    slug: "timeline",
    frontmatter: {
      title: "Timeline",
      tags: [],
    },
  });
}
async function processTimelinePage(
  ctx,
  timelineContent,
  allFiles,
  opts,
  resources,
) {
  const slug = "timeline";
  const [tree, file] = timelineContent;
  const cfg = ctx.cfg.configuration;
  const externalResources = pageResources(pathToRoot(slug), resources);
  const componentData = {
    ctx,
    fileData: file.data,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  };
  const content = renderPage(cfg, slug, componentData, opts, externalResources);
  return write({
    ctx,
    content,
    slug,
    ext: ".html",
  });
}
export const TimelinePage = (userOpts) => {
  const opts = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TimelineContent({ sortOrder: userOpts?.sortOrder }),
    ...userOpts,
  };
  const {
    head: Head,
    header,
    beforeBody,
    pageBody,
    afterBody,
    left,
    right,
    footer: Footer,
  } = opts;
  const Header = HeaderConstructor();
  const Body = BodyConstructor();
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
      ];
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data);
      const timelineContent = getTimelineContent(content);
      yield processTimelinePage(
        ctx,
        timelineContent,
        allFiles,
        opts,
        resources,
      );
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      // Rebuild timeline page if any file changes (since it aggregates all files)
      const hasChanges = changeEvents.length > 0;
      if (hasChanges) {
        const allFiles = content.map((c) => c[1].data);
        const timelineContent = getTimelineContent(content);
        yield processTimelinePage(
          ctx,
          timelineContent,
          allFiles,
          opts,
          resources,
        );
      }
    },
  };
};
