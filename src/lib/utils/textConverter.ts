// slugify
export const slugify = (content: string) => {
  return content
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// markdownify - content is expected to be safe HTML or plain text
export const markdownify = (content: string) => {
  return { __html: content };
};

// humanize
export const humanize = (content: string) => {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// titleify
export const titleify = (content: string) => {
  const humanized = humanize(content);
  return humanized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// plainify - strips HTML tags and decodes basic entities
export const plainify = (content: string) => {
  const withoutTags = content.replace(/<\/?[^>]+(>|$)/gm, "");
  const withoutExtraSpaces = withoutTags.replace(/[\r\n]\s*[\r\n]/gm, "");
  return htmlEntityDecoder(withoutExtraSpaces);
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string): string => {
  const entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  return htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => entityList[entity] || entity,
  );
};
