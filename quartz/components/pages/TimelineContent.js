import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "../styles/timeline.scss";
import { resolveRelative } from "../../util/path";
import { htmlToJsx } from "../../util/jsx";
import { Date as DateDisplay, getDate } from "../Date";
const defaultOptions = {
  showCount: true,
  sortOrder: "newest",
};
function groupByYearMonth(files, cfg) {
  const groups = new Map();
  for (const file of files) {
    const date = getDate(cfg, file);
    if (!date) continue;
    const year = date.getFullYear();
    const month = date.getMonth();
    if (!groups.has(year)) {
      groups.set(year, new Map());
    }
    const yearGroup = groups.get(year);
    if (!yearGroup.has(month)) {
      yearGroup.set(month, []);
    }
    yearGroup.get(month).push(file);
  }
  return groups;
}
function getMonthName(month, locale) {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(2000, month, 1),
  );
}
export default (opts) => {
  const options = { ...defaultOptions, ...opts };
  const TimelineContent = (props) => {
    const { tree, fileData, allFiles, cfg } = props;
    // Filter files that have dates
    const filesWithDates = allFiles.filter(
      (file) => getDate(cfg, file) !== undefined,
    );
    // Sort files by date
    const sortedFiles = [...filesWithDates].sort((a, b) => {
      const dateA = getDate(cfg, a);
      const dateB = getDate(cfg, b);
      return options.sortOrder === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
    // Group by year and month
    const groups = groupByYearMonth(sortedFiles, cfg);
    // Sort years
    const sortedYears = [...groups.keys()].sort((a, b) =>
      options.sortOrder === "newest" ? b - a : a - b,
    );
    const content =
      tree.children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath, tree);
    const cssClasses = fileData.frontmatter?.cssclasses ?? [];
    const classes = cssClasses.join(" ");
    return _jsxs("div", {
      class: "popover-hint",
      children: [
        _jsx("article", { class: classes, children: content }),
        options.showCount &&
          _jsxs("p", {
            class: "timeline-count",
            children: [
              filesWithDates.length,
              " entries in chronological order",
            ],
          }),
        _jsx("div", {
          class: "timeline",
          children: sortedYears.map((year) => {
            const yearGroup = groups.get(year);
            const sortedMonths = [...yearGroup.keys()].sort((a, b) =>
              options.sortOrder === "newest" ? b - a : a - b,
            );
            return _jsxs(
              "div",
              {
                class: "timeline-year-section",
                children: [
                  _jsxs("div", {
                    class: "timeline-year",
                    children: [
                      _jsx("span", { class: "timeline-year-marker" }),
                      _jsx("h2", { children: year }),
                    ],
                  }),
                  sortedMonths.map((month) => {
                    const posts = yearGroup.get(month);
                    const monthName = getMonthName(month, cfg.locale);
                    return _jsxs(
                      "div",
                      {
                        class: "timeline-month-section",
                        children: [
                          _jsxs("div", {
                            class: "timeline-month",
                            children: [
                              _jsx("span", { class: "timeline-month-marker" }),
                              _jsx("h3", { children: monthName }),
                            ],
                          }),
                          _jsx("div", {
                            class: "timeline-entries",
                            children: posts.map((page) => {
                              const title = page.frontmatter?.title;
                              const tags = page.frontmatter?.tags ?? [];
                              const date = getDate(cfg, page);
                              return _jsxs(
                                "div",
                                {
                                  class: "timeline-entry",
                                  children: [
                                    _jsx("span", {
                                      class: "timeline-entry-connector",
                                    }),
                                    _jsxs("div", {
                                      class: "timeline-entry-card",
                                      children: [
                                        _jsx("div", {
                                          class: "timeline-entry-date",
                                          children: _jsx(DateDisplay, {
                                            date: date,
                                            locale: cfg.locale,
                                          }),
                                        }),
                                        _jsx("h4", {
                                          children: _jsx("a", {
                                            href: resolveRelative(
                                              fileData.slug,
                                              page.slug,
                                            ),
                                            class: "internal",
                                            children: title,
                                          }),
                                        }),
                                        tags.length > 0 &&
                                          _jsx("ul", {
                                            class: "timeline-entry-tags",
                                            children: tags.map((tag) =>
                                              _jsx(
                                                "li",
                                                {
                                                  children: _jsx("a", {
                                                    class: "internal tag-link",
                                                    href: resolveRelative(
                                                      fileData.slug,
                                                      `tags/${tag}`,
                                                    ),
                                                    children: tag,
                                                  }),
                                                },
                                                tag,
                                              ),
                                            ),
                                          }),
                                      ],
                                    }),
                                  ],
                                },
                                page.slug,
                              );
                            }),
                          }),
                        ],
                      },
                      `${year}-${month}`,
                    );
                  }),
                ],
              },
              year,
            );
          }),
        }),
      ],
    });
  };
  TimelineContent.css = style;
  return TimelineContent;
};
