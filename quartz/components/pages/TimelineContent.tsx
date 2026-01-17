import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/timeline.scss"
import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { ComponentChildren } from "preact"
import { Date as DateDisplay, getDate } from "../Date"

interface TimelineContentOptions {
  /**
   * Whether to display the total count of posts
   */
  showCount: boolean
  /**
   * Sort order: "newest" or "oldest" first
   */
  sortOrder: "newest" | "oldest"
}

const defaultOptions: TimelineContentOptions = {
  showCount: true,
  sortOrder: "newest",
}

type YearMonthGroup = Map<number, Map<number, QuartzPluginData[]>>

function groupByYearMonth(
  files: QuartzPluginData[],
  cfg: QuartzComponentProps["cfg"],
): YearMonthGroup {
  const groups: YearMonthGroup = new Map()

  for (const file of files) {
    const date = getDate(cfg, file)
    if (!date) continue

    const year = date.getFullYear()
    const month = date.getMonth()

    if (!groups.has(year)) {
      groups.set(year, new Map())
    }
    const yearGroup = groups.get(year)!
    if (!yearGroup.has(month)) {
      yearGroup.set(month, [])
    }
    yearGroup.get(month)!.push(file)
  }

  return groups
}

function getMonthName(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, month, 1))
}

export default ((opts?: Partial<TimelineContentOptions>) => {
  const options: TimelineContentOptions = { ...defaultOptions, ...opts }

  const TimelineContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    // Filter files that have dates
    const filesWithDates = allFiles.filter((file) => getDate(cfg, file) !== undefined)

    // Sort files by date
    const sortedFiles = [...filesWithDates].sort((a, b) => {
      const dateA = getDate(cfg, a)!
      const dateB = getDate(cfg, b)!
      return options.sortOrder === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime()
    })

    // Group by year and month
    const groups = groupByYearMonth(sortedFiles, cfg)

    // Sort years
    const sortedYears = [...groups.keys()].sort((a, b) =>
      options.sortOrder === "newest" ? b - a : a - b,
    )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        {options.showCount && (
          <p class="timeline-count">{filesWithDates.length} entries in chronological order</p>
        )}
        <div class="timeline">
          {sortedYears.map((year) => {
            const yearGroup = groups.get(year)!
            const sortedMonths = [...yearGroup.keys()].sort((a, b) =>
              options.sortOrder === "newest" ? b - a : a - b,
            )

            return (
              <div class="timeline-year-section" key={year}>
                <div class="timeline-year">
                  <span class="timeline-year-marker"></span>
                  <h2>{year}</h2>
                </div>
                {sortedMonths.map((month) => {
                  const posts = yearGroup.get(month)!
                  const monthName = getMonthName(month, cfg.locale)

                  return (
                    <div class="timeline-month-section" key={`${year}-${month}`}>
                      <div class="timeline-month">
                        <span class="timeline-month-marker"></span>
                        <h3>{monthName}</h3>
                      </div>
                      <div class="timeline-entries">
                        {posts.map((page) => {
                          const title = page.frontmatter?.title
                          const tags = page.frontmatter?.tags ?? []
                          const date = getDate(cfg, page)!

                          return (
                            <div class="timeline-entry" key={page.slug}>
                              <span class="timeline-entry-connector"></span>
                              <div class="timeline-entry-card">
                                <div class="timeline-entry-date">
                                  <DateDisplay date={date} locale={cfg.locale} />
                                </div>
                                <h4>
                                  <a
                                    href={resolveRelative(fileData.slug!, page.slug!)}
                                    class="internal"
                                  >
                                    {title}
                                  </a>
                                </h4>
                                {tags.length > 0 && (
                                  <ul class="timeline-entry-tags">
                                    {tags.map((tag) => (
                                      <li key={tag}>
                                        <a
                                          class="internal tag-link"
                                          href={resolveRelative(
                                            fileData.slug!,
                                            `tags/${tag}` as FullSlug,
                                          )}
                                        >
                                          {tag}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  TimelineContent.css = style
  return TimelineContent
}) satisfies QuartzComponentConstructor
