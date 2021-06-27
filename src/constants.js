export const types = {
  userTypes: {
    admin: "Admin",
    student: "Student",
  },
};

export const errors = {
  noResource: {
    code: "app/document-not-found",
    message: "Document should be present",
  },
  unexpectedValInternal: {
    code: "app/unexpected-value-internal",
    message: "Internal error, app expected different value",
  },
};
