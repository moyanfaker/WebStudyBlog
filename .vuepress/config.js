module.exports = {
  title: "moyan's life",
  description: "record my study",
  dest: "public",
  base: "/WebStudyBlog/",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "Home",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "TimeLine",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        text: "Docs",
        icon: "reco-message",
        items: [
          {
            text: "vuepress-reco",
            link: "/docs/theme-reco/",
          },
        ],
      },
      {
        text: "Contact",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/moyanfaker",
            icon: "reco-github",
          },
        ],
      },
    ],
    sidebar: {
      "/docs/theme-reco/": ["", "theme", "plugin", "api"],
    },
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "Category",
      },
      tag: {
        location: 3,
        text: "Tag",
      },
    },
    friendLink: [
      {
        title: "我的个人",
        desc: "Enjoy when you can, and endure when you must.",
        email: "9248775690@qq.com",
        link: "https://github.com/moyanfaker",
      },
      {
        title: "前端学习Blog",
        desc: "Record my Web first-end Study",
        avatar: "/头像.png",
        link: "https://moyanfaker.github.io/WebStudyBlog",
      },
    ],
    logo: "/头像.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "moyanfaker",
    authorAvatar: "/头像.png",
    record: "WebStudy",
    startYear: "2017",
  },
  markdown: {
    lineNumbers: true,
  },
};
