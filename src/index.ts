import * as crypto from 'crypto';

function split(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const arr = [];
  let cur = 0;
  let n = 0;
  while ((n = buffer.indexOf(delimiter, cur)) != -1) {
    arr.push(buffer.slice(cur, n));
    cur = n + delimiter.length;
  }
  arr.push(buffer.slice(cur));
  return arr;
}

export interface Part {
  contentDisposition: {
    directive?: string;
    name?: string;
    filename?: string;
  };
  contentType?: string;
  data: Buffer;
  headers: Buffer;
  [header: string]: any;
}

export interface Multipart {
  boundary: string;
  parts: Part[];
}

const wellKnownTextualContentTypes = [
  'text/plain',
  'text/html',
  'text/xml',
  'text/javascript',
  'application/json',
];

/**
 * pretty print a multipart/form-data payload
 *
 * @param body
 * @param boundary
 * @param textualContentTypes
 * @param maxSizeToShowFullBinaryPayload the size limit to decide if show the full binary payload, show a summary when exceeded
 */
export function prettyPrint(
  body: Buffer,
  boundary?: string,
  textualContentTypes?: string[],
  maxSizeToShowFullBinaryPayload?: number,
): string {
  try {
    return doPrettyPrint(body, boundary, textualContentTypes, maxSizeToShowFullBinaryPayload)
  } catch (e) {
    console.warn('Error occurred when pretty print multipart form data', e)
    return ''
  }
}


function doPrettyPrint(
  body: Buffer,
  boundary?: string,
  textualContentTypes?: string[],
  maxSizeToShowFullBinaryPayload?: number,
): string {
  const multipart = parse(body, boundary);
  if (multipart === empty) return '';

  maxSizeToShowFullBinaryPayload ||= 0
  textualContentTypes ||= wellKnownTextualContentTypes;

  const startLine = `--${multipart.boundary}`;
  const endLine = `${lineFeed}--${multipart.boundary}--`;
  return multipart.parts
    .map((part) => {
      const headers = part.headers.toString();
      const isTextualData = textualContentTypes.includes(
        (part.contentType || 'text/plain').split(';')[0].trim(),
      );
      const data = isTextualData
        ? part.data.toString('utf8')
        : part.data.length >= maxSizeToShowFullBinaryPayload
        ? part.data.toString('base64')
        : `<${
            part.data.length
          } octets>: sha256 ${crypto
            .createHash('sha256')
            .update(part.data)
            .digest('hex')}`;

      return [startLine, headers, '', data].join(lineFeed.toString());
    })
    .join(lineFeed.toString())
    .concat(endLine);
}

function detectBoundary(line: Buffer) {
  if (line.toString().startsWith('--')) {
    return line.toString().substring(2);
  } else {
    console.warn(
      'Multipart boundary cannot be detected, provide a boundary explicitly instead',
    );
    return undefined;
  }
}

function trim(buffer: Buffer, feed: Buffer) {
  const trimLeft = feed.equals(buffer.slice(0, buffer.length));
  const trimRight = feed.equals(
    buffer.slice(buffer.length - feed.length, buffer.length),
  );
  if (trimLeft) {
    buffer = buffer.slice(0, feed.length);
  }
  if (trimRight) {
    buffer = buffer.slice(0, buffer.length - feed.length);
  }
  return buffer;
}

const lineFeed = Buffer.of(0x0d, 0x0a);
const doubleLineFeed = Buffer.of(0x0d, 0x0a, 0x0d, 0x0a);

const empty: Multipart = {
  boundary: undefined,
  parts: []
};

export function parse(body: Buffer, boundary?: string): Multipart {
  try {
    return doParse(body, boundary)
  } catch (e) {
    console.warn('Error occurred when parse multipart form data', e)
    return empty
  }
}


function doParse(body: Buffer, boundary?: string): Multipart {
  if (body.length === 0) {
    return empty;
  }
  // detect boundary
  boundary = boundary || detectBoundary(body.slice(0, body.indexOf(lineFeed)));
  if (!boundary) {
    return empty;
  }
  const startLine = `--${boundary}${lineFeed}`;
  const endLine = `${lineFeed}--${boundary}--`;
  const sections = split(
    body.slice(0, body.indexOf(endLine)),
    Buffer.from(startLine),
  ).filter((it) => it.length > 0);
  if (sections.length === 0) {
    return empty;
  }

  return {
    boundary,
    parts: sections.map((section) => {
      const part: Part = {
        contentDisposition: {},
        data: undefined,
        headers: undefined,
      };
      section = trim(section, lineFeed);
      const [headers, data] = split(section, doubleLineFeed);
      if (!headers || !data) {
        console.warn('Part must have headers and data');
        return part;
      }
      part.headers = headers;
      part.data = trim(data, lineFeed);
      const headerLines = split(headers, lineFeed);
      for (const line of headerLines) {
        if (line.toString().startsWith('Content-Disposition:')) {
          const contentDisposition = line
            .toString()
            .substring('Content-Disposition:'.length)
            .trim();
          const sections = contentDisposition.split(';');
          if (sections.length > 0) {
            const directive = sections[0].trim();
            if (directive === 'form-data') {
              part.contentDisposition = sections
                .slice(1)
                .map((section) => section.split('='))
                .reduce(
                  (a, [k, v]) => ({
                    ...a,
                    [k.trim()]: v.trim().replace(/^"(.+(?="$))"$/, '$1'),
                  }),
                  {},
                );
              part.contentDisposition.directive = directive;
            }
          }
        } else if (line.toString().startsWith('Content-Type:')) {
          part.contentType = line
            .toString()
            .substring('Content-Type:'.length)
            .trim();
        } else {
          Object.assign(
            part,
            line
              .toString()
              .split(':')
              .reduce(
                (a, [k, v]) => ({
                  ...a,
                  [k.trim()]: v.trim(),
                }),
                {},
              ),
          );
        }
      }
      return part;
    }),
  };
}
