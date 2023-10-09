import multer from 'multer';
import {existsSync, mkdirSync} from 'fs';
import { join, resolve } from 'path';
import ApiError from '../exception/apiError.js';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            
            const id = req.id;
            let pathToFolder;

            if(req.method === 'PUT') {
                pathToFolder = join(resolve(), 'files', 'userFiles', id, 'logo');
            } else if(req.baseUrl === '/api/message') {
                pathToFolder = join(resolve(), 'files', 'dialogFiles', req.url.split('/')[1]);
            } else {
                pathToFolder = join(resolve(), 'files', 'userFiles', id, 'posts');
            }

            if (!existsSync(pathToFolder)) {
                mkdirSync(pathToFolder, { recursive: true });
            }
            
            cb(null, pathToFolder);
        },

        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    }),

    fileFilter: function (req, file, cb) {
        const allowedTypes = ['audio', 'video', 'image'];
        const fileMimeType = file.mimetype.split('/')[0];
        if (allowedTypes.includes(fileMimeType)) {
            cb(null, true);
        } else {    
            cb(ApiError.BadRequest('Не поддерживаемый формат файла!'));
        }
    }
});
        
export default upload;