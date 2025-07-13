export const themes = [
  { value: "light", label: "Light", icon: "/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/icons/moon.svg" },
  { value: "system", label: "System", icon: "/icons/computer.svg" },
];

export const sidebarLinks = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  // {
  //   imgURL: "/icons/suitcase.svg",
  //   route: "/jobs",
  //   label: "Find Jobs",
  // },
  {
    imgURL: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const REPUTATION_POINTS: Record<
  string,
  { performer: number; author: number }
> = {
  post_Question: { performer: 5, author: 5 },
  post_Answer: { performer: 10, author: 10 },
  upvote_Question: { performer: 2, author: 10 },
  upvote_Answer: { performer: 2, author: 10 },
  downvote_Question: { performer: -1, author: -2 },
  downvote_Answer: { performer: -1, author: -2 },
  delete_Question: { performer: -5, author: -5 },
  delete_Answer: { performer: -10, author: -10 },
  view_Question: { performer: 1, author: 2 },
  view_Answer: { performer: 1, author: 2 },
  bookmark_Question: { performer: 1, author: 2 },
  bookmark_Answer: { performer: 1, author: 2 },
};

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
