import formidable from 'formidable';
import { type RequestHandler } from 'express';

const formMiddleWare: RequestHandler = (req, res, next) => {
  const form = formidable({
    maxFileSize: 100 * 1024 * 1024,
    keepExtensions: true,
    filter: function ({ mimetype }) {
      return !!mimetype && mimetype.includes('image');
    },
    filename: (name, ext, part, form) => {
      return `${part.name}-${Math.random()}${ext}`;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const body = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value?.[0]])
    );

    req.body = body;
    req.file = files;

    next();
  });
};

export default formMiddleWare;
