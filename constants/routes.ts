const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  TAGS: "/tags",
  JOBS: "/jobs",
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/questions/${id}`,
  QUESTION_EDIT: (id: string) => `/questions/${id}/edit`,
  TAG: (id: string) => `/tags/${id}`,
};

export default ROUTES;
