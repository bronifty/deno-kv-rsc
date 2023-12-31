function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from "https://esm.sh/react@18.2.0";
// import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import sanitizeFilename from "https://esm.sh/sanitize-filename@1.6.3";
import ReactMarkdown from "https://esm.sh/react-markdown@8.0.7";
import readDirectory from "../utils/readdir.js";
import { throwNotFound } from "../utils/form.js";
import { addComment, getCommentsBySlug } from "./db2.js";
export default function Router({
  url
}) {
  let page;
  if (url.pathname === "/") {
    console.log("in rsc server Router; url.pathname is /");
    page = /*#__PURE__*/React.createElement(BlogIndexPage, null);
  } else {
    console.log("in rsc server Router; url.pathname is not /");
    const postSlug = sanitizeFilename(url.pathname.slice(1));
    page = /*#__PURE__*/React.createElement(BlogPostPage, {
      postSlug: postSlug
    });
  }
  return /*#__PURE__*/React.createElement(BlogLayout, null, /*#__PURE__*/React.createElement(React.Fragment, {
    key: url.pathname
  }, page));
}
async function BlogIndexPage() {
  async function getPostSlugs() {
    const directoryPath = "./posts";
    const postFiles = await readDirectory(directoryPath);
    const postSlugs = postFiles.map(file => file.slice(0, file.lastIndexOf(".")));
    return postSlugs;
  }
  const postSlugs = await getPostSlugs();
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h1", null, "Welcome to my blog"), /*#__PURE__*/React.createElement("div", null, postSlugs.map(slug => /*#__PURE__*/React.createElement(Post, {
    key: slug,
    slug: slug
  }))));
}
function BlogPostPage({
  postSlug
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Post, {
    slug: postSlug
  }), /*#__PURE__*/React.createElement(CommentForm, {
    slug: postSlug
  }), /*#__PURE__*/React.createElement(Comments, {
    slug: postSlug
  }));
}
async function Post({
  slug
}) {
  let content;
  try {
    content = await readFile("./posts/" + slug + ".txt", "utf8");
  } catch (err) {
    throwNotFound(err);
  }
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("a", {
    href: "/" + slug
  }, slug)), /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement(ReactMarkdown, {
    children: content,
    components: {
      img: ({
        node,
        ...props
      }) => /*#__PURE__*/React.createElement("img", _extends({
        style: {
          maxWidth: "100%"
        }
      }, props))
    }
  })));
}
async function CommentForm({
  slug
}) {
  return /*#__PURE__*/React.createElement("form", {
    id: `${slug}-form`,
    action: `/${slug}`,
    method: "post"
  }, /*#__PURE__*/React.createElement("input", {
    hidden: true,
    readOnly: true,
    name: "slug",
    value: slug
  }), /*#__PURE__*/React.createElement("textarea", {
    name: "comment",
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Post Comment"));
}

// async function CommentForm({ slug }) {
//   return (
//     <form
//       id={slug + "-form"}
//       onSubmit={function onSubmitHandler(e) {
//         e.preventDefault();
//         const comment = e.target.elements.comment.value;
//         console.log("in the Comment form; comment: ", comment);
//         // const comments = await readFile(`./comments/${slug}.json`, "utf8");
//         // const commentId = comments.length
//         //   ? comments[comments.length - 1].commentId + 1
//         //   : 1;
//         const newComment = { commentId, text: comment, timestamp: Date.now() };
//         // comments.push(newComment);
//         // await writeFile(
//         //   `./comments/${slug}.json`,
//         //   JSON.stringify(comments),
//         //   "utf8"
//         // );
//       }}>
//       <textarea name="comment" required />
//       <button type="submit">Post Comment</button>
//     </form>
//   );
// }

async function Comments({
  slug
}) {
  let comments;
  try {
    // const commentsFile = await readFile("./comments/comments.json", "utf8");
    // const allComments = JSON.parse(commentsFile);
    // comments = allComments.filter((comment) => comment.slug === slug);
    // const comments = await kv.get(["comments"]);
    comments = await getCommentsBySlug({
      slug
    });
    console.log("in RSC Comments; comments: ", comments, "slug: ", slug);
  } catch (err) {
    console.log("No comments found for post:", slug);
    throwNotFound(err);
  }
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", null, "Comments"), /*#__PURE__*/React.createElement("ul", null, comments?.map(comment => /*#__PURE__*/React.createElement("li", {
    key: comment.slug
  }, /*#__PURE__*/React.createElement("p", null, comment.comment), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", null, "by ", comment.author)), /*#__PURE__*/React.createElement("p", null, "at ", Date(comment.timestamp))))));
}
function BlogLayout({
  children
}) {
  const author = "Jae Doe";
  return /*#__PURE__*/React.createElement("html", null, /*#__PURE__*/React.createElement("head", null, /*#__PURE__*/React.createElement("title", null, "My blog")), /*#__PURE__*/React.createElement("body", null, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
    href: "/"
  }, "Home"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("input", null), /*#__PURE__*/React.createElement("hr", null)), /*#__PURE__*/React.createElement("main", null, children), /*#__PURE__*/React.createElement(Footer, {
    author: author
  })));
}
function Footer({
  author
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", null, "(c) ", author, " ", new Date().getFullYear()))));
}